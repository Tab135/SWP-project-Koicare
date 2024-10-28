package com.example.demo.Repo;

import com.example.demo.DTO.NewsModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NewsRepo extends JpaRepository<NewsModel, Integer> {

    List<NewsModel> findAllByOrderByDateDescNewsIdDesc();
    boolean existsByHeadline(String headline);
    List<NewsModel> findByHeadlineContainingIgnoreCase(String headLine);
    Optional<NewsModel> findByHeadline (String headLine);
}
