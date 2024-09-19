package com.example.demo.Repo;

import com.example.demo.DTO.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepo extends JpaRepository<ProductModel,Integer> {
    Optional<ProductModel> findById(int id);
    void deleteById(int id);

}
