package com.example.demo.Controller;

import com.example.demo.DTO.WaterModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResWater;
import com.example.demo.Service.WaterManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class WaterController {
    @Autowired
    private WaterManagement waterM;
    @PostMapping("/auth/WaterMonitor/addWater")
    public ResponseEntity<ReqResWater> addWater(@RequestBody ReqResWater addWater)
    {
        return ResponseEntity.ok(waterM.addWaterMeasurement(addWater));
    }
    @DeleteMapping("/auth/WaterMonitor/deleteWater/{id}")
    public ResponseEntity<ReqResWater> deleteWater(@PathVariable int id){
        return ResponseEntity.ok(waterM.deleteWater(id));
    }
    @PostMapping("/auth/WaterMonitor/updateWater/{id}")
    public ResponseEntity<ReqResWater> updateWater(@PathVariable int id, @RequestBody WaterModel detail)
    {
        return ResponseEntity.ok(waterM.updateWater(id,detail));
    }
}
