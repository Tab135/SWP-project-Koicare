package com.example.demo.Service.Shop;

import com.example.demo.DTO.Shop.*;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResOrder;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResOrderItem;
import com.example.demo.Repo.Shop.CartRepository;
import com.example.demo.Repo.Shop.OrderItemRepository;
import com.example.demo.Repo.Shop.OrderRepository;
import com.example.demo.Repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService implements IOrderService{

    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private CartRepository cartRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private OrderItemRepository itemRepo;

    @Override
    public ReqResOrder createOrder(int userId) {
        ReqResOrder req = new ReqResOrder();

        // Fetch the cart associated with the user
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user ID: " + userId));

        // Fetch the user associated with the userId
        UserModel user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for user ID: " + userId));

        // Create a new Order instance
        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDateTime.now());
        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus(OrderStatus.PENDING);
        orderRepo.save(order);

        // Create a list to hold the order items for the response
        List<ReqResOrderItem> orderItems = new ArrayList<>();

        // Iterate through each CartItem in the cart and create corresponding OrderItems
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setOrder(order);  // Associate with the order
            orderItem.setPrice(cartItem.getProduct().getPrice());  // Set price based on product price

            // Save each order item to the database
            itemRepo.save(orderItem);

            // Populate the ReqResOrderItem for the response
            ReqResOrderItem reqResOrderItem = new ReqResOrderItem();
            reqResOrderItem.setProductId(cartItem.getProduct().getId());  // Use cartItem to get product
            reqResOrderItem.setQuantity(cartItem.getQuantity());
            reqResOrderItem.setPrice(cartItem.getProduct().getPrice());

            // Add the populated item to the order items list
            orderItems.add(reqResOrderItem);
        }

        // Set the message and order items in the response
        req.setMessage("Order created successfully");
        req.setItems(orderItems);  // Set the populated list of order items
        req.setUserId(userId);  // Optionally set the user ID in the response
        req.setOrderDate(LocalDateTime.now());  // Set the order date
        req.setTotalAmount(cart.getTotalPrice());  // Set the total amount

        return req;  // Return the populated response object
    }

    @Transactional
    @Override
    public ReqResOrder updateOrder(int orderId, List<OrderItem> detail) {
        ReqResOrder req = new ReqResOrder();
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found for ID : " + orderId));
        Map<Integer,Integer> updateQuantityMap = new HashMap<>();
        for(OrderItem item : detail){
            updateQuantityMap.put(item.getProduct().getId(), item.getQuantity());
        }
        for(OrderItem item : order.getOrderItems()){
            Integer newQuantity = updateQuantityMap.get(item.getProduct().getId());
            if (newQuantity != null) {
                // Update quantity
                item.setQuantity(newQuantity);
                // Optionally, recalculate price based on quantity
                item.setPrice(item.getProduct().getPrice().multiply(new BigDecimal(newQuantity)));
            }
        }
        // Recalculate the total amount for the order
        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(item -> item.getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(totalAmount);  // Update the order total amount
        orderRepo.save(order);  // Save the updated order

        // Set response information
        req.setStatusCode(200);
        req.setMessage("Order items updated successfully");
        req.setUserId(order.getUser().getId());
        req.setOrderDate(order.getDate());
        req.setTotalAmount(order.getTotalAmount());
        req.setOrderStatus(order.getOrderStatus());

        // Optionally, populate the items list for the response
        List<ReqResOrderItem> orderItems = order.getOrderItems().stream()
                .map(item -> {
                    ReqResOrderItem reqResOrderItem = new ReqResOrderItem();
                    reqResOrderItem.setProductId(item.getProduct().getId());
                    reqResOrderItem.setQuantity(item.getQuantity());
                    reqResOrderItem.setPrice(item.getPrice());
                    return reqResOrderItem;
                })
                .collect(Collectors.toList());

        req.setItems(orderItems);

        return req;
    }



    @Override
    public ReqResOrder cancelOrder(int userId, int orderId) {
        ReqResOrder req = new ReqResOrder();
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));
        if (order.getUser().getId() != userId) {
            throw new RuntimeException("Order does not belong to this user");
        }

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("Order cannot be canceled as it is already processed");
        }

        order.setOrderStatus(OrderStatus.CANCELED);
        orderRepo.save(order);

        // Set response information
        req.setStatusCode(200);
        req.setMessage("Order canceled successfully");
        req.setUserId(order.getUser().getId());
        req.setOrderDate(order.getDate());
        req.setTotalAmount(order.getTotalAmount());
        req.setOrderStatus(order.getOrderStatus());

        // Optionally, populate the items list for the response
        List<ReqResOrderItem> orderItems = order.getOrderItems().stream()
                .map(item -> {
                    ReqResOrderItem reqResOrderItem = new ReqResOrderItem();
                    reqResOrderItem.setProductId(item.getProduct().getId());
                    reqResOrderItem.setQuantity(item.getQuantity());
                    reqResOrderItem.setPrice(item.getPrice());
                    return reqResOrderItem;
                })
                .collect(Collectors.toList());

        req.setItems(orderItems);

        return req;
    }

    @Override
    public ReqResOrder updateOrderStatus(int orderId, OrderStatus newStatus) {
        ReqResOrder req = new ReqResOrder();
        Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found with ID :" + orderId));
        order.setOrderStatus(newStatus);
        orderRepo.save(order);
        req.setStatusCode(200);
        req.setMessage("Order status updated successfully");
        req.setUserId(order.getUser().getId());
        req.setOrderDate(order.getDate());
        req.setTotalAmount(order.getTotalAmount());
        req.setOrderStatus(order.getOrderStatus());
        List<ReqResOrderItem> reqResOrderItems = order.getOrderItems().stream()
                .map(orderItem -> {
                    ReqResOrderItem reqResOrderItem = new ReqResOrderItem();
                    reqResOrderItem.setProductId(orderItem.getProduct().getId());
                    reqResOrderItem.setQuantity(orderItem.getQuantity());
                    reqResOrderItem.setPrice(orderItem.getPrice());
                    return reqResOrderItem;
                }).collect(Collectors.toList());

        req.setItems(reqResOrderItems);
        return req;
    }


    @Transactional
    @Override
    public ReqResOrder getOrderById(int orderId) {
      ReqResOrder req = new ReqResOrder();
      Order order = orderRepo.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found with ID : " + orderId));
      req.setStatusCode(200);
        req.setMessage("Order retrieved successfully");
        req.setUserId(order.getUser().getId());
        req.setOrderDate(order.getDate());
        req.setTotalAmount(order.getTotalAmount());
        req.setOrderStatus(order.getOrderStatus());

        List<ReqResOrderItem> reqResOrderItems = order.getOrderItems().stream()
                .map(orderItem -> {
                    ReqResOrderItem reqResOrderItem = new ReqResOrderItem();
                    reqResOrderItem.setProductId(orderItem.getProduct().getId());
                    reqResOrderItem.setQuantity(orderItem.getQuantity());
                    reqResOrderItem.setPrice(orderItem.getPrice());
                    return reqResOrderItem;
                }).collect(Collectors.toList());

        req.setItems(reqResOrderItems);
      return req;
    }

    @Override
    public List<ReqResOrder> getOrdersByUserId(int userId) {
        List<Order> orders = orderRepo.findByUserId(userId);
        return orders.stream().map(order -> {
            ReqResOrder reqResOrder = new ReqResOrder();
            reqResOrder.setStatusCode(200);
            reqResOrder.setMessage("Orders retrieved successfully");
            reqResOrder.setUserId(order.getUser().getId());
            reqResOrder.setOrderDate(order.getDate());
            reqResOrder.setTotalAmount(order.getTotalAmount());
            reqResOrder.setOrderStatus(order.getOrderStatus());

            List<ReqResOrderItem> reqResOrderItems = order.getOrderItems().stream()
                    .map(orderItem -> {
                        ReqResOrderItem reqResOrderItem = new ReqResOrderItem();
                        reqResOrderItem.setProductId(orderItem.getProduct().getId());
                        reqResOrderItem.setQuantity(orderItem.getQuantity());
                        reqResOrderItem.setPrice(orderItem.getPrice());
                        return reqResOrderItem;
                    }).collect(Collectors.toList());

            reqResOrder.setItems(reqResOrderItems);
            return reqResOrder;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ReqResOrder> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepo.findByOrderStatus(status);

        // Convert the List<Order> to List<ReqResOrder>
        return orders.stream().map(order -> {
            ReqResOrder reqResOrder = new ReqResOrder();
            reqResOrder.setStatusCode(200);
            reqResOrder.setMessage("Orders retrieved successfully");
            reqResOrder.setUserId(order.getUser().getId());
            reqResOrder.setOrderDate(order.getDate());
            reqResOrder.setTotalAmount(order.getTotalAmount());
            reqResOrder.setOrderStatus(order.getOrderStatus());

            List<ReqResOrderItem> reqResOrderItems = order.getOrderItems().stream()
                    .map(orderItem -> {
                        ReqResOrderItem reqResOrderItem = new ReqResOrderItem();
                        reqResOrderItem.setProductId(orderItem.getProduct().getId());
                        reqResOrderItem.setQuantity(orderItem.getQuantity());
                        reqResOrderItem.setPrice(orderItem.getPrice());
                        return reqResOrderItem;
                    }).collect(Collectors.toList());

            reqResOrder.setItems(reqResOrderItems);
            return reqResOrder;
        }).collect(Collectors.toList());
    }



}
