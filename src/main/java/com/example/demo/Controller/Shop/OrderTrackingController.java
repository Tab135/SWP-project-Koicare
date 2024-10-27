package com.example.demo.Controller.Shop;

import com.example.demo.DTO.Shop.OrderStatus;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResTracking;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.Shop.OrderTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
public class OrderTrackingController {
    @Autowired
    private OrderTrackingService trackingService;
    @Autowired
    private JWTUtils jwt;
    @PostMapping("/user/track-order/{orderId}")
    public ResponseEntity<ReqResTracking> create(@PathVariable int orderId , @RequestParam OrderStatus status)
    {
        return ResponseEntity.ok(trackingService.createOrderTracking(orderId , status));
    }
    @GetMapping("/user/track/history")
    public ResponseEntity<?> listOrderTrackingByUser(@RequestHeader("Authorization") String token) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        List<ReqResTracking> trackingList = trackingService.listOrderTrackingByUser(userId);

        return ResponseEntity.ok(trackingList);
    }
    @GetMapping("/user/detail/{orderId}")
    public ResponseEntity<?> getDetail(@PathVariable int orderId)
    {
        return ResponseEntity.ok(trackingService.getOrderTrackingByOrderId(orderId));
    }
}
