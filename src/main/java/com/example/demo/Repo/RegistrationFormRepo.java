package com.example.demo.Repo;


import com.example.demo.DTO.RegistrationForm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationFormRepo extends JpaRepository<RegistrationForm, Integer> {
    List<RegistrationForm> findByStatus(String status);
    List<RegistrationForm> findByUserId(int userId);
}