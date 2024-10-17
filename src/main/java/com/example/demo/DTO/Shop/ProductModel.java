
        package com.example.demo.DTO.Shop;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.*;

import java.math.BigDecimal;

        @Entity
@Table(name = "Product")
@Data

public class ProductModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Many-to-One relationship with Category
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryModel category;  // Use CategoryModel for proper relationship mapping



    private String productName;

    private BigDecimal price;

    private String description;
    @Lob
    @Column( columnDefinition = "VARBINARY(MAX)")
    private byte[] productImage;

    private int stockQuantity;

    private double productRating;

    private long amount;


    public ProductModel() {
    }

    public ProductModel(int id, long amount, double productRating, int stockQuantity, byte[] productImage, String description, BigDecimal price, String productName, CategoryModel category) {
        this.id = id;
        this.amount = amount;
        this.productRating = productRating;
        this.stockQuantity = stockQuantity;
        this.productImage = productImage;
        this.description = description;
        this.price = price;
        this.productName = productName;
        this.category = category;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getProductRating() {
        return productRating;
    }

    public void setProductRating(double productRating) {
        this.productRating = productRating;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public byte[] getProductImage() {
        return productImage;
    }

    public void setProductImage(byte[] productImage) {
        this.productImage = productImage;
    }

            public BigDecimal getPrice() {
                return price;
            }

            public void setPrice(BigDecimal price) {
                this.price = price;
            }

            public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }



    public CategoryModel getCategory() {
        return category;
    }

    public void setCategory(CategoryModel category) {
        this.category = category;
    }
}