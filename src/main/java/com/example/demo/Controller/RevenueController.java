package com.example.demo.Controller;

import com.example.demo.REQUEST_AND_RESPONSE.ReqResRevenue;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
public class RevenueController {
    @Autowired
    private RevenueService revenueService;
    @Autowired
    private JWTUtils jwtUtils;

    @GetMapping("/admin/revenue/{start_date}/{end_date}")
    public ResponseEntity<ReqResRevenue> listRevenue(@PathVariable LocalDate start_date, @PathVariable LocalDate end_date) {
        return ResponseEntity.ok(revenueService.listAllByDate(start_date, end_date));

    }

    @PostMapping("/user/revenue")
    public ResponseEntity<ReqResRevenue> create(@RequestHeader("Authorization") String token, @RequestBody ReqResRevenue revenue) {
        int userid = jwtUtils.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(revenueService.create(userid, revenue));
    }
    @GetMapping("/shop/total")
    public ResponseEntity<?> show()
    {
        return ResponseEntity.ok(revenueService.listAllRevenue());
    }


}


