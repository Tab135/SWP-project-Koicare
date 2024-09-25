package com.example.demo.Controller;

import com.example.demo.DTO.PondModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResWater;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqPond;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.PondService;
import com.example.demo.Service.WaterManagement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class PondController {
@Autowired
    private PondService pService;

@Autowired
    private JWTUtils jwt;
@PostMapping("/createPond/")
ResponseEntity<ResReqPond> createP(@RequestHeader("Authorization") String token, @RequestBody ResReqPond pond) {
    int userId = jwt.extractUserId(token.replace("Bearer ", ""));
    return ResponseEntity.ok(pService.createP(pond,userId));
}


@GetMapping("/pond")
ResponseEntity<ResReqPond> getPonds(@RequestHeader ("Authorization") String token){
    int userId = jwt.extractUserId(token);
    return ResponseEntity.ok(pService.getPondsByUserId(userId));
}

@DeleteMapping("/pond/{pondId}")
    String deletePond(@RequestHeader ("Authorization") String token, @PathVariable int pondId){
    int userId = jwt.extractUserId(token);
    ResReqPond res = pService.getPond(pondId, userId);
    if(res.getStatusCode() ==200){
        pService.deletePondById(pondId);
        return "Delete success";
    }
    else{
        return "Delete failed, pond not found";
    }

}

@PutMapping("/pond/{pondId}/update")
ResponseEntity<ResReqPond> updatePond(@RequestHeader ("Authorization") String token, @PathVariable int pondId, @RequestBody ResReqPond pond){
    int userId = jwt.extractUserId(token);
    return ResponseEntity.ok(pService.updatePond(userId, pondId, pond));

}

}
