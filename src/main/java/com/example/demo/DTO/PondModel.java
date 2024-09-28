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
    @Lob
    @Column(name = "picture", columnDefinition = "VARBINARY(MAX)")
    private byte[] picture;
    private Double depth;
    private Double volume;
    @Column(name = "number_of_fish")
    private int numberOfFish;
    @Column(name = "pumping_capacity")
    private Integer pumpingCapacity;
    private Integer drain;
    private Integer skimmers;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;
    @Column (columnDefinition = "TEXT")
    private String location;
    @Column(name = "water_source")
    private String waterSource;

    public int getNumberOfFish() {
        return numberOfFish;
    }

    public void setNumberOfFish(int numberOfFish) {
        this.numberOfFish = numberOfFish;
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


    public Double getDepth() {
        return depth;
    }

    public void setDepth(Double depth) {
        this.depth = depth;
    }

    public Double getVolume() {
        return volume;
    }

    public void setVolume(Double volume) {
        this.volume = volume;
    }

    public Integer getPumpingCapacity() {
        return pumpingCapacity;
    }

    public void setPumpingCapacity(Integer pumpingCapacity) {
        this.pumpingCapacity = pumpingCapacity;
    }

    public Integer getDrain() {
        return drain;
    }

    public void setDrain(Integer drain) {
        this.drain = drain;
    }

    public Integer getSkimmers() {
        return skimmers;
    }

    public void setSkimmers(Integer skimmers) {
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

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public byte[] getPicture() {
        return picture;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public PondModel(UserModel user, int id, String pondName, byte[] picture, Double depth, Double volume, int numberOfFish, Integer pumpingCapacity, Integer drain, Integer skimmers, String location, String waterSource) {
        this.user = user;
        Id = id;
        this.pondName = pondName;
        this.picture = picture;
        this.depth = depth;
        this.volume = volume;
        this.numberOfFish = numberOfFish;
        this.pumpingCapacity = pumpingCapacity;
        this.drain = drain;
        this.skimmers = skimmers;
        this.location = location;
        this.waterSource = waterSource;
    }

    public PondModel() {
    }
}
