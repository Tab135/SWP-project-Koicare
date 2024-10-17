package com.example.demo.DTO.Shop;
import lombok.*;
import jakarta.persistence.*;
@Table (name = "Category")
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryModel {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    @Column(name = "category_id") // Explicit column naming in snake_case
    private int categoryId; // camelCase in Java

    @Column(name = "category_name", nullable = false, length = 100) // Adding constraints
    private String categoryName;

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
