package com.example.demo.Service;

import com.example.demo.DTO.RoleModel;
import com.example.demo.Repo.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepo roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // List of default roles to initialize
        List<String> defaultRoles = Arrays.asList("USER", "ADMIN", "SHOP");

        // Check each role and add it if it doesn't exist
        for (String roleName : defaultRoles) {
            RoleModel existingRole = roleRepository.findByName(roleName);
            if (existingRole == null) {
                RoleModel role = new RoleModel(roleName);
                roleRepository.save(role);
                System.out.println("Role " + roleName + " added to the database.");
            }
        }
    }
}
