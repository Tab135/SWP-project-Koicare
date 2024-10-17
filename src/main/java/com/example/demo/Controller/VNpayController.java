package com.example.demo.Controller;


import com.example.demo.REQUEST_AND_RESPONSE.ReqResPayment;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResTransaction;
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

    @GetMapping("/create_payment/{userId}")
    public ResponseEntity<?> createPayment(HttpServletRequest req,
                                           @RequestParam long amount,
                                           @RequestParam String orderInfo,
                                           @PathVariable int userId) throws UnsupportedEncodingException {
        ReqResPayment payment = vnpayService.createPayment(req, amount, orderInfo, userId);
        return ResponseEntity.status(HttpStatus.OK).body(payment);
    }

    @GetMapping("/vn-pay-callback/{userId}")
    public ResponseEntity<?> payCallbackHandler(
            @RequestParam(value = "vnp_Amount", required = false) String amount,
            @RequestParam(value = "vnp_BankCode", required = false) String bankCode,
            @RequestParam(value = "vnp_OrderInfo", required = false) String order,
            @RequestParam(value = "vnp_ResponseCode", required = false) String responseCode,
            @PathVariable int userId) {

        ReqResTransaction transaction = new ReqResTransaction();
        if (responseCode.equals("00")) {
            transaction.setStatus("OK");
            transaction.setMessage("Successfully");
            transaction.setData("Money amount: " + amount);

        } else {
            transaction.setStatus("No");
            transaction.setMessage("Failed");
            transaction.setData("");
        }
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }
}

