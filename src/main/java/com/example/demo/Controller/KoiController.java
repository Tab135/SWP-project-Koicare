package com.example.demo.Controller;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqKoi;
import com.example.demo.Service.KoiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
 class KoiController {
    @Autowired
    private KoiService kService;
    @PostMapping("/{userId}/{pondId}/addKoi")
    KoiFishModel addKoi(@PathVariable int pondId, @RequestBody ResReqKoi request){
        return kService.addKoi(request, pondId);
    }

@GetMapping("/koi/{userId}/{pondId}")
List<KoiFishModel> listKoi(@PathVariable int pondId){
        return kService.getAllKoiByPondId(pondId);
}

    @DeleteMapping("/{userId}/{pondId}/{koiId}/delete")
    String deleteKoi(@PathVariable int userId, @PathVariable int koiId, @PathVariable int pondId){
        kService.deleteKoi(koiId, pondId);
        return "Success";
    }

    @PutMapping("/{userId}/{pondId}/{koiId}")
    KoiFishModel updateKoi(@PathVariable int userId, @PathVariable int pondId, @PathVariable int koiId, @RequestBody ResReqKoi request){
        return kService.updateKoi(pondId, koiId, request);
    }

}
