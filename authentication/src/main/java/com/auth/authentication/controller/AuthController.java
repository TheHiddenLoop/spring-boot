package com.auth.authentication.controller;

import com.auth.authentication.dto.AuthResponse;
import com.auth.authentication.entity.User;
import com.auth.authentication.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse<User>> register(@RequestBody User user){

        AuthResponse<User> response = authService.register(user);

        if (!response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse<?>> login(@RequestBody User user, HttpServletResponse response) {

        AuthResponse<?> responses = authService.login(user, response);

        if (!responses.isSuccess()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(responses);
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(responses);
    }

}
