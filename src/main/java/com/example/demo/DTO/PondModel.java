package com.example.demo.DTO;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class PondModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int Id;

    private String pondName;
    private String picture;
    private double depth;
    private double volume;
    private int numberOfFish;
    private int pumpingCapacity;
    private int drain;
    private int skimmers;
    private int userId;
    private String location;
    private String waterSource;
    private String maintenanceSchedule;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getId() {
        return Id;
    }

    public void setId(int id) {
        Id = id;
    }

    public String getPondName() {
        return pondName;
    }

    public void setPondName(String pondName) {
        this.pondName = pondName;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public double getDepth() {
        return depth;
    }

    public void setDepth(double depth) {
        this.depth = depth;
    }

    public double getVolume() {
        return volume;
    }

    public void setVolume(double volume) {
        this.volume = volume;
    }

    public int getNumberOfFish() {
        return numberOfFish;
    }

    public void setNumberOfFish(int numberOfFish) {
        this.numberOfFish = numberOfFish;
    }

    public int getPumpingCapacity() {
        return pumpingCapacity;
    }

    public void setPumpingCapacity(int pumpingCapacity) {
        this.pumpingCapacity = pumpingCapacity;
    }

    public int getDrain() {
        return drain;
    }

    public void setDrain(int drain) {
        this.drain = drain;
    }

    public int getSkimmers() {
        return skimmers;
    }

    public void setSkimmers(int skimmers) {
        this.skimmers = skimmers;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWaterSource() {
        return waterSource;
    }

    public void setWaterSource(String waterSource) {
        this.waterSource = waterSource;
    }

    public String getMaintenanceSchedule() {
        return maintenanceSchedule;
    }

    public void setMaintenanceSchedule(String maintenanceSchedule) {
        this.maintenanceSchedule = maintenanceSchedule;
    }

    public PondModel(String location, int id, String pondName, String picture, double depth, double volume, int numberOfFish, int pumpingCapacity, int drain, int skimmers, int userId, String waterSource, String maintenanceSchedule) {
        this.location = location;
        Id = id;
        this.pondName = pondName;
        this.picture = picture;
        this.depth = depth;
        this.volume = volume;
        this.numberOfFish = numberOfFish;
        this.pumpingCapacity = pumpingCapacity;
        this.drain = drain;
        this.skimmers = skimmers;
        this.userId = userId;
        this.waterSource = waterSource;
        this.maintenanceSchedule = maintenanceSchedule;
    }

    public PondModel() {
    }
}
