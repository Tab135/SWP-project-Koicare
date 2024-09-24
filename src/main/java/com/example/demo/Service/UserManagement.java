package com.example.demo.Service;

import com.example.demo.DTO.RoleModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResUser;
import com.example.demo.Repo.RoleRepo;
import com.example.demo.Repo.UserRepo;
import com.example.demo.DTO.UserModel;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.parameters.P;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
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
                var jwt = jwtUtils.generateToken(user,user.getId());
                var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(),user);
                resp.setStatusCode(200);
                resp.setRole(user.getRole().getName());
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
    public  ReqResUser getUserByID(int id){
        ReqResUser resp = new ReqResUser();
        try {
            UserModel user = userRepo.findById(id).orElseThrow();
            resp.setUsers(user);
            resp.setStatusCode(200);
            resp.setMessage("User Id:" + id);
        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setMessage("Server Error");
        }
        return resp;
    }

    public ReqResUser updateUser(int userid, UserModel updateUser){
        ReqResUser resp = new ReqResUser();

        try{
            Optional<UserModel> user = userRepo.findById(userid);
            if(user.isPresent()){
                UserModel existingUser = user.get();
                existingUser.setEmail(updateUser.getEmail());
                existingUser.setName(updateUser.getName());
                if(updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()){
                    existingUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                }
                UserModel saved = userRepo.save(existingUser);
                resp.setUsers(saved);
                resp.setStatusCode(200);
                resp.setMessage("Updated successfully");
            }else {
                resp.setStatusCode(404);
                resp.setMessage("User not found");
            }
        }catch (Exception e) {
            resp.setStatusCode(500);
            resp.setMessage("Server error: " + e.getMessage());
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

    public ReqResUser myProfile(String email){
        ReqResUser resp = new ReqResUser();
        try{
            Optional<UserModel> user = userRepo.findByEmail(email);
            if(user.isPresent()){
                resp.setUsers(user.get());
                resp.setStatusCode(200);
                resp.setMessage("success");
            }else{
                resp.setStatusCode(404);
            }
        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());
        }
        return resp;
    }

    public ReqResUser getAllUser(){
        ReqResUser resp = new ReqResUser();

        try{
            List<UserModel> result = userRepo.findAll();
            if(!result.isEmpty()){
                resp.setUsersList(result);
                resp.setStatusCode(200);

            }else {
                resp.setStatusCode(404);
                resp.setMessage("No user found");
            }
        }catch (Exception e){
            resp.setStatusCode(500);
            resp.setMessage(e.getMessage());

        }
        return resp;
    }

}
