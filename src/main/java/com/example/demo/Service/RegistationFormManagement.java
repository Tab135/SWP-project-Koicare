package com.example.demo.Service;


import com.example.demo.DTO.RegistrationForm;
import com.example.demo.Repo.RegistrationFormRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RegistationFormManagement {

    @Autowired
    private RegistrationFormRepo registrationFormRepo;



    public RegistrationForm createSignup(RegistrationForm shopSignup) {
        shopSignup.setSubmittedAt(LocalDateTime.now());
        shopSignup.setStatus("pending");
        return registrationFormRepo.save(shopSignup);
    }

    public Optional<RegistrationForm> getSignupById(int id) {
        return registrationFormRepo.findById(id);
    }

    public List<RegistrationForm> getAllSignups() {
        return registrationFormRepo.findAll();
    }

    public List<RegistrationForm> getSignupsByStatus(String status) {
        return registrationFormRepo.findByStatus(status);
    }

    public List<RegistrationForm> getSignupsByUserId(int userId) {
        return registrationFormRepo.findByUserId(userId);
    }

    public RegistrationForm updateSignup(RegistrationForm shopSignup) {
        return registrationFormRepo.save(shopSignup);
    }

    public void deleteSignup(int id) {
        registrationFormRepo.deleteById(id);
    }

    public RegistrationForm approveSignup(int id) {
        RegistrationForm signup = registrationFormRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Signup not found"));
        signup.setStatus("approved");
        return registrationFormRepo.save(signup);
    }

    public RegistrationForm rejectSignup(int id) {
        RegistrationForm signup = registrationFormRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Signup not found"));
        signup.setStatus("rejected");
        return registrationFormRepo.save(signup);
    }
}