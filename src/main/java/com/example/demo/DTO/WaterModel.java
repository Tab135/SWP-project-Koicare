package com.example.demo.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
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
    @JsonIgnore
    private PondModel pond;
    private LocalDateTime date;
    private float nitrite;                // Nitrite (NO2) mg/l
    private float nitrate;                // Nitrate (NO3) mg/l
    private float phosphate;              // Phosphate (PO4) mg/l
    private float ammonium;               // Ammonium (NH4) mg/l
    private float hardnessGH;             // Hardness (GH) °dH
    private float oxygen;                 // Oxygen (O2) mg/l
    private int temperature;          // Temperature °C
    private float pH;                     // pH-Value
    private float carbonHardnessKH;       // Carbon hardness (KH) °dH
    private float salt;                   // Salt %
    private float CO2;                    // CO2 mg/l
    private float totalChlorine;          // Total chlorines mg/l
    private int outdoorTemperature;   // Outdoor temperature °C
    private float amountFed;              // Amount fed g

    public WaterModel(){}

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

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public float getNitrite() {
        return nitrite;
    }

    public void setNitrite(float nitrite) {
        this.nitrite = nitrite;
    }

    public float getNitrate() {
        return nitrate;
    }

    public void setNitrate(float nitrate) {
        this.nitrate = nitrate;
    }

    public float getPhosphate() {
        return phosphate;
    }

    public void setPhosphate(float phosphate) {
        this.phosphate = phosphate;
    }

    public float getAmmonium() {
        return ammonium;
    }

    public void setAmmonium(float ammonium) {
        this.ammonium = ammonium;
    }

    public float getHardnessGH() {
        return hardnessGH;
    }

    public void setHardnessGH(float hardnessGH) {
        this.hardnessGH = hardnessGH;
    }

    public float getOxygen() {
        return oxygen;
    }

    public void setOxygen(float oxygen) {
        this.oxygen = oxygen;
    }

    public int getTemperature() {
        return temperature;
    }

    public void setTemperature(int temperature) {
        this.temperature = temperature;
    }

    public float getpH() {
        return pH;
    }

    public void setpH(float pH) {
        this.pH = pH;
    }

    public float getCarbonHardnessKH() {
        return carbonHardnessKH;
    }

    public void setCarbonHardnessKH(float carbonHardnessKH) {
        this.carbonHardnessKH = carbonHardnessKH;
    }

    public float getSalt() {
        return salt;
    }

    public void setSalt(float salt) {
        this.salt = salt;
    }

    public float getCO2() {
        return CO2;
    }

    public void setCO2(float CO2) {
        this.CO2 = CO2;
    }

    public float getTotalChlorine() {
        return totalChlorine;
    }

    public void setTotalChlorine(float totalChlorine) {
        this.totalChlorine = totalChlorine;
    }

    public int getOutdoorTemperature() {
        return outdoorTemperature;
    }

    public void setOutdoorTemperature(int outdoorTemperature) {
        this.outdoorTemperature = outdoorTemperature;
    }

    public float getAmountFed() {
        return amountFed;
    }

    public void setAmountFed(float amountFed) {
        this.amountFed = amountFed;
    }
}
