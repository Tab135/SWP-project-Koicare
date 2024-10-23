package com.example.demo.Controller;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.REQUEST_AND_RESPONSE.ResReqKoi;
import com.example.demo.Repo.GrowthRecordRepo;
import com.example.demo.Repo.KoiRepo;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.KoiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.Optional;

@RestController
@RequestMapping("/user")
 public class KoiController {
    @Autowired
    private KoiService kService;
    @Autowired
    private JWTUtils jwt;
    @Autowired
    private KoiRepo koiR;
    @Autowired
    private GrowthRecordRepo gRepo;

    @PostMapping("/{pondId}/addKoi")
        ResponseEntity<ResReqKoi> addKoi(@RequestHeader ("Authorization") String token, @PathVariable int pondId, @ModelAttribute ResReqKoi request, @RequestParam(value ="image", required = false)MultipartFile imageFile){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try {
            if (imageFile !=null && !imageFile.isEmpty()) {
                request.setImage(imageFile);
            } else {
                request.setImage(null);
            }
        } catch (Exception ex) {

        }
        return ResponseEntity.ok(kService.addKoi(request, pondId, userId));
    }

    @GetMapping("/koi/{pondId}")
    ResponseEntity<ResReqKoi> listKoi(@RequestHeader ("Authorization") String token, @PathVariable int pondId) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(kService.getAllKoiByPondId(pondId, userId));
    }

    @GetMapping("/koi")
    ResponseEntity<ResReqKoi> getAllKoi(@RequestHeader ("Authorization") String token){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
    return ResponseEntity.ok((kService.listKoi(userId)));}

    @GetMapping("/koi/detail/{koiId}")
    ResponseEntity<ResReqKoi> getKoi(@RequestHeader ("Authorization") String token, @PathVariable int koiId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));


        return ResponseEntity.ok(kService.getKoi(koiId, userId));
    }



    @GetMapping("/koi-image/{koiId}")
    public ResponseEntity<String> getKoiImage(@PathVariable int koiId) {
        Optional<KoiFishModel> koi = koiR.findById(koiId);

        if (koi.isPresent() && koi.get().getImage() != null) {
            byte[] imageData = koi.get().getImage();

            String base64Image = Base64.getEncoder().encodeToString(imageData);

            return ResponseEntity.ok(base64Image);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        }


    }
    @DeleteMapping("/{pondId}/{koiId}/delete")
    @Transactional
    String deleteKoi(@RequestHeader ("Authorization") String token, @PathVariable int pondId, @PathVariable int koiId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));

        ResReqKoi res = kService.getKoi(koiId, userId);
        if(res.getStatusCode() ==200 ) {
            gRepo.deleteAllByKoiFish_KoiId(koiId);
            kService.deleteKoi(koiId, pondId);
            return "Delete koi success";
        }
        else{
            return "Delete failed, " +res.getStatusCode()+": " + res.getError();
        }
    }

    @PutMapping("/{pondId}/{koiId}")
    ResponseEntity<ResReqKoi> updateKoi(@RequestHeader ("Authorization") String token, @PathVariable int pondId, @PathVariable int koiId, @ModelAttribute ResReqKoi request, @RequestParam(value ="image", required = false) MultipartFile image){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));


        try {
            if (image !=null && !image.isEmpty()) {
                request.setImage(image);
            } else {
                request.setImage(null);
            }
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
        return ResponseEntity.ok(kService.updateKoi(pondId, koiId, request, userId));
    }

    @DeleteMapping("/delete/{koiId}")
    @Transactional
    String deleteWithoutPondId(@RequestHeader ("Authorization") String token, @PathVariable int koiId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));

        ResReqKoi res = kService.getKoi(koiId, userId);
        if(res.getStatusCode() ==200 ) {
            gRepo.deleteAllByKoiFish_KoiId(koiId);
            kService.deleteWithoutId(koiId);
            return "Delete koi success";
        }
        else{
            return "Delete failed, " +res.getStatusCode()+": " + res.getError();
        }
    }

}
