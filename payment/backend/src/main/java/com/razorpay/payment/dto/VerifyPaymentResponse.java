package com.razorpay.payment.dto;
import com.razorpay.payment.entity.PaymentStatus;

public record VerifyPaymentResponse(PaymentStatus status) {}