package com.example.demo.DTO;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "com/example/demo/Service/Shop")
@Data
public class ShopModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String shop_name;
    private String description;
    @OneToOne
    private UserModel user;
}
