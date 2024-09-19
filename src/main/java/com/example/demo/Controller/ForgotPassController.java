package com.example.demo.Controller;

import com.example.demo.REQUEST_AND_RESPONSE.ReqResUser;
import com.example.demo.Service.ForgotPasswordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/forgotpassword")
public class ForgotPassController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPassController(ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        try {
            forgotPasswordService.sendOtp(email);
            return ResponseEntity.ok("Email sent for verification");
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/verifyOTP/{otp}/{email}")
    public ResponseEntity<String> verifyOtp(@PathVariable int otp, @PathVariable String email) {
        try {
            forgotPasswordService.verifyOtp(otp, email);
            return ResponseEntity.ok("Otp verified");
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/changePassword/{email}")
    public ResponseEntity<ReqResUser> changePassword(@PathVariable String email, @RequestBody ReqResUser changePassword) {
        try {
            return ResponseEntity.ok(forgotPasswordService.changePassword(changePassword.getPassword(), email));
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }
}
