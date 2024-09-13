package com.example.demo.Controller;

import com.example.demo.DTO.PondModel;
import com.example.demo.DTO.PondRequest;
import com.example.demo.Service.PondService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class PondController {
@Autowired
    private PondService pService;
@PostMapping("/createPond/{userId}")
PondModel createP(@PathVariable int userId, @RequestBody PondRequest pond){
    return pService.createP(pond, userId);
}


@GetMapping("/pond/{userId}")
List<PondModel> getPonds(@PathVariable int userId){
    return pService.getPondsByUserId(userId);
}

@DeleteMapping("/pond/{userId}/{pondId}")
    String deletePond(@PathVariable int pondId){
    pService.deletePondById(pondId);
    return "Delete success";
}

@PutMapping("/pond/{userId}/{pondId}/update")
PondModel updatePond(@PathVariable  int userId, @PathVariable int pondId, @RequestBody PondRequest pond){
return pService.updatePond(userId, pondId, pond);
}

}
