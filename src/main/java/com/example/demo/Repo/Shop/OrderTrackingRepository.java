package com.example.demo.Repo.Shop;

import com.example.demo.DTO.Shop.OrderTracking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderTrackingRepository extends JpaRepository<OrderTracking,Integer> {
    List<OrderTracking> findByOrderUserId(int userId);
    Optional<OrderTracking> findTopByOrderIdOrderByTimestampDesc(int orderId);
    OrderTracking findByOrderId(int orderId);

}
