package com.example.demo.Controller;


import com.example.demo.REQUEST_AND_RESPONSE.ReqResPayment;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResTransaction;
import com.example.demo.config.VNpayConfig;
import jakarta.servlet.http.HttpServletRequest;
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
    @GetMapping("/create_payment")
    public ResponseEntity<?> createPayment(HttpServletRequest req) throws UnsupportedEncodingException {

        // String orderType = "other";
        //long amount = Integer.parseInt(req.getParameter("amount"))*100;
        //String bankCode = req.getParameter("bankCode");

        long amount = 15000 * 100;

        String vnp_TxnRef = VNpayConfig.getRandomNumber(8);
        String vnp_IpAddr = VNpayConfig.getIpAddress(req);

        String vnp_TmnCode = VNpayConfig.vnp_TmnCode;

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VNpayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VNpayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", "NCB");
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "mua hang");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_IpAddr", VNpayConfig.getIpAddress(req));


        vnp_Params.put("vnp_OrderType", "220000");

        vnp_Params.put("vnp_ReturnUrl","http://localhost:8080/public/payment/vn-pay-callback" );


        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                //Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VNpayConfig.hmacSHA512(VNpayConfig.secretKey, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VNpayConfig.vnp_PayUrl + "?" + queryUrl;

        ReqResPayment payment = new ReqResPayment();
        payment.setMessage("Succesfully");
        payment.setStatus(200);
        payment.setURL(paymentUrl);

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
            transaction.setData("");
      }else {
            transaction.setStatus("No");
            transaction.setMessage("Failed");
            transaction.setData("");
      }
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }
}

