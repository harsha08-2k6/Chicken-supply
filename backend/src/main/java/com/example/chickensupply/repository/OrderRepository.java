package com.example.chickensupply.repository;

import com.example.chickensupply.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByRestaurantIdOrderByDeliveryDateDescDeliveryTimeDesc(Long restaurantId);
    List<Order> findByDeliveryDateOrderByDeliveryTimeAsc(LocalDate deliveryDate);
    List<Order> findByDeliveryDateGreaterThanEqualOrderByDeliveryDateAscDeliveryTimeAsc(LocalDate deliveryDate);
    List<Order> findByDeliveryDateBetweenOrderByDeliveryDateDescDeliveryTimeDesc(LocalDate startDate, LocalDate endDate);
    
    @org.springframework.data.jpa.repository.Query("SELECT MAX(o.dailyOrderNumber) FROM Order o WHERE o.orderDate = :orderDate")
    Integer findMaxDailyOrderNumberByOrderDate(@org.springframework.data.repository.query.Param("orderDate") LocalDate orderDate);
}
