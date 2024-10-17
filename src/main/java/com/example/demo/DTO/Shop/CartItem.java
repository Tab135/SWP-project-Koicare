package com.example.demo.DTO.Shop;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "CartItem")
@AllArgsConstructor
@Data
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int quantity;

    @Temporal(TemporalType.DATE)
    private Date date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    @JsonBackReference
    private Cart cart;  // Cart is the owning side, ensure it’s properly handled during serialization

    @ManyToOne(fetch = FetchType.EAGER)  // EAGER fetching, but consider changing to LAZY if not always needed
    private ProductModel product;

    public CartItem() {
        // Default constructor
    }

    // Custom constructor allowing to create CartItem with product and quantity
    public CartItem(int id, ProductModel product, int quantity) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.date = new Date();  // Automatically set date to now when creating CartItem
    }

    // Getters and setters if necessary (lombok handles most of these with @Data)

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartItem cartItem = (CartItem) o;
        return Objects.equals(id, cartItem.id);  // Only compare by id
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);  // Only hash by id
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public ProductModel getProduct() {
        return product;
    }

    public void setProduct(ProductModel product) {
        this.product = product;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
