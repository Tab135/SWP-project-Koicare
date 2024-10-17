package com.example.demo.Service.Shop;

import com.example.demo.DTO.Shop.Cart;
import com.example.demo.DTO.Shop.CartItem;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResCart;

import java.math.BigDecimal;

public interface ICartService {
    ReqResCart addToCart(int userId, int productId, int quantity);

    ReqResCart removeItemFromCart(int userId, int productId);

    ReqResCart updateItemQuantity(int userId, int productId, int quantity);

    BigDecimal getTotalPrice(int userId);

    Cart getCartByUserId(int userId);

    CartItem getCartItem(int cartId, int productId);
}
