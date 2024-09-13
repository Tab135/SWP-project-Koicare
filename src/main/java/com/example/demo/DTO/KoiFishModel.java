package com.example.demo.DTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Data
public class KoiFishModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int koiId;

    private String koiName;
    private int age;
    private double length;
    private double weight;
    private String sex;
    private String variety;
    private String origin;
    private BigDecimal price;
    private int pondId;
    private String healthStatus;
    private LocalDate lastMedicalCheck;
    private String feedingSchedule;
    private String image;

    public KoiFishModel(LocalDate lastMedicalCheck, int koiId, String koiName, int age, double length, double weight, String sex, String variety, String origin, BigDecimal price, int pondId, String healthStatus, String feedingSchedule, String image) {
        this.lastMedicalCheck = lastMedicalCheck;
        this.koiId = koiId;
        this.koiName = koiName;
        this.age = age;
        this.length = length;
        this.weight = weight;
        this.sex = sex;
        this.variety = variety;
        this.origin = origin;
        this.price = price;
        this.pondId = pondId;
        this.healthStatus = healthStatus;
        this.feedingSchedule = feedingSchedule;
        this.image = image;
    }

    public KoiFishModel() {
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getPondId() {
        return pondId;
    }

    public void setPondId(int pondId) {
        this.pondId = pondId;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public LocalDate getLastMedicalCheck() {
        return lastMedicalCheck;
    }

    public void setLastMedicalCheck(LocalDate lastMedicalCheck) {
        this.lastMedicalCheck = lastMedicalCheck;
    }

    public String getFeedingSchedule() {
        return feedingSchedule;
    }

    public void setFeedingSchedule(String feedingSchedule) {
        this.feedingSchedule = feedingSchedule;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
