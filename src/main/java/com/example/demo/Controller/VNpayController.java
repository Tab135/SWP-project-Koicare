package com.example.demo.Controller;


import com.example.demo.DTO.Shop.Order;
import com.example.demo.DTO.Shop.OrderItem;
import com.example.demo.DTO.Shop.OrderStatus;
import com.example.demo.DTO.Shop.ProductModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResPayment;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResRevenue;
import com.example.demo.Repo.Shop.OrderRepository;
import com.example.demo.Repo.Shop.ProductRepo;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.RevenueService;
import com.example.demo.Service.Shop.CartService;
import com.example.demo.Service.Shop.OrderService;
import com.example.demo.Service.Shop.OrderTrackingService;
import com.example.demo.Service.VNpayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;

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
    private OrderTrackingService orderTrackingService;
    @Autowired
    private CartService cartService;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private RevenueService revenueService;

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
            @RequestParam int orderId, @RequestHeader("Authorization") String token) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));

        // Remove the user's cart
        cartService.removeCartByUser(userId);

        // Find the order
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        order.setOrderStatus(OrderStatus.PROCESSING); // Set the order status to processing

        // Initialize totalRevenue as BigDecimal
        BigDecimal totalRevenue = BigDecimal.ZERO;

        // Loop through each order item to update product quantities and calculate revenue
        for (OrderItem orderItem : order.getOrderItems()) {
            ProductModel product = productRepo.findById(orderItem.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + orderItem.getProduct().getId()));

            // Check if there is enough stock
            if (product.getAmount() >= orderItem.getQuantity()) {
                // Decrease the product quantity
                product.setAmount(product.getAmount() - orderItem.getQuantity());
                productRepo.save(product); // Save the updated product
            } else {
                throw new RuntimeException("Not enough stock for product ID: " + product.getId());
            }

            // Calculate revenue for this item
            BigDecimal itemRevenue = product.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()));
            totalRevenue = totalRevenue.add(itemRevenue); // Add to total revenue
        }

        // Save the updated order
        orderRepo.save(order); // Make sure to save the updated order
        orderTrackingService.createOrderTracking(orderId, OrderStatus.PROCESSING);

        // Create a revenue record
        ReqResRevenue reqResRevenue = new ReqResRevenue();
        reqResRevenue.setAmount(totalRevenue);
        revenueService.create(userId, reqResRevenue);

        return ResponseEntity.ok("Payment successful, order updated to PROCESSING, cart removed, and revenue recorded.");
    }

}






