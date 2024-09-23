package com.example.demo.Repo;

import com.example.demo.DTO.ForgotPassword;
import com.example.demo.DTO.UserModel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ForgotPassRepo extends JpaRepository<ForgotPassword,Integer> {

    Optional<ForgotPassword> findByUser(UserModel user);
    Optional<ForgotPassword> findByUserAndVerified(UserModel user, int verified);
    @Query("select fp from ForgotPassword fp where fp.otp = ?1 and fp.user = ?2")
    Optional<ForgotPassword> findByOtpAndUser(Integer otp, UserModel user);
}
