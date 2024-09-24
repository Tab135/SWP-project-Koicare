package com.example.demo.DTO;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Koi_fish")
@Data
public class KoiFishModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="Koi_fish_Id")
    private int koiId;
    @Column(name = "name")
    private String koiName;
    private int age;
    private double length;
    private double weight;
    private String sex;
    private String variety;
    private String origin;
    private BigDecimal price;
    @Column(name ="pond_id")
    private int pondId;
    @Column(name = "user_id")
    private int userId;

    private String image;

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getKoiId() {
        return koiId;
    }

    public void setKoiId(int koiId) {
        this.koiId = koiId;
    }

    public String getKoiName() {
        return koiName;
    }

    public void setKoiName(String koiName) {
        this.koiName = koiName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        this.length = length;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public int getPondId() {
        return pondId;
    }

    public void setPondId(int pondId) {
        this.pondId = pondId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }



    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public KoiFishModel(String origin, int koiId, String koiName, int age, double length, double weight, String sex, String variety, BigDecimal price, int pondId, int userId, String image) {
        this.origin = origin;
        this.koiId = koiId;
        this.koiName = koiName;
        this.age = age;
        this.length = length;
        this.weight = weight;
        this.sex = sex;
        this.variety = variety;
        this.price = price;
        this.pondId = pondId;
        this.userId = userId;
        this.image = image;
    }

    public KoiFishModel() {
    }
}
