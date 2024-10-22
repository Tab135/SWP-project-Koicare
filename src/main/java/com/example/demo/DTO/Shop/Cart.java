package com.example.demo.DTO.Shop;

import com.example.demo.DTO.UserModel;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@Table(name = "Cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date date;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id")
    private List<CartItem> items = new ArrayList<>();  // Initialize items list

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnore
    private UserModel user;

    @Transient  // This ensures the field is not persisted to the DB
    private BigDecimal totalPrice;

    public Cart() {
    }

    public Cart(UserModel user, Date date) {
        this.user = user;
        this.date = date;
        this.items = new ArrayList<>();  // Initialize items
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public int getItemNumber() {
        return this.items.size();  // Dynamically calculated based on the size of the items list
    }

    public BigDecimal getTotalPrice() {
        BigDecimal sum = BigDecimal.ZERO;
        for (CartItem item : this.items) {
            sum = sum.add(item.getProduct().getPrice().multiply(new BigDecimal(item.getQuantity())));
        }
        return sum;  // Dynamically calculates the total price based on items
    }

    public void setDate(Date date) {
        this.date = date;
    }

    // If you still want to store totalPrice explicitly, you can add a setter
    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Date getDate() {
        return date;
    }
}
