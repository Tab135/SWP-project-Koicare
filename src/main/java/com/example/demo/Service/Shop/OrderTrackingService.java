package com.example.demo.Service.Shop;

import com.example.demo.DTO.Shop.*;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResTracking;
import com.example.demo.Repo.Shop.OrderRepository;
import com.example.demo.Repo.Shop.OrderTrackingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderTrackingService {
    @Autowired
    private OrderTrackingRepository trackingRepository;
    @Autowired
    private OrderRepository orderRepository;

    public ReqResTracking createOrderTracking(int orderId, OrderStatus status) {
        // Create a new response object
        ReqResTracking req = new ReqResTracking();
        req.setOrderId(orderId);
        req.setStatus(status);
        req.setTimestamp(LocalDateTime.now());

        // Retrieve the order from the repository
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // Create and populate the OrderTracking entity
        OrderTracking orderTracking = new OrderTracking();
        orderTracking.setOrder(order);
        orderTracking.setStatus(status); // Set the status from the input parameter
        orderTracking.setTimestamp(req.getTimestamp()); // Use the current timestamp

        // Save the tracking entity
        trackingRepository.save(orderTracking);

        // Set response fields
        req.setStatusCode(200);
        req.setMessage("Order tracking entry created successfully.");
        return req;
    }

    public List<ReqResTracking> listOrderTrackingByUser(int userId) {
        List<OrderTracking> trackingEntries = trackingRepository.findByOrderUserId(userId);

        return trackingEntries.stream().map(entry -> {
            ReqResTracking tracking = new ReqResTracking();
            tracking.setOrderId(entry.getOrder().getId());
            tracking.setStatus(entry.getStatus());
            tracking.setTimestamp(entry.getTimestamp());

            // Assuming Order has a List<OrderItem> orderItems, and OrderItem has a reference to ProductModel
            List<OrderItem> orderItems = entry.getOrder().getOrderItems(); // Ensure Order has getOrderItems method

            if (!orderItems.isEmpty()) {
                // Get the first order item
                OrderItem firstOrderItem = orderItems.get(0);
                ProductModel product = firstOrderItem.getProduct(); // Ensure OrderItem has a getProduct method

                if (product != null) {
                    tracking.setProductName(product.getProductName()); // Set product name

                    // Convert product image byte[] to Base64 string
                    if (product.getProductImage() != null) {
                        String base64Image = Base64.getEncoder().encodeToString(product.getProductImage());
                        tracking.setProductImageBase64("data:image/jpeg;base64," + base64Image); // Set the Base64 image string
                    }
                }
            }

            tracking.setStatusCode(200);  // Customize status code or any other fields as needed
            tracking.setMessage("Order tracking entry retrieved successfully.");
            return tracking;
        }).collect(Collectors.toList());
    }

    @Transactional
    public ReqResTracking getOrderTrackingByOrderId(int orderId) {
        Optional<OrderTracking> latestTrackingEntry = trackingRepository
                .findTopByOrderIdOrderByTimestampDesc(orderId);

        if (latestTrackingEntry.isEmpty()) {
            throw new RuntimeException("No tracking information found for order ID: " + orderId);
        }

        OrderTracking orderTracking = latestTrackingEntry.get();
        Order order = orderTracking.getOrder();
        ReqResTracking trackingResponse = new ReqResTracking();

        trackingResponse.setOrderId(orderId);
        trackingResponse.setStatus(orderTracking.getStatus());
        trackingResponse.setTimestamp(orderTracking.getTimestamp());

        // List to hold product details
        List<ProductInfo> productList = new ArrayList<>();

        // Loop through all order items to get each product's details
        List<OrderItem> orderItems = order.getOrderItems();
        for (OrderItem orderItem : orderItems) {
            ProductModel product = orderItem.getProduct();
            if (product != null) {
                ProductInfo productInfo = new ProductInfo();
                productInfo.setProductName(product.getProductName());

                // Convert product image byte[] to Base64 string
                if (product.getProductImage() != null) {
                    String base64Image = Base64.getEncoder().encodeToString(product.getProductImage());
                    productInfo.setProductImageBase64("data:image/jpeg;base64," + base64Image);
                }

                productList.add(productInfo);
            }
        }

        trackingResponse.setProducts(productList); // Add product list to response
        trackingResponse.setStatusCode(200);
        trackingResponse.setMessage("Order tracking entry retrieved successfully.");

        return trackingResponse;
    }
}

