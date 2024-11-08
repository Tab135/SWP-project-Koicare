package com.example.demo.REQUEST_AND_RESPONSE.Shop;
import com.example.demo.DTO.Shop.ProductModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReqResProduct {
    private int statusCode;
    private String error;
    private String name;
    private BigDecimal price; // CamelCase for consistency
    private String description;
    private int categoryId;
    private String categoryName;// CamelCase for consistency
    private long amount;
    private double productRating;
    private MultipartFile productImage;
    private String productImageBase64;
    private LocalDateTime createAt;
    private LocalDateTime expiresAt;
    private boolean expired;
    private String expirationPeriod;// CamelCase for consistency
    private String message;
    private ProductModel productM;
    private List<ProductModel> productList;

    public String getExpirationPeriod() {
        return expirationPeriod;
    }

    public void setExpirationPeriod(String expirationPeriod) {
        this.expirationPeriod = expirationPeriod;
    }

    public boolean isExpired() {
        return expired;
    }

    public void setExpired(boolean expired) {
        this.expired = expired;
    }

    public LocalDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(LocalDateTime createAt) {
        this.createAt = createAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public double getProductRating() {
        return productRating;
    }

    public void setProductRating(double productRating) {
        this.productRating = productRating;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getProductImageBase64() {
        return productImageBase64;
    }

    public void setProductImageBase64(String productImageBase64) {
        this.productImageBase64 = productImageBase64;
    }

    public MultipartFile getProductImage() {
        return productImage;
    }

    public void setProductImage(MultipartFile productImage) {
        this.productImage = productImage;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public List<ProductModel> getProductList() {
        return productList;
    }

    public void setProductList(List<ProductModel> productList) {
        this.productList = productList;
    }

    public ProductModel getProductM() {
        return productM;
    }

    public void setProductM(ProductModel productM) {
        this.productM = productM;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getAmount() {
        return amount;
    }

    public void setAmount(long amount) {
        this.amount = amount;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}