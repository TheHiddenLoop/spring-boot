package com.razorpay.payment.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record VerifyPaymentRequest(
        @JsonProperty("razorpay_order_id") String razorpayOrderId,
        @JsonProperty("razorpay_payment_id") String razorpayPaymentId,
        @JsonProperty("razorpay_signature") String razorpaySignature) {}