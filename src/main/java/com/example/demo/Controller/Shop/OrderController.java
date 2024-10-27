package com.example.demo.Controller.Shop;

import com.example.demo.DTO.Shop.OrderItem;
import com.example.demo.DTO.Shop.OrderStatus;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResOrder;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.Shop.OrderService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class OrderController {
    @Autowired
    private OrderService orderS;
    @Autowired
    private JWTUtils jwt;

    @PostMapping("/user/order")
    public ResponseEntity<ReqResOrder> createOrder(@RequestHeader("Authorization") String token) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));

        return ResponseEntity.ok(orderS.createOrder(userId));
    }

    @PutMapping("/user/order/updateOrder/{orderId}")
    public ResponseEntity<ReqResOrder> updateOrder(@PathVariable int orderId, @RequestBody List<OrderItem> detail) {
        return ResponseEntity.ok(orderS.updateOrder(orderId, detail));
    }

    @DeleteMapping("/user/order/deleteOrder/{orderId}")
    public ResponseEntity<ReqResOrder> deleteOrder(@RequestHeader("Authorization") String token, @PathVariable int orderId) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));

        return ResponseEntity.ok(orderS.cancelOrder(userId, orderId));
    }

    @PutMapping("/shop/order/updateStatus/{orderId}")
    public ResponseEntity<ReqResOrder> updateStatus(@PathVariable int orderId, @RequestBody OrderStatus newStatus) {
        return ResponseEntity.ok(orderS.updateOrderStatus(orderId, newStatus));
    }

    @GetMapping("/shop/order/getOrder/{orderId}")
    public ResponseEntity<ReqResOrder> getOrderById(@PathVariable int orderId) {
        return ResponseEntity.ok(orderS.getOrderById(orderId));
    }
    @GetMapping("/user/order/getOrder/{orderId}")
    public ResponseEntity<ReqResOrder> getOrderId(@PathVariable("orderId") int orderId) {
        return ResponseEntity.ok(orderS.getOrderById(orderId));
    }

    @GetMapping("/user/order/listOrder")
    public ResponseEntity<List<ReqResOrder>> getOrderByUserId(@RequestHeader("Authorization") String token) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(orderS.getOrdersByUserId(userId));
    }

    @GetMapping("/shop/order/listStatus")
    public ResponseEntity<List<ReqResOrder>> getOrderStatus() {
        return ResponseEntity.ok(orderS.getOrdersByStatus());
    }
}
