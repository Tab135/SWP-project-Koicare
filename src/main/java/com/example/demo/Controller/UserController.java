package com.example.demo.Controller;

import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResUser;
import com.example.demo.Service.UserManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController

public class UserController {
    @Autowired
    private UserManagement userManagement;


    @GetMapping("/auth/controler/google-login")
    public ResponseEntity<ReqResUser> googleLogin(OAuth2AuthenticationToken authentication) {
        HttpHeaders headers = new HttpHeaders();
        return ResponseEntity.ok(userManagement.handleGoogleLogin(authentication));
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<ReqResUser> sendOtpForSignup(@RequestBody ReqResUser signup) {
        return ResponseEntity.ok(userManagement.sendOtpSignUp(signup));
    }

    @PostMapping("/auth/otp-verify/{otp}")
    public ResponseEntity<ReqResUser> verifyOtpAndSignup(
            @PathVariable int otp,
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam String password) {
        return ResponseEntity.ok(userManagement.verifyOtpAndSignup(otp, email, name, password));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqResUser> Login(@RequestBody ReqResUser login) {
        return ResponseEntity.ok(userManagement.Login(login));
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqResUser> deleteUser(@PathVariable int userId) {
        return ResponseEntity.ok(userManagement.Delete(userId));
    }

    @GetMapping("/admin/get-user/{userID}")
    public ResponseEntity<ReqResUser> getUserByID(@PathVariable int userID){
        return ResponseEntity.ok(userManagement.getUserByID(userID));
    }
    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqResUser> getalluser(){
        return  ResponseEntity.ok(userManagement.getAllUser());
    }

    @PostMapping("/auth/checkEmail")
    public ResponseEntity<ReqResUser> checkEmail(@RequestBody ReqResUser checkEmail) {
        return ResponseEntity.ok(userManagement.checkEmail(checkEmail.getEmail()));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqResUser> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqResUser resp = userManagement.myProfile(email);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }
    @PutMapping("/adminuser/update/{userId}")
    public ResponseEntity<ReqResUser> updateUser(@PathVariable int userID, @RequestBody UserModel update){
        return  ResponseEntity.ok(userManagement.updateUser(userID,update));
    }
}
