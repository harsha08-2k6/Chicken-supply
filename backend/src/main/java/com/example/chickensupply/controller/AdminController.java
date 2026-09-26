package com.example.chickensupply.controller;

import com.example.chickensupply.dto.UserDTO;
import com.example.chickensupply.entity.Restaurant;
import com.example.chickensupply.entity.User;
import com.example.chickensupply.entity.Worker;
import com.example.chickensupply.repository.RestaurantRepository;
import com.example.chickensupply.repository.UserRepository;
import com.example.chickensupply.repository.WorkerRepository;
import com.example.chickensupply.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private WorkerRepository workerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/pending-users")
    public ResponseEntity<List<UserDTO>> getPendingUsers() {
        List<User> pendingUsers = userRepository.findByApprovalStatus("PENDING");
        
        List<UserDTO> dtos = pendingUsers.stream().map(user -> {
            UserDTO dto = new UserDTO();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            dto.setPhone(user.getPhone());
            dto.setRole(user.getRole().name());
            dto.setApprovalStatus(user.getApprovalStatus());

            if ("RESTAURANT".equals(dto.getRole())) {
                restaurantRepository.findByUserId(user.getId()).ifPresent(r -> {
                    dto.setRestaurantName(r.getRestaurantName());
                    dto.setOwnerName(r.getOwnerName());
                    dto.setAddress(r.getAddress());
                });
            } else if ("WORKER".equals(dto.getRole())) {
                workerRepository.findByUserId(user.getId()).ifPresent(w -> {
                    dto.setWorkerName(w.getWorkerName());
                });
            }
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/users/{id}/approve")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setApprovalStatus("APPROVED");
        userRepository.save(user);

        if ("RESTAURANT".equals(user.getRole().name())) {
            restaurantRepository.findByUserId(user.getId()).ifPresent(r -> {
                r.setIsActive(true);
                restaurantRepository.save(r);
            });
        } else if ("WORKER".equals(user.getRole().name())) {
            workerRepository.findByUserId(user.getId()).ifPresent(w -> {
                w.setIsActive(true);
                workerRepository.save(w);
            });
        }

        return ResponseEntity.ok(Map.of("message", "User approved successfully"));
    }

    @PutMapping("/users/{id}/reject")
    public ResponseEntity<?> rejectUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setApprovalStatus("REJECTED");
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of("message", "User rejected successfully"));
    }

    @GetMapping("/stats")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> getStats() {
        List<com.example.chickensupply.entity.Order> orders = orderRepository.findAll();
        
        long todaysOrders = orders.stream()
            .filter(o -> java.time.LocalDate.now().equals(o.getDeliveryDate()))
            .count();
            
        double totalQuantity = orders.stream()
            .filter(o -> java.time.LocalDate.now().equals(o.getDeliveryDate()))
            .flatMap(o -> o.getItems().stream())
            .mapToDouble(i -> i.getQuantity().doubleValue())
            .sum();
            
        long activeRestaurants = restaurantRepository.findAll().stream()
            .filter(r -> Boolean.TRUE.equals(r.getIsActive()))
            .count();
            
        return ResponseEntity.ok(Map.of(
            "todaysOrders", todaysOrders,
            "totalQuantity", totalQuantity,
            "activeRestaurants", activeRestaurants
        ));
    }

    @GetMapping("/orders")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<?> getOrders() {
        List<com.example.chickensupply.entity.Order> orders = orderRepository.findAll();
        orders.sort((o1, o2) -> {
            int dateCmp = o2.getDeliveryDate().compareTo(o1.getDeliveryDate());
            if (dateCmp != 0) return dateCmp;
            return o2.getDeliveryTime().compareTo(o1.getDeliveryTime());
        });
        
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (com.example.chickensupply.entity.Order o : orders) {
            double totalQty = o.getItems().stream().mapToDouble(i -> i.getQuantity().doubleValue()).sum();
            String restaurantName = o.getRestaurant() != null ? o.getRestaurant().getRestaurantName() : "Unknown";
                
            java.util.Map<String, Object> orderMap = new java.util.HashMap<>();
            orderMap.put("id", o.getId());
            orderMap.put("orderNumber", o.getDailyOrderNumber() != null ? o.getDailyOrderNumber() : o.getId());
            orderMap.put("restaurantName", restaurantName);
            orderMap.put("deliveryDate", o.getDeliveryDate());
            orderMap.put("deliveryTime", o.getDeliveryTime());
            orderMap.put("status", o.getStatus());
            orderMap.put("totalQuantity", totalQty);
            result.add(orderMap);
        }
        return ResponseEntity.ok(result);
    }
}
