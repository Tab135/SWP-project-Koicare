
        package com.example.demo.Repo.Shop;

import com.example.demo.DTO.Shop.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepo extends JpaRepository<ProductModel,Integer> {
    Optional<ProductModel> findById(int id);
    void deleteById(int id);



    List<ProductModel> findByCategory_CategoryId(int categoryId);
}