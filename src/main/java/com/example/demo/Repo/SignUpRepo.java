package com.example.demo.Repo;

import com.example.demo.DTO.SignupOTP;
import com.example.demo.DTO.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SignUpRepo extends JpaRepository<SignupOTP,Integer> {

    Optional<SignupOTP> findByEmail(String email);
    Optional<SignupOTP> findByEmailAndVerified(String email, int verified);
    @Query("select su from SignupOTP su where su.otp = ?1 and su.email = ?2")
    Optional<SignupOTP> findByOtpAndEmail(Integer otp, String email);
}
