package com.razorpay.payment.controller;

import com.razorpay.payment.dto.CreateOrderRequest;
import com.razorpay.payment.dto.CreateOrderResponse;
import com.razorpay.payment.dto.VerifyPaymentRequest;
import com.razorpay.payment.dto.VerifyPaymentResponse;

import com.razorpay.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public CreateOrderResponse createOrder(@RequestBody CreateOrderRequest request) {
        return paymentService.createOrder(request);
    }

    @PostMapping("/verify")
    public VerifyPaymentResponse verify(@RequestBody VerifyPaymentRequest request) {
        return paymentService.verifyPayment(request);
    }
}