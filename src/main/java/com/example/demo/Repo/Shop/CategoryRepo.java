package com.example.demo.Repo.Shop;

import com.example.demo.DTO.Shop.CategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepo extends JpaRepository<CategoryModel,Integer> {
    Optional<CategoryModel> findByCategoryId(int categoryId);

    // Delete a category by its ID
    void deleteByCategoryId(int id);

}
