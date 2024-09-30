package com.example.demo.Controller;

import com.example.demo.DTO.PondModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqPond;
import com.example.demo.Repo.PondRepo;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.PondService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    ResponseEntity<ResReqPond> createP(@RequestHeader("Authorization") String token, @ModelAttribute ResReqPond pond, @RequestParam("picture") MultipartFile image) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try {
            if (!image.isEmpty()) {
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
    ResponseEntity<ResReqPond> updatePond(@RequestHeader("Authorization") String token, @PathVariable int pondId, @ModelAttribute ResReqPond pond, @RequestParam("picture") MultipartFile picture) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try {
            pond.setPicture(picture);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok(pService.updatePond(userId, pondId, pond));

    }


    @GetMapping("/pond/{pondId}/picture")
    ResponseEntity<byte[]> getPondImage(@RequestHeader("Authorization") String token, @PathVariable int pondId) {

        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        Optional<PondModel> pond = pondR.findById(pondId);

        if (!pond.isPresent() || pond.get().getPicture() == null) {
            return ResponseEntity.notFound().build();
        }

        byte[] picByte = pond.get().getPicture();
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(picByte);
    }
}
