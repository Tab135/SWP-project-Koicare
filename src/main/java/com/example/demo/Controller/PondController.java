package com.example.demo.Controller;

import com.example.demo.DTO.PondModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqPond;
import com.example.demo.Service.PondService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class PondController {
@Autowired
    private PondService pService;
@PostMapping("/createPond/{userId}")
ResponseEntity<ResReqPond> createP(@PathVariable int userId, @RequestBody ResReqPond pond){

    return ResponseEntity.ok(pService.createP(pond, userId));
}


@GetMapping("/pond/{userId}")
ResponseEntity<ResReqPond> getPonds(@PathVariable int userId){

    return ResponseEntity.ok(pService.getPondsByUserId(userId));
}

@DeleteMapping("/pond/{userId}/{pondId}")
    String deletePond(@PathVariable int userId, @PathVariable int pondId){
    ResReqPond res = pService.getPond(pondId, userId);
    if(res.getStatusCode() ==200){
        pService.deletePondById(pondId);
        return "Delete success";
    }
    else{
        return "Delete failed, pond not found";
    }

}

@PutMapping("/pond/{userId}/{pondId}/update")
ResponseEntity<ResReqPond> updatePond(@PathVariable  int userId, @PathVariable int pondId, @RequestBody ResReqPond pond){
    return ResponseEntity.ok(pService.updatePond(userId, pondId, pond));

}

}
