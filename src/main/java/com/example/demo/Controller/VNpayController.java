package com.example.demo.Controller;


import com.example.demo.REQUEST_AND_RESPONSE.ReqResPayment;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.VNpayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/user/payment")
public class VNpayController {
    @Autowired
    private VNpayService vnpayService;

    @Autowired
    private JWTUtils jwt;
    @PostMapping("/create_payment")
    public ResponseEntity<?> createPayment(HttpServletRequest req,
                                           @RequestBody ReqResPayment order,
                                           @RequestHeader ("Authorization") String token) throws UnsupportedEncodingException {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        ReqResPayment payment = vnpayService.createPayment(req, order,userId);
        return ResponseEntity.status(HttpStatus.OK).body(payment);
    }

    @GetMapping("/vn-pay-callback/{userId}")
    public ResponseEntity<?> payCallbackHandler(
            @RequestParam(value = "vnp_Amount", required = false) String amount,
            @RequestParam(value = "vnp_BankCode", required = false) String bankCode,
            @RequestParam(value = "vnp_OrderInfo", required = false) String order,
            @RequestParam(value = "vnp_ResponseCode", required = false) String responseCode,
            @PathVariable int userId) {
        ReqResPayment transaction = new ReqResPayment();
        transaction.setAmount(Long.parseLong(amount));
        transaction.setOrderInfo(order);
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }
}

