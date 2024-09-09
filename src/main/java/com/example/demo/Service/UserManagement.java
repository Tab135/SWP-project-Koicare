package com.example.demo.Service;

import com.example.demo.DTO.RequestRespone;
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
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public RequestRespone Signup(RequestRespone SignupRequest){
        RequestRespone resp = new RequestRespone();

        try{
            UserModel user = new UserModel();
            user.setEmail(SignupRequest.getEmail());
            user.setPassword(passwordEncoder.encode(SignupRequest.getPassword()));
            user.setName(SignupRequest.getName());
            user.setRole(SignupRequest.getRole());
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

    public  RequestRespone Login(RequestRespone LoginRequest){
        RequestRespone resp = new RequestRespone();

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

    public RequestRespone Delete(int id)
    {
        RequestRespone resp = new RequestRespone();
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
}
