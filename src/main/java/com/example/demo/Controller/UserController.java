package com.example.demo.Controller;

import com.example.demo.REQUEST_AND_RESPONSE.ReqResUser;
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
    public ResponseEntity<ReqResUser> Signup(@RequestBody ReqResUser signup) {
        return ResponseEntity.ok(userManagement.Signup(signup));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqResUser> Login(@RequestBody ReqResUser login) {
        return ResponseEntity.ok(userManagement.Login(login));
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqResUser> deleteUser(@PathVariable int userId) {
        return ResponseEntity.ok(userManagement.Delete(userId));
    }

    @PostMapping("/auth/checkEmail")
    public ResponseEntity<ReqResUser> checkEmail(@RequestBody ReqResUser checkEmail) {
        return ResponseEntity.ok(userManagement.checkEmail(checkEmail.getEmail()));
    }
}
