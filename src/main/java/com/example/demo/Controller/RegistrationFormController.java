package com.example.demo.Controller;

import com.example.demo.REQUEST_AND_RESPONSE.ReqResRegistrationForm;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.RegistationFormManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RegistrationFormController {

    @Autowired
    private RegistationFormManagement RF;
    @Autowired
    private JWTUtils jwt;
    @PostMapping("/user/shop-signup")
    public ResponseEntity<ReqResRegistrationForm> SignUp(@RequestHeader("Authorization") String token, @RequestBody ReqResRegistrationForm signup){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(RF.createSignup(signup,userId));
    }

    @PostMapping("/admin/get-all-signup")
    public ResponseEntity<ReqResRegistrationForm> getAllSignUp(){
        return ResponseEntity.ok(RF.getAllSignups());
    }

}
