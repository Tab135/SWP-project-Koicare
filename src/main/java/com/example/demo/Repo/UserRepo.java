package com.example.demo.Repo;

import com.example.demo.DTO.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface UserRepo extends JpaRepository<UserModel,Integer> {
    Optional<UserModel> findByEmail(String email);
    Optional<UserModel> findById(int id);
    boolean existsByEmail(String email);
    UserModel deleteById(int id);
    @Modifying
    @Transactional
    @Query("update UserModel set password = ?2 where email = ?1")
    int updatePassword(String email, String password);

//    @Query("SELECT u FROM UserModel u WHERE u.id = ?1 AND u.address IS NOT NULL")
//    UserModel findByIdWithNonNullAddress(int id);
}
