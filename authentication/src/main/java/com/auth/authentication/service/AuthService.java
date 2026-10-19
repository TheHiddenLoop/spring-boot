package com.auth.authentication.service;

import com.auth.authentication.dto.AuthResponse;
import com.auth.authentication.entity.User;
import com.auth.authentication.repository.UserRepository;
import com.auth.authentication.security.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CookieValue;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public AuthResponse register(User user){
        if(userRepository.existsByEmail(user.getEmail())){
            return new AuthResponse(false, "Email already exists!", null);
        }

        String hashPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);

        User savedUser = userRepository.save(user);
        return new AuthResponse(true, "Sign up successfully", savedUser);
    }


    public AuthResponse<?> login(User user, HttpServletResponse response) {

        User existUser = userRepository
                .findByEmail(user.getEmail())
                .orElse(null);

        if (existUser == null ||
            !passwordEncoder.matches(
                user.getPassword(),
                existUser.getPassword()
            )) {

            return new AuthResponse<>(
                    false,
                    "Invalid Credentials",
                    null
            );
        }

        String jwtToken = jwtService.generateToken(existUser);

        Cookie cookie = new Cookie("token", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);


        response.addCookie(cookie);

        return new AuthResponse<>(
                true,
                "Login Successful",
                existUser
        );
    }

    public AuthResponse<?> me(User user, @CookieValue("token") String token){

    }
}
