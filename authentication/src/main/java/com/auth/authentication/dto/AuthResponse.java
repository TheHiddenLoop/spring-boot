package com.auth.authentication.dto;

import com.auth.authentication.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
