package com.example.demo.Service.Shop;

import com.example.demo.DTO.Shop.*;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResTracking;
import com.example.demo.Repo.Shop.OrderRepository;
import com.example.demo.Repo.Shop.OrderTrackingRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderTrackingService {
    @Autowired
    private OrderTrackingRepository trackingRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Transactional // Ensures consistency if this is part of a larger transaction
    public ReqResTracking createOrderTracking(int orderId, OrderStatus status) {
        // Initialize the response object
        ReqResTracking req = new ReqResTracking();
        req.setOrderId(orderId);
        req.setStatus(status);
        req.setTimestamp(LocalDateTime.now());

        try {
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

            // Set response fields for successful creation
            req.setStatusCode(200);
            req.setMessage("Order tracking entry created successfully.");
        } catch (Exception e) {
            // Handle exceptions, set error response fields if needed
            req.setStatusCode(500);
            req.setMessage("Failed to create order tracking entry: " + e.getMessage());
        }

        return req;
    }


    @Transactional
    public List<ReqResTracking> listOrderTrackingByUser(int userId) {
        List<OrderTracking> trackingEntries = trackingRepository.findByOrderUserId(userId);

        return trackingEntries.stream().map(entry -> {
                    // Check if the order has any items
                    List<OrderItem> orderItems = entry.getOrder().getOrderItems();

                    if (orderItems.isEmpty()) {
                        // Delete the order if it has no items
                        orderRepository.deleteById(entry.getOrder().getId());
                        return null; // Skip further processing for this order
                    }

                    // Continue processing for orders with items
                    ReqResTracking tracking = new ReqResTracking();
                    tracking.setOrderId(entry.getOrder().getId());
                    tracking.setStatus(entry.getStatus());
                    tracking.setTimestamp(entry.getTimestamp());

                    // Assuming each OrderItem has a reference to ProductModel
                    tracking.setUserName(entry.getOrder().getUser().getName());                    OrderItem firstOrderItem = orderItems.get(0);
                    ProductModel product = firstOrderItem.getProduct();

                    if (product != null) {
                        tracking.setProductName(product.getProductName());

                        // Convert product image byte[] to Base64 string
                        if (product.getProductImage() != null) {
                            String base64Image = Base64.getEncoder().encodeToString(product.getProductImage());
                            tracking.setProductImageBase64("data:image/jpeg;base64," + base64Image);
                        }
                    }

                    tracking.setStatusCode(200);
                    tracking.setMessage("Order tracking entry retrieved successfully.");
                    return tracking;
                })
                // Filter out any null values in case of deleted orders
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
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
        trackingResponse.setUserName(order.getUser().getName());
        trackingResponse.setOrderId(orderId);
        trackingResponse.setStatus(orderTracking.getStatus());
        trackingResponse.setTimestamp(orderTracking.getTimestamp());
        trackingResponse.setUserName(order.getUser().getName());  // Assuming Order model has a reference to User model

        // Add userAddress if it's available in the Order model
        trackingResponse.setUserAddress(order.getUser().getAddress());  // Assuming User model has address field

        // Set totalAmount, assuming it's stored in the Order model
        trackingResponse.setTotalAmount(order.getTotalAmount());
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

