package com.example.demo.Repo;

import com.example.demo.DTO.RevenueModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface RevenueRepo extends JpaRepository<RevenueModel, Integer> {

    Optional<RevenueModel> findById(Integer id);
    List<RevenueModel> findAllByDate(LocalDate date);
    List<RevenueModel> findAllByDateBetween(LocalDate startDate, LocalDate endDate);
    List<RevenueModel> findAllByUserId(int userId);
}
