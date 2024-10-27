package com.example.demo.Service.Shop;

import com.example.demo.DTO.Shop.OrderItem;
import com.example.demo.DTO.Shop.OrderStatus;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResCart;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResOrder;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResOrderItem;

import java.util.List;

public interface IOrderService {
    ReqResOrder createOrder(int userId);
    ReqResOrder updateOrder(int userId , List<OrderItem> detail);
    ReqResOrder updateOrderStatus(int orderId , OrderStatus newStatus);
    ReqResOrder getOrderById(int orderId);                     // Read
    List<ReqResOrder> getOrdersByUserId(int userId);          // Read
    List<ReqResOrder> getOrdersByStatus();
    ReqResOrder cancelOrder(int userId ,int orderId );
}
