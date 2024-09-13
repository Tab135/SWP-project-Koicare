package com.example.demo.DTO;
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
    private int cateid;

    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCateid() {
        return cateid;
    }
}
