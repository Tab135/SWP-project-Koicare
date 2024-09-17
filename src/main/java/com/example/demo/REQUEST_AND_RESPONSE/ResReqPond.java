package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.KoiFishModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResReqPond {
    private String pondName;
    private String picture;
    private Double depth;
    private Double volume;
    private Integer pumpingCapacity;
    private Integer drain;
    private Integer skimmers;
    private String location;
    private String waterSource;
    private String maintenanceSchedule;
    private int userId;
    private List<KoiFishModel> koiList;

    public Integer getPumpingCapacity() {
        return pumpingCapacity;
    }

    public void setPumpingCapacity(Integer pumpingCapacity) {
        this.pumpingCapacity = pumpingCapacity;
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

    public String getMaintenanceSchedule() {
        return maintenanceSchedule;
    }

    public void setMaintenanceSchedule(String maintenanceSchedule) {
        this.maintenanceSchedule = maintenanceSchedule;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public List<KoiFishModel> getKoiList() {
        return koiList;
    }

    public void setKoiList(List<KoiFishModel> koiList) {
        this.koiList = koiList;
    }

    public ResReqPond(Integer skimmers, String pondName, String picture, Double depth, Double volume, Integer pumpingCapacity, Integer drain, String location, String waterSource, String maintenanceSchedule, int userId, List<KoiFishModel> koiList) {
        this.skimmers = skimmers;
        this.pondName = pondName;
        this.picture = picture;
        this.depth = depth;
        this.volume = volume;
        this.pumpingCapacity = pumpingCapacity;
        this.drain = drain;
        this.location = location;
        this.waterSource = waterSource;
        this.maintenanceSchedule = maintenanceSchedule;
        this.userId = userId;
        this.koiList = koiList;
    }

    public ResReqPond() {
    }
}
