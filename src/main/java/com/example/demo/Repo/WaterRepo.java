package com.example.demo.Repo;

import com.example.demo.DTO.RevenueModel;
import com.example.demo.DTO.WaterModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WaterRepo extends JpaRepository<WaterModel,Integer> {
    Optional<WaterModel> findById(int id);
    void deleteById(int id);
    List<WaterModel> findAllByPondId(int pondId);
    void deleteByPondId(int pondId);
    List<WaterModel> findAllByDateBetweenAndPondId(LocalDateTime startDate, LocalDateTime endDate, int pondId);
    List<WaterModel> findByPondIdOrderByIdDesc(int pond_id);
}
