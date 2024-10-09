package com.example.demo.DTO;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Data
public class GrowthRecord {
    @EmbeddedId
    private KoiStatisticId koiId;

    private Double weight;
    private Double length;
    private String physique;
    @JoinColumn(name ="weight_rate")
    private Double weightRate;
    @JoinColumn(name="length_rate")
    private Double lengthRate;
    @ManyToOne
    @MapsId("koiId")
    private KoiFishModel koiFish;

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public KoiStatisticId getKoiId() {
        return koiId;
    }

    public void setKoiId(KoiStatisticId koiId) {
        this.koiId = koiId;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getPhysique() {
        return physique;
    }

    public void setPhysique(String physique) {
        this.physique = physique;
    }

    public KoiFishModel getKoiFish() {
        return koiFish;
    }

    public Double getLengthRate() {
        return lengthRate;
    }

    public void setLengthRate(Double lengthRate) {
        if (lengthRate != null) {
            BigDecimal bd = new BigDecimal(lengthRate).setScale(2, RoundingMode.HALF_UP);
            this.lengthRate = bd.doubleValue();
        } else {
            this.lengthRate = null;
        }
    }

    public Double getWeightRate() {
        return weightRate;
    }

    public void setWeightRate(Double weightRate) {
        if (weightRate != null) {
            BigDecimal bd = new BigDecimal(weightRate).setScale(2, RoundingMode.HALF_UP);
            this.weightRate = bd.doubleValue();
        } else {
            this.weightRate = null;
        }
    }

    public void setKoiFish(KoiFishModel koiFish) {
        this.koiFish = koiFish;
    }

    public GrowthRecord(Double lengthRate, KoiStatisticId koiId, Double weight, Double length, String physique, Double weightRate, KoiFishModel koiFish) {
        this.lengthRate = lengthRate;
        this.koiId = koiId;
        this.weight = weight;
        this.length = length;
        this.physique = physique;
        this.weightRate = weightRate;
        this.koiFish = koiFish;
    }

    public GrowthRecord() {
    }
}