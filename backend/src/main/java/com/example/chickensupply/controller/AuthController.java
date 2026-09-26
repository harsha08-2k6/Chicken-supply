package com.example.chickensupply.controller;

import com.example.chickensupply.dto.AuthResponseDTO;
import com.example.chickensupply.dto.RegisterRequestDTO;
import com.example.chickensupply.entity.Restaurant;
import com.example.chickensupply.entity.Role;
import com.example.chickensupply.entity.User;
import com.example.chickensupply.entity.Worker;
import com.example.chickensupply.repository.RestaurantRepository;
import com.example.chickensupply.repository.UserRepository;
import com.example.chickensupply.repository.WorkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword()); // No Bcrypt for now per seeder
        user.setPhone(request.getPhone());
        user.setApprovalStatus("PENDING");

        if ("RESTAURANT".equalsIgnoreCase(request.getRole())) {
            user.setRole(Role.RESTAURANT);
            user.setName(request.getOwnerName());
            user = userRepository.save(user);

            Restaurant restaurant = new Restaurant();
            restaurant.setUser(user);
            restaurant.setRestaurantName(request.getRestaurantName());
            restaurant.setOwnerName(request.getOwnerName());
            restaurant.setPhone(request.getPhone());
            restaurant.setAddress(request.getAddress());
            restaurant.setIsActive(false);
            restaurantRepository.save(restaurant);

        } else if ("WORKER".equalsIgnoreCase(request.getRole())) {
            user.setRole(Role.WORKER);
            user.setName(request.getWorkerName());
            user = userRepository.save(user);

            Worker worker = new Worker();
            worker.setUser(user);
            worker.setWorkerName(request.getWorkerName());
            worker.setPhone(request.getPhone());
            worker.setIsActive(false);
            workerRepository.save(worker);
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid role"));
        }

        return ResponseEntity.ok(Map.of("message", "Registration successful! Pending admin approval."));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }

        User user = optionalUser.get();
        if (!user.getPasswordHash().equals(password)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        }

        if ("PENDING".equals(user.getApprovalStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Your account is pending admin approval."));
        } else if ("REJECTED".equals(user.getApprovalStatus())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Your account was rejected."));
        }

        // Generate dummy token for now
        String token = "dummy-token-" + user.getId();
        
        String displayName = user.getName();
        if ("RESTAURANT".equals(user.getRole().name())) {
            Optional<Restaurant> rest = restaurantRepository.findByUserId(user.getId());
            if (rest.isPresent()) {
                displayName = rest.get().getRestaurantName();
            }
        }
        
        return ResponseEntity.ok(new AuthResponseDTO(token, user.getRole().name(), displayName));
    }
}
