package com.example.demo.DTO;

import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;
import jakarta.persistence.*;

@Getter

@Entity
@Table(name = "product")
@Data
public class ProductModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int product_id;
    private String product_name;
    private float price;
    private String description;
    private String category;
    private int size;
    private String cover;

}
