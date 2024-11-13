package com.example.demo.Repo.Shop;

import com.example.demo.DTO.Shop.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem,Integer> {
    List<OrderItem> findByOrderId(int orderId);

    @Modifying
    @Transactional
    @Query("DELETE FROM OrderItem o WHERE o.product.id = :productId")
    void deleteByProductId(@Param("productId") int productId);
    @Query("SELECT oi FROM OrderItem oi WHERE oi.product.id = :productId AND oi.order.user.id = :userId")
    List<OrderItem> findByProductIdAndUserId(@Param("productId") int productId, @Param("userId") int userId);
}
