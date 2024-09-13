package com.example.demo.Repo;

import com.example.demo.DTO.CategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepo extends JpaRepository<CategoryModel,Integer> {
    Optional<CategoryModel> findByCateid(int CateID);
    void deleteByCateid(int id);

}
