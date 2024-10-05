package com.example.demo.Controller;


import com.example.demo.Service.SaltCalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin
public class SaltCalController {
    @Autowired
    private SaltCalService saltCalService;
    @PostMapping("/user/saltManage/{pond_id}")
    public ResponseEntity<?> saltCal(@RequestBody Map<String, Float> payload, @PathVariable int pond_id){
        float desiredConcentration = payload.get("Concentration");
        float waterChange = 0;
        if(payload.get("waterChange") != null){
            waterChange = payload.get("waterChange");
        }
        else{
            waterChange = 0;
        }
        return ResponseEntity.ok(saltCalService.saltCal(desiredConcentration,waterChange,pond_id));
    }

}
