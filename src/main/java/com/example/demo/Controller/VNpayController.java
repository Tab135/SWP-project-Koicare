package com.example.demo.Controller;


import com.example.demo.REQUEST_AND_RESPONSE.ReqResPayment;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.Shop.CartService;
import com.example.demo.Service.Shop.OrderService;
import com.example.demo.Service.VNpayService;
import com.example.demo.config.VNpayConfig;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;

import static com.example.demo.config.VNpayConfig.verifyPayment;

@RestController
@RequestMapping("/user/payment")
public class VNpayController {
    @Autowired
    private VNpayService vnpayService;

    @Autowired
    private JWTUtils jwt;

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;
    private static final Logger logger = LoggerFactory.getLogger(VNpayController.class);

    @PostMapping("/create_payment")
    public ResponseEntity<?> createPayment(HttpServletRequest req,
                                           @RequestBody ReqResPayment order,
                                           @RequestHeader("Authorization") String token) throws UnsupportedEncodingException {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        ReqResPayment payment = vnpayService.createPayment(req, order, userId);
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

    @GetMapping("/payment-success")
    public ResponseEntity<?> handlePaymentSuccess(
            HttpServletRequest request,
            @RequestParam String orderId,
            @RequestHeader("Authorization") String token) {

        // Verify the payment response
        boolean isVerified = VNpayConfig.verifyPayment(request);
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_SecureHash = request.getParameter("vnp_SecureHash"); // Make sure to extract this

        // Log for debugging
        logger.info("vnp_SecureHash: {}", vnp_SecureHash); // Log the secure hash for debugging

        // Check for orderId and vnp_ResponseCode
        if (orderId == null || vnp_ResponseCode == null) {
            logger.warn("Invalid payment parameters: orderId or vnp_ResponseCode is null.");
            return ResponseEntity.badRequest().body("Invalid payment parameters.");
        }

        if (!isVerified) {
            logger.warn("Payment verification failed for Order ID: {}", orderId);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid payment response");
        }

        // Check payment success
        if ("00".equals(vnp_ResponseCode)) {
            int userId = jwt.extractUserId(token.replace("Bearer ", ""));
            cartService.removeCartByUser(userId);
            logger.info("Payment successful for Order ID: {}. Cart removed for user ID: {}", orderId, userId);
            return ResponseEntity.ok("Payment successful, order and cart removed");
        } else {
            logger.warn("Payment failed with Response Code: {}", vnp_ResponseCode);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment failed");
        }
    }
}




