package com.example.chickensupply.config;

import com.example.chickensupply.entity.Role;
import com.example.chickensupply.entity.User;
import com.example.chickensupply.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initDatabase(UserRepository userRepository) {
        return args -> {
            // Check if admin already exists
            if (!userRepository.existsByEmail("admin@gmail.com")) {
                User admin = new User();
                admin.setName("Master Admin");
                admin.setEmail("admin@gmail.com");
                // In a real app, this MUST be encrypted using BCrypt.
                // We will add BCrypt integration when we configure Spring Security.
                // For now, storing a placeholder.
                admin.setPasswordHash("admin123"); 
                admin.setPhone("9999999999");
                admin.setRole(Role.ADMIN);
                admin.setApprovalStatus("APPROVED");
                
                userRepository.save(admin);
                System.out.println("Default Admin Account Created: admin@gmail.com / admin123");
            }
        };
    }
}
