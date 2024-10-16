package com.example.demo.Controller;

import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResUser;
import com.example.demo.Service.UserManagement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class UserController {
    @Autowired
    private UserManagement userManagement;
    @Autowired
    private OAuth2AuthorizedClientService clientService;
//
//    @PostMapping("/oauth2/logout")
//    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
//        if (authentication instanceof OAuth2AuthenticationToken) {
//            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
//            clientService.removeAuthorizedClient(
//                    oauthToken.getAuthorizedClientRegistrationId(),
//                    oauthToken.getName()
//            );
//        }
//
//        new SecurityContextLogoutHandler().logout(request, response, authentication);
//        return ResponseEntity.ok().body("Logged out successfully");
//    }
//    @ResponseBody
//    @GetMapping("/oauth2/user")
//    public Map<String, Object> Ginfo(@AuthenticationPrincipal OidcUser oidcUser) {
//        // OIDC provides the ID token, which is a JWT token
//        String jwtToken = oidcUser.getIdToken().getTokenValue();
//
//        Map<String, Object> response = new HashMap<>();
//        response.put("userAttributes", oidcUser.getAttributes());
//        response.put("jwtToken", jwtToken);
//        userManagement.handleGoogleLogin(oidcUser);
//
//        return response;
//    }

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

    @GetMapping("/adminusershop/get-profile")
    public ResponseEntity<ReqResUser> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqResUser resp = userManagement.myProfile(email);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }
    @PutMapping("/adminusershop/update/{userID}")
    public ResponseEntity<ReqResUser> updateUser(@PathVariable int userID, @RequestBody UserModel update){
        return  ResponseEntity.ok(userManagement.updateUser(userID,update));
    }

    @PostMapping("/auth/refresh-token")
    public ResponseEntity<ReqResUser> refreshToken(@RequestBody ReqResUser refreshTokenRequest) {
        return ResponseEntity.ok(userManagement.refreshToken(refreshTokenRequest));
    }


}
