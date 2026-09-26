package com.example.chickensupply.dto;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;
    private String role;
    private String message;
    
    private String name;

    public AuthResponseDTO(String token, String role, String name) {
        this.token = token;
        this.role = role;
        this.name = name;
    }
    
    public AuthResponseDTO(String message) {
        this.message = message;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}
