package com.example.demo.DTO;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Pond")
@Data
public class PondModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Pond_Id")
    private int Id;
    @Column(name = "name")
    private String pondName;
    @Column (columnDefinition = "TEXT")
    private String picture;
    private double depth;
    private double volume;
    @Column(name = "number_of_fish")
    private int numberOfFish;
    @Column(name = "pumping_capacity")
    private int pumpingCapacity;
    private int drain;
    private int skimmers;
    private int userId;
    @Column (columnDefinition = "TEXT")
    private String location;
    @Column(name = "water_source")
    private String waterSource;

    public int getPumpingCapacity() {
        return pumpingCapacity;
    }

    public void setPumpingCapacity(int pumpingCapacity) {
        this.pumpingCapacity = pumpingCapacity;
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

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
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

    public PondModel(int skimmers, int id, String pondName, String picture, double depth, double volume, int numberOfFish, int pumpingCapacity, int drain, int userId, String location, String waterSource) {
        this.skimmers = skimmers;
        Id = id;
        this.pondName = pondName;
        this.picture = picture;
        this.depth = depth;
        this.volume = volume;
        this.numberOfFish = numberOfFish;
        this.pumpingCapacity = pumpingCapacity;
        this.drain = drain;
        this.userId = userId;
        this.location = location;
        this.waterSource = waterSource;
    }

    public PondModel() {
    }
}
