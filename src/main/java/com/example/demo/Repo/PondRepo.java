package com.example.demo.Repo;

import com.example.demo.DTO.PondModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PondRepo extends JpaRepository<PondModel, Integer> {
    Optional<PondModel> findById(int id);
    List<PondModel> findAllByUserId(int userId);
    //boolean existsByPondName(String pondName);
}
