package com.example.demo.Repo;

import com.example.demo.DTO.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserModel,Integer> {
    Optional<UserModel> findByEmail(String email);
    Optional<UserModel> findById(int id);

    UserModel deleteById(int id);
}
