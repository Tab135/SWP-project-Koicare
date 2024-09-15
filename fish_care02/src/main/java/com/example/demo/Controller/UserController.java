package com.example.demo.Controller;

import com.example.demo.DTO.RequestRespone;
import com.example.demo.Service.UserManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class UserController {
    @Autowired
    private UserManagement userManagement;

    @PostMapping("/auth/signup")
    public ResponseEntity<RequestRespone> Signup(@RequestBody RequestRespone signup){
        return  ResponseEntity.ok(userManagement.Signup(signup));
    }
    @PostMapping("/auth/login")
    public ResponseEntity<RequestRespone> Login(@RequestBody RequestRespone login){
        return  ResponseEntity.ok(userManagement.Login(login));
    }

    @DeleteMapping("/auth/delete/{userId}")
    public ResponseEntity<RequestRespone> deleteUser(@PathVariable int userId){
        return ResponseEntity.ok(userManagement.Delete(userId));
    }
}
