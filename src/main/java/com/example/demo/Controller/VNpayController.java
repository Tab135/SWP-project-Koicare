package com.example.demo.Controller;


import com.example.demo.REQUEST_AND_RESPONSE.ReqResPayment;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResTransaction;
import com.example.demo.Service.VNpayService;
import com.example.demo.config.VNpayConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/public/payment")
public class VNpayController {
    @Autowired
    private VNpayService vnpayService;
    @GetMapping("/create_payment")
    public ResponseEntity<?> createPayment(HttpServletRequest req,
                                           @RequestParam long amount,
                                           @RequestParam String orderInfo) throws UnsupportedEncodingException {
        ReqResPayment payment = vnpayService.createPayment(req, amount, orderInfo);
        return ResponseEntity.status(HttpStatus.OK).body(payment);
    }

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<?> payCallbackHandler(
            @RequestParam(value = "vnp_Amount",required = false) String amount,
            @RequestParam(value = "vnp_BankCode",required = false) String bankCode,
            @RequestParam(value = "vnp_OrderInfo",required = false) String order,
            @RequestParam(value = "vnp_ResponseCode",required = false) String responseCode){

        ReqResTransaction transaction = new ReqResTransaction();
        if(responseCode.equals("00")){
            transaction.setStatus("OK");
            transaction.setMessage("Successfully");
            transaction.setData(amount);
      }else {
            transaction.setStatus("No");
            transaction.setMessage("Failed");
            transaction.setData("");
      }
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }
}

