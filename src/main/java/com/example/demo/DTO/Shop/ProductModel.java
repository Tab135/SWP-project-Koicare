
    package com.example.demo.DTO.Shop;

    import com.example.demo.DTO.ReviewModel;
    import com.fasterxml.jackson.annotation.JsonIgnore;
    import jakarta.persistence.Table;
    import lombok.Data;
    import jakarta.persistence.*;

    import java.math.BigDecimal;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.List;

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
        @Column(columnDefinition = "VARBINARY(MAX)")
        private byte[] productImage;

        @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
        @JsonIgnore
        private List<ReviewModel> reviews = new ArrayList<>(); // Initialize the list

        private double productRating;


        private long amount;

        private LocalDateTime createdAt;

        private LocalDateTime expiresAt;

        public ProductModel() {
        }

        public ProductModel(int id, long amount, double productRating, byte[] productImage, String description, BigDecimal price, String productName, CategoryModel category , LocalDateTime createdAt , LocalDateTime expiresAt) {
            this.id = id;
            this.amount = amount;
            this.productRating = productRating;
            this.productImage = productImage;
            this.description = description;
            this.price = price;
            this.productName = productName;
            this.category = category;
            this.createdAt = createdAt;
            this.expiresAt = expiresAt;
        }

        public List<ReviewModel> getReviews() {
            return reviews;
        }

        public void setReviews(List<ReviewModel> reviews) {
            this.reviews = reviews;
        }

        public LocalDateTime getExpiresAt() {
            return expiresAt;
        }

        public void setExpiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
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