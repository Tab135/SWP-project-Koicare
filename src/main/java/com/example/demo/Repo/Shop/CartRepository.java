package com.example.demo.Repo.Shop;

import com.example.demo.DTO.Shop.Cart;
import com.example.demo.DTO.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByUserId(int userId);
    boolean existsByUser(UserModel user);
    void deleteByUser(UserModel user);
}
