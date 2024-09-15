package com.example.demo.Service;

import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UserDetailsService;
@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepo.findByEmail(email).orElseThrow();
    }

    public UserDetails loadUserById(int id){
        return userRepo.findById(id).orElseThrow();
    }

    public UserDetails deleteUserById(int id){
        return userRepo.deleteById(id);
    }
}
