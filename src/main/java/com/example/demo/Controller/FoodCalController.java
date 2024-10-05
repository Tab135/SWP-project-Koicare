package com.example.demo.Controller;

import com.example.demo.REQUEST_AND_RESPONSE.ReqResFood;
import com.example.demo.Service.FoodCalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
@RestController
public class FoodCalController {

    @Autowired
    private FoodCalService foodCalService;
    @PostMapping("/public/foodManange/{pond_id}")
    public ResponseEntity<ReqResFood> handleOptionSubmit(@RequestBody Map<String, Integer> payload, @PathVariable int pond_id) {
        int desireGrowth = payload.get("desireGrowth");
        int temperature = payload.get("temperature");
       // int food_split = payload.get("foodSplit");
        return ResponseEntity.ok(foodCalService.CalculateFood(pond_id,temperature,desireGrowth));
    }
}
