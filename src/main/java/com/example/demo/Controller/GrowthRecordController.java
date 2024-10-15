package com.example.demo.Controller;

import com.example.demo.DTO.GrowthRecord;
import com.example.demo.DTO.KoiStatisticId;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResGrowth;
import com.example.demo.Service.GrowthRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/user")
public class GrowthRecordController {
    @Autowired
    private GrowthRecordService growService;

    @PostMapping("/{koiId}/addRecord")
    ResponseEntity<ReqResGrowth> addRecord (@PathVariable Integer koiId, @RequestBody ReqResGrowth request){
        return ResponseEntity.ok(growService.addRecord(request, koiId));
    }

    @GetMapping("/{koiId}/records")
    ResponseEntity<ReqResGrowth> getRecords(@PathVariable Integer koiId){
        return ResponseEntity.ok(growService.getrecords(koiId));
    }
    @GetMapping("/{koiId}/record/{date}")
    ResponseEntity<ReqResGrowth> getRecord(@PathVariable Integer koiId, @PathVariable LocalDate date){
        return  ResponseEntity.ok(growService.getRecord(koiId, date));
    }

    @DeleteMapping("/{userId}/{koiId}/record/delete/{date}")
    String deleteGrowth(@PathVariable Integer koiId, @PathVariable LocalDate date){
        KoiStatisticId id = new KoiStatisticId(date, koiId);
            growService.deleteRecord(id);
            return "Delete success";

    }

    @PutMapping("/{koiId}/record/update/{oldDate}")
    ResponseEntity<ReqResGrowth> updateRecord(@PathVariable Integer koiId, @PathVariable LocalDate oldDate, @RequestBody ReqResGrowth request){
        return ResponseEntity.ok(growService.updateRecord(request, koiId, oldDate));
    }
}
