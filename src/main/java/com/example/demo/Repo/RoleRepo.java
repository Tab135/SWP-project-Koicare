package com.example.demo.Repo;

import com.example.demo.DTO.RoleModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepo extends JpaRepository<RoleModel, Integer> {
    RoleModel findByName(String role);

}
