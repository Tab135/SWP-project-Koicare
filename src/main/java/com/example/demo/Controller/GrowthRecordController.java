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
    ResponseEntity<ReqResGrowth> getRecords(@PathVariable Integer koiId, LocalDate date){
        return ResponseEntity.ok(growService.getrecords(koiId));
    }
    @GetMapping("/{koiId}/record/{date}")
    ResponseEntity<ReqResGrowth> getRecord(@PathVariable Integer koiId, @PathVariable LocalDate date){
        return  ResponseEntity.ok(growService.getRecord(koiId, date));
    }

    @DeleteMapping("/{koiId}/record/delete")
    String deleteGrowth(@PathVariable Integer koiId, @RequestBody ReqResGrowth request){
        KoiStatisticId id = new KoiStatisticId(request.getDate(), koiId);
        ReqResGrowth res = growService.getRecord(koiId, request.getDate());
        if(res.getStatusCode()==200){
            growService.deleteRecord(id);
            return "Delete success";
        }else{
            return "Delete failed, record not found";
        }
    }

    @PutMapping("/{koiId}/record/update/{oldDate}")
    ResponseEntity<ReqResGrowth> updateRecord(@PathVariable Integer koiId, @PathVariable LocalDate oldDate, @RequestBody ReqResGrowth request){
        return ResponseEntity.ok(growService.updateRecord(request, koiId, oldDate));
    }
}
