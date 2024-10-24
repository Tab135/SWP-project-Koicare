package com.example.demo.Controller.Shop;

import com.example.demo.DTO.Shop.Cart;
import com.example.demo.DTO.Shop.CartItem;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResCart;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.Shop.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@CrossOrigin
@RestController
public class CartController {
    @Autowired
    private CartService cartS;
    @Autowired
    private JWTUtils jwt;
    @PostMapping("/user/cart/addCart/{productId}")
    public ResponseEntity<ReqResCart> addToCart(@RequestHeader ("Authorization") String token, @PathVariable int productId, @RequestBody Map<String, Integer> body){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        int quantity = body.get("quantity");
        return ResponseEntity.ok(cartS.addToCart(userId,productId,quantity));
    }
    @PutMapping("/user/cart/updateCart/{productId}")
    public ResponseEntity<ReqResCart> updateCart(@RequestHeader ("Authorization") String token , @PathVariable int productId, @RequestBody Map<String, Integer> body){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        int quantity = body.get("quantity");
        return ResponseEntity.ok(cartS.updateItemQuantity(userId, productId, quantity));
    }
    @DeleteMapping("/user/cart/deleteCartItem/{cartItemId}")
    public ResponseEntity<ReqResCart> deleteCartItem(@RequestHeader ("Authorization") String token , @PathVariable int cartItemId) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(cartS.removeItemFromCart(userId, cartItemId));
    }
    @GetMapping("/user/cart/totalPrice")
    public ResponseEntity<BigDecimal> getTotalPrice(@RequestHeader ("Authorization") String token ){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(cartS.getTotalPrice(userId));
    }
    @GetMapping("/user/cart/getCartByUser")
    public ResponseEntity<Cart> getCartByUser(@RequestHeader ("Authorization") String token){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(cartS.getCartByUserId(userId));
    }
    @GetMapping("/user/cart/getCart/{cartId}/{productId}")
    public ResponseEntity<CartItem> getCartItem(@PathVariable int cartId, @PathVariable int productId){
        return ResponseEntity.ok(cartS.getCartItem(cartId, productId));
    }
    @GetMapping("/user/count")
    public ResponseEntity<Integer> countItemsInCart(@RequestHeader ("Authorization") String token) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        int itemCount = cartS.countItemInCart(userId);
        return ResponseEntity.ok(itemCount);
    }
}
