package com.example.demo.Repo.Shop;

import com.example.demo.DTO.Shop.Order;
import com.example.demo.DTO.Shop.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(int userId);
    List<Order> findByOrderStatus(OrderStatus status);
    List<Order> findByUserIdAndOrderStatus(int userId, OrderStatus status);
    List<Order> findByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
