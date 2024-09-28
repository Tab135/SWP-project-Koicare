package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.KoiFishModel;
import com.example.demo.DTO.PondModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Lob;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResReqPond {
    private String pondName;
    @Lob
    private MultipartFile picture;
    private Double depth;
    private Double volume;
    private Integer pumpingCapacity;
    private Integer drain;
    private Integer skimmers;
    private String location;
    private String waterSource;

    private int userId;
    private List<KoiFishModel> koiList;
    private int statusCode;
    private String error;
    private String message;
    private PondModel pond;
    private List<PondModel> pondList;



    public String getPondName() {
        return pondName;
    }

    public void setPondName(String pondName) {
        this.pondName = pondName;
    }

    public MultipartFile getPicture() {
        return picture;
    }

    public void setPicture(MultipartFile picture) {
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

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public PondModel getPond() {
        return pond;
    }

    public void setPond(PondModel pond) {
        this.pond = pond;
    }

    public List<PondModel> getPondList() {
        return pondList;
    }

    public void setPondList(List<PondModel> pondList) {
        this.pondList = pondList;
    }

    public ResReqPond(int statusCode, String pondName, MultipartFile picture, Double depth, Double volume, Integer pumpingCapacity, Integer drain, Integer skimmers, String location, String waterSource, int userId, List<KoiFishModel> koiList, String error, String message, PondModel pond, List<PondModel> pondList) {
        this.statusCode = statusCode;
        this.pondName = pondName;
        this.picture = picture;
        this.depth = depth;
        this.volume = volume;
        this.pumpingCapacity = pumpingCapacity;
        this.drain = drain;
        this.skimmers = skimmers;
        this.location = location;
        this.waterSource = waterSource;
        this.userId = userId;
        this.koiList = koiList;
        this.error = error;
        this.message = message;
        this.pond = pond;
        this.pondList = pondList;
    }

    public ResReqPond() {
    }
}
