package com.example.demo.Repo.Shop;

import com.example.demo.DTO.Shop.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem,Integer> {
    List<OrderItem> findByOrderId(int orderId);
}