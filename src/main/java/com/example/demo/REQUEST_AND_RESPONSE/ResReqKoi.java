package com.example.demo.REQUEST_AND_RESPONSE;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResReqKoi {
    private String koiName;
    private Integer age;
    private Double length;
    private Double weight;
    private String sex;
    private String variety;
    private String origin;
    private BigDecimal price;
    private Integer pondId;
    private String healthStatus;
    private LocalDate lastMedicalCheck;
    private String feedingSchedule;
    private String image;

    public Integer getPondId() {
        return pondId;
    }

    public void setPondId(Integer pondId) {
        this.pondId = pondId;
    }

    public String getKoiName() {
        return koiName;
    }

    public void setKoiName(String koiName) {
        this.koiName = koiName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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

    public ResReqKoi(LocalDate lastMedicalCheck, String koiName, Integer age, Double length, Double weight, String sex, String variety, String origin, BigDecimal price, Integer pondId, String healthStatus, String feedingSchedule, String image) {
        this.lastMedicalCheck = lastMedicalCheck;
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

    public ResReqKoi() {
    }
}
