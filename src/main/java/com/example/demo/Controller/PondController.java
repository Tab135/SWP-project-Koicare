package com.example.demo.Controller;

import com.example.demo.DTO.PondModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqPond;
import com.example.demo.Repo.PondRepo;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.PondService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class PondController {
    @Autowired
    private PondService pService;

    @Autowired
    private JWTUtils jwt;
    @Autowired
    private PondRepo pondR;

    @PostMapping("/createPond")
    ResponseEntity<ResReqPond> createP(@RequestHeader("Authorization") String token, @ModelAttribute ResReqPond pond, @RequestParam(value ="picture", required = false) MultipartFile image) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try {
            if (image !=null && !image.isEmpty()) {
                pond.setPicture(image);
            } else {
                pond.setPicture(null);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return ResponseEntity.ok(pService.createP(pond, userId));
    }


    @GetMapping("/pond")
    ResponseEntity<ResReqPond> getPonds(@RequestHeader("Authorization") String token) {

        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(pService.getPondsByUserId(userId));
    }

    @DeleteMapping("/pond/{pondId}")
    @Transactional
    String deletePond(@RequestHeader("Authorization") String token, @PathVariable int pondId) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));

        ResReqPond res = pService.getPond(pondId, userId);
        if (res.getStatusCode() == 200) {
            pService.deletePondById(pondId);
            return "Delete success";
        } else {
            return "Delete failed, pond not found";
        }

    }

    @GetMapping("/pond/{pondId}/get")
    ResponseEntity<ResReqPond> getPond(@RequestHeader("Authorization") String token, @PathVariable int pondId) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(pService.getPond(pondId, userId));
    }


    @PutMapping("/pond/{pondId}/update")
    ResponseEntity<ResReqPond> updatePond(@RequestHeader("Authorization") String token, @PathVariable int pondId, @ModelAttribute ResReqPond pond, @RequestParam(value ="picture", required = false) MultipartFile picture) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try {
            if (picture !=null && !picture.isEmpty()) {
                pond.setPicture(picture);
            } else {
                pond.setPicture(null);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(pService.updatePond(userId, pondId, pond));

    }




    @GetMapping("/pond-image/{pondId}")
    public ResponseEntity<String> getPondImage(@PathVariable int pondId) {
        Optional<PondModel> pond = pondR.findById(pondId);

        if (pond.isPresent() && pond.get().getPicture() != null) {
            byte[] imageData = pond.get().getPicture();

            String base64Image = Base64.getEncoder().encodeToString(imageData);

            return ResponseEntity.ok(base64Image);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        }
    }

    @PostMapping("/pond/{oldPondId}/moveAll")
    public ResponseEntity<ResReqPond> moveAllFish(@RequestHeader("Authorization") String token, @PathVariable int oldPondId, @RequestParam("pondId") int newPondId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));

        return ResponseEntity.ok(pService.moveAllFish(oldPondId, newPondId, userId));
    }

    @PostMapping("/pond/{oldPond}/move/{koiId}")
    public ResponseEntity<ResReqPond> moveFish(@RequestHeader("Authorization") String token, @PathVariable int oldPond, @PathVariable int koiId, @RequestParam("pondId") int newPondId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));

        return ResponseEntity.ok(pService.moveFish(oldPond, newPondId, koiId, userId));
    }

    @PostMapping("/pond/moveManyFish")
    public ResponseEntity<ResReqPond> moveManyFish (@RequestHeader("Authorization") String token, @RequestParam("oldPond") int oldPond, @RequestParam("koiList")List<Integer> koiId, @RequestParam("newPond") int newPondId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(pService.moveManyFish(oldPond, newPondId, koiId, userId));
    }

}
