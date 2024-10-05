
        package com.example.demo.Repo;

import com.example.demo.DTO.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepo extends JpaRepository<ProductModel,Integer> {
    Optional<ProductModel> findById(int id);
    void deleteById(int id);
    @Query(value = "SELECT * FROM product WHERE LOWER(product_name) LIKE LOWER(CONCAT('%', :name, '%'))", nativeQuery = true)
    List<ProductModel> searchProductsByName(@Param("name") String name);

}