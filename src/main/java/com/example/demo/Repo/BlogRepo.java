package com.example.demo.Repo;

import com.example.demo.DTO.BlogModel;
import com.example.demo.DTO.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogRepo extends JpaRepository<BlogModel, Integer> {
    boolean existsByTitle(String title);
    List<BlogModel> findAllByOrderByDateDesc();
    List<BlogModel> findAllByAuthor(UserModel author);
    List<BlogModel> findByTitleContainingIgnoreCase(String title);
    Optional<BlogModel> findByTitle(String title);
}
