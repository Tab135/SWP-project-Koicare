package com.example.demo.Controller.Shop;

import com.example.demo.DTO.Shop.Cart;
import com.example.demo.DTO.Shop.CartItem;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResCart;
import com.example.demo.Service.Shop.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@CrossOrigin
@RestController
public class CartController {
    @Autowired
    private CartService cartS;
    @PostMapping("/user/cart/addCart/{userid}/{productId}")
    public ResponseEntity<ReqResCart> addToCart(@PathVariable int userid , @PathVariable int productId, @RequestParam int quantity){
        return ResponseEntity.ok(cartS.addToCart(userid,productId,quantity));
    }
    @PutMapping("/user/cart/updateCart/{userid}/{productId}")
    public ResponseEntity<ReqResCart> updateCart(@PathVariable int userid , @PathVariable int productId, @RequestBody int quantity){
        return ResponseEntity.ok(cartS.updateItemQuantity(userid, productId, quantity));
    }
    @DeleteMapping("/user/cart/deleteCartItem/{userid}/{cartItemId}")
    public ResponseEntity<ReqResCart> deleteCartItem(@PathVariable int userid, @PathVariable int cartItemId) {
        return ResponseEntity.ok(cartS.removeItemFromCart(userid, cartItemId));
    }
    @GetMapping("user/cart/totalPrice/{userId}")
    public ResponseEntity<BigDecimal> getTotalPrice(@PathVariable int userId){
        return ResponseEntity.ok(cartS.getTotalPrice(userId));
    }
    @GetMapping("user/cart/getCartByUser/{userId}")
    public ResponseEntity<Cart> getCartByUser(@PathVariable int userId){
        return ResponseEntity.ok(cartS.getCartByUserId(userId));
    }
    @GetMapping("user/cart/getCartByUser/{cartId}/{productId}")
    public ResponseEntity<CartItem> getCartItem(@PathVariable int cartId, @PathVariable int productId){
        return ResponseEntity.ok(cartS.getCartItem(cartId, productId));
    }
}
