package com.taskflow.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data @Builder @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
