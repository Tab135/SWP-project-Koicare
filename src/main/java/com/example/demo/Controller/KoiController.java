package com.example.demo.Controller;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqKoi;
import com.example.demo.Service.KoiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
 public class KoiController {
    @Autowired
    private KoiService kService;
    @PostMapping("/{userId}/{pondId}/addKoi")
    ResponseEntity<ResReqKoi> addKoi(@PathVariable int userId, @PathVariable int pondId, @RequestBody ResReqKoi request){
        return ResponseEntity.ok(kService.addKoi(request, pondId, userId));
    }

@GetMapping("/koi/{userId}/{pondId}")
ResponseEntity<ResReqKoi> listKoi(@PathVariable int pondId){

        return ResponseEntity.ok(kService.getAllKoiByPondId(pondId));
}

    @DeleteMapping("/{userId}/{pondId}/{koiId}/delete")
    String deleteKoi(@PathVariable int userId, @PathVariable int koiId, @PathVariable int pondId){
        ResReqKoi res = kService.getKoi(pondId, koiId);
        if(res.getStatusCode() ==200 ) {
            kService.deleteKoi(koiId, pondId);
            return "Delete koi success";
        }
        else{
            return "Delete failed, koi not found";
        }
    }

    @PutMapping("/{userId}/{pondId}/{koiId}")
    ResponseEntity<ResReqKoi> updateKoi(@PathVariable int userId, @PathVariable int pondId, @PathVariable int koiId, @RequestBody ResReqKoi request){
        return ResponseEntity.ok(kService.updateKoi(pondId, koiId, request));
    }

}
