package com.example.chickensupply.controller;

import com.example.chickensupply.entity.Order;
import com.example.chickensupply.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private com.example.chickensupply.repository.RestaurantRepository restaurantRepository;
    
    @Autowired
    private com.example.chickensupply.repository.ChickenTypeRepository chickenTypeRepository;
    
    @Autowired
    private com.example.chickensupply.repository.UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody com.example.chickensupply.dto.OrderRequestDTO request, @RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer dummy-token-")) {
                return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
            }
            Long userId = Long.parseLong(authHeader.substring("Bearer dummy-token-".length()));
            
            var optionalRestaurant = restaurantRepository.findByUserId(userId);
            if (optionalRestaurant.isEmpty()) {
                return ResponseEntity.status(403).body(Map.of("message", "Only restaurants can place orders"));
            }
            
            var restaurant = optionalRestaurant.get();
            
            Order order = new Order();
            order.setRestaurant(restaurant);
            order.setDeliveryDate(request.getDeliveryDate());
            order.setDeliveryTime(request.getDeliveryTime());
            order.setNotes(request.getNotes());
            order.setStatus("PENDING");
            java.time.LocalDate today = java.time.LocalDate.now();
            order.setOrderDate(today);
            order.setCreatedAt(java.time.LocalDateTime.now());
            
            Integer maxDailyNum = orderRepository.findMaxDailyOrderNumberByOrderDate(today);
            order.setDailyOrderNumber(maxDailyNum == null ? 1 : maxDailyNum + 1);
            
            List<com.example.chickensupply.entity.OrderItem> items = new java.util.ArrayList<>();
            for (var itemReq : request.getItems()) {
                var chickenTypeOpt = chickenTypeRepository.findByName(itemReq.getType());
                com.example.chickensupply.entity.ChickenType type;
                if (chickenTypeOpt.isPresent()) {
                    type = chickenTypeOpt.get();
                } else {
                    type = new com.example.chickensupply.entity.ChickenType();
                    type.setName(itemReq.getType());
                    type.setUnit("kg"); // Default
                    type = chickenTypeRepository.save(type);
                }
                
                com.example.chickensupply.entity.OrderItem orderItem = new com.example.chickensupply.entity.OrderItem();
                orderItem.setOrder(order);
                orderItem.setChickenType(type);
                orderItem.setQuantity(java.math.BigDecimal.valueOf(itemReq.getQuantity()));
                items.add(orderItem);
            }
            order.setItems(items);
            
            orderRepository.save(order);
            
            return ResponseEntity.ok(Map.of("message", "Order placed successfully", "orderId", order.getId()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error placing order: " + e.getMessage()));
        }
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<?> getAdminStats() {
        long totalOrders = orderRepository.count();
        return ResponseEntity.ok(Map.of(
            "todaysOrders", totalOrders, // mock logic for demo
            "totalQuantity", "145 kg",
            "activeRestaurants", 12,
            "activeWorkers", 8
        ));
    }

    @GetMapping("/restaurant/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = Long.parseLong(authHeader.substring("Bearer dummy-token-".length()));
            var optRest = restaurantRepository.findByUserId(userId);
            if (optRest.isEmpty()) return ResponseEntity.badRequest().build();
            
            List<Order> orders = orderRepository.findByRestaurantIdOrderByDeliveryDateDescDeliveryTimeDesc(optRest.get().getId());
            
            // Map to response to avoid LazyInitializationException and infinite recursion
            List<Map<String, Object>> result = new java.util.ArrayList<>();
            for (Order o : orders) {
                double totalQty = o.getItems().stream().mapToDouble(i -> i.getQuantity().doubleValue()).sum();
                java.util.Map<String, Object> orderMap = new java.util.HashMap<>();
                orderMap.put("id", o.getId());
                orderMap.put("orderNumber", o.getDailyOrderNumber() != null ? o.getDailyOrderNumber() : o.getId());
                orderMap.put("deliveryDate", o.getDeliveryDate());
                orderMap.put("deliveryTime", o.getDeliveryTime());
                orderMap.put("status", o.getStatus());
                orderMap.put("totalQuantity", totalQty);
                result.add(orderMap);
            }
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/restaurant/stats")
    public ResponseEntity<?> getRestaurantStats(@RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = Long.parseLong(authHeader.substring("Bearer dummy-token-".length()));
            var optRest = restaurantRepository.findByUserId(userId);
            if (optRest.isEmpty()) return ResponseEntity.badRequest().build();
            
            List<Order> orders = orderRepository.findByRestaurantIdOrderByDeliveryDateDescDeliveryTimeDesc(optRest.get().getId());
            
            long todaysOrders = orders.stream().filter(o -> java.time.LocalDate.now().equals(o.getDeliveryDate())).count();
            long pendingOrders = orders.stream().filter(o -> "PENDING".equals(o.getStatus())).count();
            long thisMonthOrders = orders.stream().filter(o -> 
                o.getDeliveryDate().getMonth() == java.time.LocalDate.now().getMonth() && 
                o.getDeliveryDate().getYear() == java.time.LocalDate.now().getYear()
            ).count();
            
            return ResponseEntity.ok(Map.of(
                "todaysOrders", todaysOrders,
                "pendingOrders", pendingOrders,
                "totalMonthlyOrders", thisMonthOrders
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/worker/stats")
    public ResponseEntity<?> getWorkerStats() {
        try {
            java.time.LocalDate today = java.time.LocalDate.now();
            List<Order> todaysOrdersList = orderRepository.findByDeliveryDateOrderByDeliveryTimeAsc(today);
            long todaysOrdersCount = todaysOrdersList.size();
            
            double totalQtyToday = 0;
            for (Order o : todaysOrdersList) {
                totalQtyToday += o.getItems().stream().mapToDouble(i -> i.getQuantity().doubleValue()).sum();
            }
            
            java.time.LocalDate tomorrow = today.plusDays(1);
            List<Order> upcomingOrdersList = orderRepository.findByDeliveryDateGreaterThanEqualOrderByDeliveryDateAscDeliveryTimeAsc(tomorrow);
            long upcomingOrdersCount = upcomingOrdersList.size();
            
            long tomorrowOrdersCount = upcomingOrdersList.stream().filter(o -> o.getDeliveryDate().equals(tomorrow)).count();
            
            return ResponseEntity.ok(Map.of(
                "todaysOrders", todaysOrdersCount,
                "upcomingOrders", upcomingOrdersCount,
                "totalQtyToday", totalQtyToday,
                "tomorrowOrders", tomorrowOrdersCount
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/worker/todays-orders")
    public ResponseEntity<?> getWorkerTodaysOrders() {
        try {
            List<Order> orders = orderRepository.findByDeliveryDateOrderByDeliveryTimeAsc(java.time.LocalDate.now());
            return ResponseEntity.ok(mapOrdersForWorker(orders));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/worker/upcoming-orders")
    public ResponseEntity<?> getWorkerUpcomingOrders() {
        try {
            java.time.LocalDate tomorrow = java.time.LocalDate.now().plusDays(1);
            List<Order> orders = orderRepository.findByDeliveryDateGreaterThanEqualOrderByDeliveryDateAscDeliveryTimeAsc(tomorrow);
            return ResponseEntity.ok(mapOrdersForWorker(orders));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    private List<Map<String, Object>> mapOrdersForWorker(List<Order> orders) {
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (Order o : orders) {
            double totalQty = o.getItems().stream().mapToDouble(i -> i.getQuantity().doubleValue()).sum();
            List<Map<String, Object>> items = new java.util.ArrayList<>();
            for (var item : o.getItems()) {
                java.util.Map<String, Object> itemMap = new java.util.HashMap<>();
                itemMap.put("type", item.getChickenType().getName());
                itemMap.put("quantity", item.getQuantity());
                items.add(itemMap);
            }
            
            java.util.Map<String, Object> orderMap = new java.util.HashMap<>();
            orderMap.put("id", o.getId());
            orderMap.put("orderNumber", o.getDailyOrderNumber() != null ? o.getDailyOrderNumber() : o.getId());
            orderMap.put("restaurantName", o.getRestaurant() != null ? o.getRestaurant().getRestaurantName() : "Unknown");
            orderMap.put("deliveryDate", o.getDeliveryDate());
            orderMap.put("deliveryTime", o.getDeliveryTime());
            orderMap.put("status", o.getStatus());
            orderMap.put("totalQuantity", totalQty);
            orderMap.put("notes", o.getNotes());
            orderMap.put("items", items);
            
            result.add(orderMap);
        }
        return result;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            var orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Order o = orderOpt.get();
            return ResponseEntity.ok(mapOrdersForWorker(List.of(o)).get(0));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderDetails(@PathVariable Long id, @RequestBody com.example.chickensupply.dto.OrderRequestDTO request, @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = Long.parseLong(authHeader.substring("Bearer dummy-token-".length()));
            var optRest = restaurantRepository.findByUserId(userId);
            if (optRest.isEmpty()) return ResponseEntity.status(403).build();
            
            var orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) return ResponseEntity.notFound().build();
            
            Order order = orderOpt.get();
            if (!order.getRestaurant().getId().equals(optRest.get().getId())) {
                return ResponseEntity.status(403).build(); // Only own orders
            }
            if (!"PENDING".equals(order.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Can only edit pending orders"));
            }
            
            order.setDeliveryDate(request.getDeliveryDate());
            order.setDeliveryTime(request.getDeliveryTime());
            order.setNotes(request.getNotes());
            
            order.getItems().clear(); // orphan removal handles the rest
            
            for (var itemReq : request.getItems()) {
                var chickenTypeOpt = chickenTypeRepository.findByName(itemReq.getType());
                com.example.chickensupply.entity.ChickenType type;
                if (chickenTypeOpt.isPresent()) {
                    type = chickenTypeOpt.get();
                } else {
                    type = new com.example.chickensupply.entity.ChickenType();
                    type.setName(itemReq.getType());
                    type.setUnit("kg"); // Default
                    type = chickenTypeRepository.save(type);
                }
                
                com.example.chickensupply.entity.OrderItem orderItem = new com.example.chickensupply.entity.OrderItem();
                orderItem.setOrder(order);
                orderItem.setChickenType(type);
                orderItem.setQuantity(java.math.BigDecimal.valueOf(itemReq.getQuantity()));
                order.getItems().add(orderItem);
            }
            
            orderRepository.save(order);
            
            return ResponseEntity.ok(Map.of("message", "Order updated successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            var orderOpt = orderRepository.findById(id);
            if (orderOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Order order = orderOpt.get();
            order.setStatus(body.get("status"));
            orderRepository.save(order);
            return ResponseEntity.ok(Map.of("message", "Status updated", "status", order.getStatus()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Error updating status"));
        }
    }
}
