package com.example.demo.Controller;

import com.example.demo.DTO.GrowthRecord;
import com.example.demo.DTO.KoiStatisticId;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResGrowth;
import com.example.demo.Service.GrowthRecordService;
import com.example.demo.Service.JWTUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/user")
public class GrowthRecordController {
    @Autowired
    private GrowthRecordService growService;
    @Autowired
    private JWTUtils jwt;


    @PostMapping("/{koiId}/addRecord")
    ResponseEntity<ReqResGrowth> addRecord (@RequestHeader ("Authorization") String token, @PathVariable Integer koiId, @RequestBody ReqResGrowth request){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(growService.addRecord(request, koiId, userId));
    }

    @GetMapping("/{koiId}/records")
    ResponseEntity<ReqResGrowth> getRecords(@RequestHeader ("Authorization") String token, @PathVariable Integer koiId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(growService.getRecords(koiId, userId));
    }
    @GetMapping("/{koiId}/record/{date}")
    ResponseEntity<ReqResGrowth> getRecord(@RequestHeader ("Authorization") String token, @PathVariable Integer koiId, @PathVariable LocalDate date){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return  ResponseEntity.ok(growService.getRecord(koiId, date, userId));
    }

    @DeleteMapping("/{koiId}/record/delete/{date}")
    String deleteGrowth(@RequestHeader ("Authorization") String token, @PathVariable Integer koiId, @PathVariable LocalDate date){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        KoiStatisticId id = new KoiStatisticId(date, koiId);
        ReqResGrowth res = growService.getRecord(koiId, date, userId);
        if(res.getStatusCode() ==200) {
            growService.deleteRecord(id);
            return "Delete success";
        }else{
            return "delete failed, " + res.getStatusCode() +": " + res.getError();
        }
    }

    @PutMapping("/{koiId}/record/update/{date}")
    ResponseEntity<ReqResGrowth> updateRecord(@RequestHeader ("Authorization") String token, @PathVariable Integer koiId, @PathVariable LocalDate date, @RequestBody ReqResGrowth request){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(growService.updateRecord(request, koiId, date, userId));
    }
}
