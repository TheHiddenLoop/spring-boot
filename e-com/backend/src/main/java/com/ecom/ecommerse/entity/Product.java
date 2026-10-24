package com.ecom.ecommerse.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "product")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {

    @Id
    @Column(nullable = false, updatable = false, length = 36)
    @Builder.Default
    private String id = UUID.randomUUID().toString();

    @NotBlank(message = "Product name is required")
    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Brand is required")
    @Column(nullable = false, length = 100)
    private String brand;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @NotBlank(message = "Category is required")
    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @Column(nullable = false)
    private boolean available = true;

    @Min(value = 0, message = "Quantity cannot be negative")
    @Column(nullable = false)
    private int quantity;

    @Column(length = 1000)
    private String imageUrl;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}