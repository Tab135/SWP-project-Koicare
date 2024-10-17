package com.example.demo.Repo.Shop;

import com.example.demo.DTO.Shop.Cart;
import com.example.demo.DTO.Shop.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,Integer> {
}
