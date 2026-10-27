package com.razorpay.payment.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.razorpay.payment.dto.CreateOrderRequest;
import com.razorpay.payment.dto.CreateOrderResponse;
import com.razorpay.payment.dto.VerifyPaymentRequest;
import com.razorpay.payment.dto.VerifyPaymentResponse;
import com.razorpay.payment.entity.PaymentOrder;
import com.razorpay.payment.entity.PaymentStatus;
import com.razorpay.payment.entity.Product;
import com.razorpay.payment.repository.PaymentOrderRepository;
import com.razorpay.payment.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final RazorpayClient razorpayClient;
    private final ProductRepository productRepository;
    private final PaymentOrderRepository paymentOrderRepository;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public CreateOrderResponse createOrder(CreateOrderRequest request){
        Product product = productRepository.findById(request.productId()).orElseThrow(()->new RuntimeException("Product not found"));

        long amountInPaise = product.getPrice().multiply(BigDecimal.valueOf(100)).longValueExact();

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_"+ product.getId() + "_" + System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = order.get("id");

            PaymentOrder paymentOrder = PaymentOrder.builder().product(product).razorpayOrderId(razorpayOrderId).amount(amountInPaise).currency("INR").status(PaymentStatus.CREATED).build();

            paymentOrderRepository.save(paymentOrder);

            return new CreateOrderResponse(razorpayOrderId, amountInPaise, "INR", keyId);
        }catch (Exception e) {
            throw new RuntimeException("Could not create Razorpay order", e);
        }
    }

    public VerifyPaymentResponse verifyPayment(VerifyPaymentRequest request){
        PaymentOrder paymentOrder = paymentOrderRepository.findByRazorpayOrderId(request.razorpayOrderId()).orElseThrow(() -> new RuntimeException("Order not found"));

        try {
            JSONObject attributes = new JSONObject();
            attributes.put("razorpay_order_id", request.razorpayOrderId());
            attributes.put("razorpay_payment_id", request.razorpayPaymentId());
            attributes.put("razorpay_signature", request.razorpaySignature());

            boolean valid = Utils.verifyPaymentSignature(attributes, keySecret);
            paymentOrder.setRazorpayPaymentId(request.razorpayPaymentId());
            paymentOrder.setRazorpaySignature(request.razorpaySignature());
            paymentOrder.setStatus(valid ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);

        }catch (Exception e) {
            paymentOrder.setStatus(PaymentStatus.FAILED);
        }
        paymentOrderRepository.save(paymentOrder);
        return new VerifyPaymentResponse(paymentOrder.getStatus());
    }
}
