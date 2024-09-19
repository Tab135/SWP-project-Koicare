package com.example.demo.Service;

import com.example.demo.DTO.ForgotPassword;
import com.example.demo.DTO.MailDTO;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResUser;
import com.example.demo.Repo.ForgotPassRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class ForgotPasswordService {

    private final UserRepo userRepo;
    private final EmailService emailService;
    private final ForgotPassRepo forgotPassRepo;
    private final UserManagement userManagement;

    @Autowired
    public ForgotPasswordService(UserRepo userRepo, EmailService emailService, ForgotPassRepo forgotPassRepo, UserManagement userManagement) {
        this.userRepo = userRepo;
        this.emailService = emailService;
        this.forgotPassRepo = forgotPassRepo;
        this.userManagement = userManagement;
    }

    public void sendOtp(String email) {
        UserModel user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email"));
        int otp = OtpGen();
        MailDTO mailDTO = MailDTO.builder()
                .to(email)
                .text("OTP for forgot password request: " + otp)
                .subject("KoiFish Control OTP request")
                .build();

        ForgotPassword fp = ForgotPassword.builder()
                .otp(otp)
                .expirationTime(new Date(System.currentTimeMillis() + 120000))
                .user(user)
                .verified(0)
                .build();

        emailService.sendSimpleMessage(mailDTO);
        forgotPassRepo.save(fp);
    }

    public void verifyOtp(int otp, String email) {
        UserModel user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email"));

        ForgotPassword fp = forgotPassRepo.findByOtpAndUser(otp, user)
                .orElseThrow(() -> new RuntimeException("Invalid Otp"));

        if (fp.getExpirationTime().before(Date.from(Instant.now()))) {
            forgotPassRepo.deleteById(fp.getFPid());
            throw new RuntimeException("OTP has expired");
        }

        fp.setVerified(1);
        forgotPassRepo.save(fp);
    }

    public ReqResUser changePassword(String newPassword, String email) {
        UserModel user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please provide a valid email"));

        ForgotPassword fp = forgotPassRepo.findByUserAndVerified(user, 1)
                .orElseThrow(() -> new RuntimeException("OTP not verified or expired"));

        return userManagement.changePassword(newPassword, email);
    }

    private int OtpGen() {
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }
}
