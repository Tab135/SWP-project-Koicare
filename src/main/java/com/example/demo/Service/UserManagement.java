package com.example.demo.Service;

import com.example.demo.DTO.RoleModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResUser;
import com.example.demo.Repo.RoleRepo;
import com.example.demo.Repo.UserRepo;
import com.example.demo.DTO.UserModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Optional;

@Service
public class UserManagement {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private  RoleRepo roleRepo;
    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ReqResUser Signup(ReqResUser SignupRequest){
        ReqResUser resp = new ReqResUser();

        try{
            RoleModel userRole = roleRepo.findByName("USER");
            UserModel user = new UserModel();
            user.setEmail(SignupRequest.getEmail());
            user.setPassword(passwordEncoder.encode(SignupRequest.getPassword()));
            user.setName(SignupRequest.getName());
            user.setRole(userRole);
            UserModel result = userRepo.save(user);

            if(result.getId() > 0){
                resp.setUsers(result);
                resp.setMessage("User Sign up successfully");
                resp.setStatusCode(200);
            }
        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public ReqResUser Login(ReqResUser LoginRequest){
        ReqResUser resp = new ReqResUser();

        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(LoginRequest.getEmail(),LoginRequest.getPassword()));

                var user = userRepo.findByEmail(LoginRequest.getEmail()).orElseThrow();
                var jwt = jwtUtils.generateToken(user);
                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(),user);
                resp.setStatusCode(200);
                resp.setToken(jwt);
                resp.setRefreshToken(refreshToken);
                resp.setMessage("Succesfully logged in");
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public ReqResUser Delete(int id)
    {
        ReqResUser resp = new ReqResUser();
        try{
            Optional<UserModel> user = userRepo.findById(id);
            if(user.isPresent()){
                userRepo.deleteById(id);
                resp.setStatusCode(200);
                resp.setMessage("User deleted");
            }
        }catch (Exception e){
            resp.setStatusCode(404);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }
    public ReqResUser checkEmail(String email){
        ReqResUser resp = new ReqResUser();
        try{
            boolean check = userRepo.existsByEmail(email);
            if (check){
                resp.setStatusCode(200);
                resp.setMessage("Found Email");
            }
            else {
                resp.setStatusCode(404);
                resp.setMessage("No Email found");
            }
        }catch(Exception e){
            resp.setStatusCode(500);
            resp.setMessage("Server Error");
        }
        return resp;
    }
    public ReqResUser changePassword(String password, String email) {
        ReqResUser resp = new ReqResUser();
        try {
            String encodedPassword = passwordEncoder.encode(password);
            int rowsAffected = userRepo.updatePassword(email, encodedPassword);

            if (rowsAffected > 0) {
                resp.setMessage("Password updated successfully");
                resp.setStatusCode(202);
            } else {
                resp.setMessage("Failed to update password, user not found");
                resp.setStatusCode(404);
            }
        } catch (Exception e) {
            resp.setMessage("An error occurred: " + e.getMessage());
            resp.setStatusCode(500);
        }

        return resp;
    }
}
