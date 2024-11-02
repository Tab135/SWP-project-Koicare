package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.GrowthRecord;
import com.example.demo.DTO.KoiStatisticId;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResGrowth {
    private Integer statusCode;
    private String error;
    private String message;
    private Double weight;
    private Double length;
    private Double weightRate;
    private Double lengthRate;
    private LocalDate date;
    private int koiFishId;
    private String physique;
    private GrowthRecord growthRecord;
    private List<GrowthRecord> growthRecordList;
    public Integer getKoiFishId() {
        return koiFishId;
    }
    private LocalDateTime updateAt;
    private Integer pondId;

    public Integer getPondId() {
        return pondId;
    }

    public void setPondId(Integer pondId) {
        this.pondId = pondId;
    }

    public void setKoiFishId(Integer koiFishId) {
        this.koiFishId = koiFishId;
    }

    public Integer getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(Integer statusCode) {
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

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getLength() {
        return length;
    }

    public void setLength(Double length) {
        this.length = length;
    }

    public String getPhysique() {
        return physique;
    }

    public void setPhysique(String physique) {
        this.physique = physique;
    }

    public GrowthRecord getGrowthRecord() {
        return growthRecord;
    }

    public void setGrowthRecord(GrowthRecord growthRecord) {
        this.growthRecord = growthRecord;
    }

    public List<GrowthRecord> getGrowthRecordList() {
        return growthRecordList;
    }

    public void setGrowthRecordList(List<GrowthRecord> growthRecordList) {
        this.growthRecordList = growthRecordList;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getLengthRate() {
        return lengthRate;
    }

    public void setLengthRate(Double lengthRate) {
        this.lengthRate = lengthRate;
    }

    public Double getWeightRate() {
        return weightRate;
    }

    public void setWeightRate(Double weightRate) {
        this.weightRate = weightRate;
    }

    public void setKoiFishId(int koiFishId) {
        this.koiFishId = koiFishId;
    }

    public LocalDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }



    public ReqResGrowth() {
    }
}
