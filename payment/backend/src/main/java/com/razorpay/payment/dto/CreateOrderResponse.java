package com.razorpay.payment.dto;


public record CreateOrderResponse(String orderId, Long amount, String currency, String keyId) {}