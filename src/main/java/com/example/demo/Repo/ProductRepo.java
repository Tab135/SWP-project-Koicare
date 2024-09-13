package com.example.demo.Repo;

import com.example.demo.DTO.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepo extends JpaRepository<ProductModel,Integer> {


}
