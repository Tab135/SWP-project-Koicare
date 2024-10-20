package com.example.demo.Controller.Shop;

import com.example.demo.DTO.Shop.OrderItem;
import com.example.demo.DTO.Shop.OrderStatus;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResOrder;
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
    @PostMapping("/user/order/{userId}")
    public ResponseEntity<ReqResOrder> createOrder(@PathVariable int userId){
        return ResponseEntity.ok(orderS.createOrder(userId));
    }
    @PutMapping("/user/order/updateOrder/{orderId}")
    public ResponseEntity<ReqResOrder> updateOrder(@PathVariable int orderId , @RequestBody List<OrderItem> detail)
    {
        return ResponseEntity.ok(orderS.updateOrder(orderId,detail));
    }
    @DeleteMapping("/user/order/deleteOrder/{userId}/{orderId}")
    public ResponseEntity<ReqResOrder> deleteOrder(@PathVariable int userId , @PathVariable int orderId)
    {
        return ResponseEntity.ok(orderS.cancelOrder(userId, orderId));
    }

    @PutMapping("/shop/order/updateStatus/{orderId}")
    public ResponseEntity<ReqResOrder> updateStatus (@PathVariable int orderId, @RequestBody OrderStatus newStatus){
        return ResponseEntity.ok(orderS.updateOrderStatus(orderId , newStatus));
    }

    @GetMapping("/shop/order/getOrder/{orderId}")
    public ResponseEntity<ReqResOrder> getOrderById(@PathVariable int orderId)
    {
        return ResponseEntity.ok(orderS.getOrderById(orderId));
    }
    @GetMapping("/user/order/listOrder/{userId}")
    public ResponseEntity<List<ReqResOrder>> getOrderByUserId(@PathVariable int userId){
        return ResponseEntity.ok(orderS.getOrdersByUserId(userId));
    }
    @GetMapping("/user/order/listStatus/{status}")
    public ResponseEntity<List<ReqResOrder>> getOrderStatus(@PathVariable OrderStatus status)
    {
        return  ResponseEntity.ok(orderS.getOrdersByStatus(status));
    }
}
