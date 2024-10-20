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

    @PostMapping("/user/WaterMonitor/addWater/{pond_id}")
    public ResponseEntity<ReqResWater> addWater(@RequestBody ReqResWater addWater, @PathVariable int pond_id) {
        return ResponseEntity.ok(waterM.addWaterMeasurement(addWater, pond_id));
    }

    @DeleteMapping("/user/WaterMonitor/deleteWater/{id}")
    public ResponseEntity<ReqResWater> deleteWater(@PathVariable int id) {
        return ResponseEntity.ok(waterM.deleteWater(id));
    }

    @PutMapping("/user/WaterMonitor/updateWater/{id}")
    public ResponseEntity<ReqResWater> updateWater(@PathVariable int id, @RequestBody WaterModel detail) {
        return ResponseEntity.ok(waterM.updateWater(id, detail));
    }

    @GetMapping("/user/WaterMonitor/getWater/{pondId}")
    public ResponseEntity<ReqResWater> getWater(@PathVariable int pondId) {
        return ResponseEntity.ok(waterM.getWater(pondId));
    }
}
