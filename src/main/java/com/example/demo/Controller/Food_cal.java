package com.example.demo.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
public class Food_cal {

    @PostMapping("/public/submit-options")
    public ResponseEntity<String> handleOptionSubmit(@RequestBody Map<String, String> payload) {
        String desireGrowth = payload.get("desireGrowth");
        String temperature = payload.get("temperature");

        // Process the received data as needed
        System.out.println("Desired Growth: " + desireGrowth);
        System.out.println("Temperature Preference: " + temperature);

        return ResponseEntity.ok("Options received");
    }
}
