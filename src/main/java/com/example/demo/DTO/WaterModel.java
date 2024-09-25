package com.example.demo.DTO;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Water_monitor")
public class WaterModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne(fetch = FetchType.LAZY) // Define the relationship with PondModel
    @JoinColumn(name = "pond_id", nullable = false) // Define foreign key column
    private PondModel pond;
    private LocalDateTime date_time;
    private Float nitrite;                // Nitrite (NO2) mg/l
    private Float nitrate;                // Nitrate (NO3) mg/l
    private Float phosphate;              // Phosphate (PO4) mg/l
    private Float ammonium;               // Ammonium (NH4) mg/l
    private Float hardnessGH;             // Hardness (GH) °dH
    private Float oxygen;                 // Oxygen (O2) mg/l
    private Integer temperature;          // Temperature °C
    private Float pH;                     // pH-Value
    private Float carbonHardnessKH;       // Carbon hardness (KH) °dH
    private Float salt;                   // Salt %
    private Float CO2;                    // CO2 mg/l
    private Float totalChlorine;          // Total chlorines mg/l
    private Integer outdoorTemperature;   // Outdoor temperature °C
    private Float amountFed;              // Amount fed g

    public WaterModel(){}

    public WaterModel(long id, PondModel pond, LocalDateTime date_time, Float nitrite, Float nitrate, Float phosphate, Float ammonium, Float hardnessGH, Float oxygen, Integer temperature, Float pH, Float carbonHardnessKH, Float salt, Float CO2, Float totalChlorine, Integer outdoorTemperature, Float amountFed) {
        this.id = id;
        this.pond = pond;
        this.date_time = date_time;
        this.nitrite = nitrite;
        this.nitrate = nitrate;
        this.phosphate = phosphate;
        this.ammonium = ammonium;
        this.hardnessGH = hardnessGH;
        this.oxygen = oxygen;
        this.temperature = temperature;
        this.pH = pH;
        this.carbonHardnessKH = carbonHardnessKH;
        this.salt = salt;
        this.CO2 = CO2;
        this.totalChlorine = totalChlorine;
        this.outdoorTemperature = outdoorTemperature;
        this.amountFed = amountFed;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public PondModel getPond() {
        return pond;
    }

    public void setPond(PondModel pond) {
        this.pond = pond;
    }

    public LocalDateTime getDate_time() {
        return date_time;
    }

    public void setDate_time(LocalDateTime date_time) {
        this.date_time = date_time;
    }

    public Float getNitrite() {
        return nitrite;
    }

    public void setNitrite(Float nitrite) {
        this.nitrite = nitrite;
    }

    public Float getNitrate() {
        return nitrate;
    }

    public void setNitrate(Float nitrate) {
        this.nitrate = nitrate;
    }

    public Float getPhosphate() {
        return phosphate;
    }

    public void setPhosphate(Float phosphate) {
        this.phosphate = phosphate;
    }

    public Float getAmmonium() {
        return ammonium;
    }

    public void setAmmonium(Float ammonium) {
        this.ammonium = ammonium;
    }

    public Float getHardnessGH() {
        return hardnessGH;
    }

    public void setHardnessGH(Float hardnessGH) {
        this.hardnessGH = hardnessGH;
    }

    public Float getOxygen() {
        return oxygen;
    }

    public void setOxygen(Float oxygen) {
        this.oxygen = oxygen;
    }

    public Integer getTemperature() {
        return temperature;
    }

    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }

    public Float getpH() {
        return pH;
    }

    public void setpH(Float pH) {
        this.pH = pH;
    }

    public Float getCarbonHardnessKH() {
        return carbonHardnessKH;
    }

    public void setCarbonHardnessKH(Float carbonHardnessKH) {
        this.carbonHardnessKH = carbonHardnessKH;
    }

    public Float getSalt() {
        return salt;
    }

    public void setSalt(Float salt) {
        this.salt = salt;
    }

    public Float getCO2() {
        return CO2;
    }

    public void setCO2(Float CO2) {
        this.CO2 = CO2;
    }

    public Float getTotalChlorine() {
        return totalChlorine;
    }

    public void setTotalChlorine(Float totalChlorine) {
        this.totalChlorine = totalChlorine;
    }

    public Integer getOutdoorTemperature() {
        return outdoorTemperature;
    }

    public void setOutdoorTemperature(Integer outdoorTemperature) {
        this.outdoorTemperature = outdoorTemperature;
    }

    public Float getAmountFed() {
        return amountFed;
    }

    public void setAmountFed(Float amountFed) {
        this.amountFed = amountFed;
    }
}
