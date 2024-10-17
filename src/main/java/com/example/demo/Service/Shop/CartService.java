package com.example.demo.Service.Shop;

import com.example.demo.DTO.Shop.Cart;
import com.example.demo.DTO.Shop.CartItem;
import com.example.demo.DTO.Shop.ProductModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResCart;
import com.example.demo.REQUEST_AND_RESPONSE.Shop.ReqResCartItem;
import com.example.demo.Repo.Shop.CartItemRepository;
import com.example.demo.Repo.Shop.CartRepository;
import com.example.demo.Repo.Shop.ProductRepo;
import com.example.demo.Repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CartService implements ICartService {
    @Autowired
    private CartItemRepository itemRepository;
    @Autowired
    private CartRepository cartRepo;
    @Autowired
    private ProductRepo proRepo;
    @Autowired
    private UserRepo userRepository;


    @Override
    @Transactional
    public ReqResCart addToCart(int userId, int productId, int quantity) {
        ReqResCart response = new ReqResCart();

        Optional<ProductModel> pm = proRepo.findById(productId);
        Optional<UserModel> um = userRepository.findById(userId);

        if (pm.isEmpty()) {
            response.setStatusCode(404);
            response.setError("Product not found");
            return response;
        }
        if (um.isEmpty()) {
            response.setStatusCode(404);
            response.setError("User not found");
            return response;
        }

        Optional<Cart> cart = cartRepo.findByUserId(userId);
        Cart userCart = cart.orElse(new Cart(um.get(), new Date()));

        if (userCart.getItems() == null) {
            userCart.setItems(new ArrayList<>());
        }

        Optional<CartItem> existingCartItem = userCart.getItems().stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst();

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setProduct(pm.get());
            newItem.setQuantity(quantity);
            newItem.setDate(new Date());
            newItem.setCart(userCart);  // Set the current cart as the cart for the item
            userCart.getItems().add(newItem);
        }

        BigDecimal total = userCart.getItems().stream()
                .map(item -> item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        userCart.setTotalPrice(total);
        userCart.setDate(new Date());

        cartRepo.save(userCart);

        response.setCartId(userCart.getId());
        response.setUserId(userId);
        response.setItems(userCart.getItems());
        response.setItemNumber(userCart.getItems().size());
        response.setTotalPrice(userCart.getTotalPrice());
        response.setDate(userCart.getDate());
        response.setStatusCode(200);
        response.setMessage("Product added to cart successfully");

        return response;
    }


    @Override
    public ReqResCart removeItemFromCart(int userId, int cartItemId) {
        ReqResCart req = new ReqResCart();
        Cart cart = cartRepo.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cart not found"));

        // Check if the cart is empty
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty, no items to remove");
        }

        // Find the CartItem to remove by CartItem id
        CartItem itemToRemove = cart.getItems().stream()
                .filter(item -> item.getId() == cartItemId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("CartItem not found"));

        // Remove the item from the cart
        cart.getItems().remove(itemToRemove);
        itemRepository.delete(itemToRemove);
        // Update the total price (if necessary) and save the cart
        cart.setTotalPrice(cart.getTotalPrice());
        cartRepo.save(cart);

        return mapToReqResCart(cart);

    }

    @Override
    public ReqResCart updateItemQuantity(int userId, int productId, int quantity) {
        ReqResCart req = new ReqResCart();
        Optional<UserModel> um = userRepository.findById(userId);
        if (!um.isPresent()) {
            req.setStatusCode(404);
            req.setMessage("User not found");
            return req;
        }
        Optional<ProductModel> pm = proRepo.findById(productId);
        if (!pm.isPresent()) {
            req.setStatusCode(404);
            req.setMessage("Product not found");
            return req;
        }
        Optional<Cart> cart = cartRepo.findByUserId(userId);
        if (cart.isEmpty()) {
            req.setStatusCode(404);
            req.setMessage("Cart not found");
            return req;
        }
        Cart userCart = cart.get();
        Optional<CartItem> cartItemOptional = userCart.getItems().stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst();
        if (cartItemOptional.isPresent()) {
            CartItem cartItem = cartItemOptional.get();
            if (quantity > 0) {
                cartItem.setQuantity(quantity);
            } else {
                userCart.getItems().remove(cartItem);
            }

            BigDecimal total = userCart.getItems().stream()
                    .map(item -> item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            userCart.setTotalPrice(total);
            userCart.setDate(new Date());
            cartRepo.save(userCart);
            req.setCartId(userCart.getId());
            req.setUserId(userId);
            req.setItems(userCart.getItems());
            req.setItemNumber(userCart.getItems().size()); // Update the item number
            req.setTotalPrice(userCart.getTotalPrice());  // Set total price
            req.setDate(userCart.getDate());  // Set cart date
            req.setStatusCode(200);
            req.setMessage("Cart item updated successfully");
        } else {
            req.setStatusCode(404);
            req.setError("Cart item not found");
        }
        return req;
    }



    public ReqResCart mapToReqResCart(Cart cart) {
        ReqResCart reqResCart = new ReqResCart();
        reqResCart.setCartId(cart.getId());
        reqResCart.setDate(cart.getDate());
        reqResCart.setTotalPrice(cart.getTotalPrice());
        reqResCart.setItemNumber(cart.getItemNumber());

        // Directly map CartItem list
        reqResCart.setItems(cart.getItems());  // Assuming you just need the CartItem data

        return reqResCart;
    }



    @Override
    public BigDecimal getTotalPrice(int userId) {
        // Find the cart associated with the userId (assuming cartRepo is a repository for Cart)
        Cart cart = cartRepo.findByUserId(userId).orElseThrow(() -> new RuntimeException("Cart not found for user: " + userId));
        // Initialize total price to 0
        BigDecimal totalPrice = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            totalPrice = totalPrice.add(item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())));
        }
        return totalPrice;
    }

    @Override
    public Cart getCartByUserId(int userId) {
        return cartRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    @Override
    public CartItem getCartItem(int cartId, int productId) {
        Cart cart = cartRepo.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // Find the CartItem in the cart using productId
        return cart.getItems().stream()
                .filter(item -> item.getProduct().getId() == productId)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Product not found in cart"));
    }
}
