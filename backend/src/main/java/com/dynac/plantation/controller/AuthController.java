package com.dynac.plantation.controller;

import com.dynac.plantation.model.User;
import com.dynac.plantation.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3002")
public class AuthController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        if (userService.existsByEmail(payload.get("email"))) {
            response.put("error", "Email already in use.");
            return response;
        }
        User user = new User();
        user.setUsername(payload.get("username"));
        user.setEmail(payload.get("email"));
        user.setPassword(payload.get("password"));
        User saved = userService.register(user);
        saved.setPassword(null); // Don't send password to frontend
        response.put("user", saved);
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> payload) {
        Map<String, Object> response = new HashMap<>();
        User user = userService.login(payload.get("email"), payload.get("password")).orElse(null);
        if (user == null) {
            response.put("error", "Invalid email or password.");
            return response;
        }
        user.setPassword(null);
        response.put("user", user);
        return response;
    }
}
