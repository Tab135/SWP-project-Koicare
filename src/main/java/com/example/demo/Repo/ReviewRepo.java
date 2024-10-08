package com.example.demo.Repo;

import com.example.demo.DTO.ReviewModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepo extends JpaRepository<ReviewModel,Integer> {
    List<ReviewModel> findAllByProductId(int id);
    ReviewModel deleteById(int id);
    Optional<ReviewModel> findById(int id);
}
