package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.WaterModel;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResWater {
    private int statusCode;
    private String error;
    
    private int pondId;
    private float nitrite;
    private float nitrate;
    private float phosphate;
    private float ammonium;
    private float hardnessGH;
    private float oxygen;
    private int temperature;
    private float pH;
    private float carbonHardnessKH;
    private float salt;
    private float CO2;
    private float totalChlorine;
    private int outdoorTemperature;
    private float amountFed;
    private LocalDate date;
    private String message;
    private List<WaterModel> waterModelList;
    private WaterModel waterModel;

    public WaterModel getWaterModel() {
        return waterModel;
    }

    public void setWaterModel(WaterModel waterModel) {
        this.waterModel = waterModel;
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

    public int getPondId() {
        return pondId;
    }

    public void setPondId(int pondId) {
        this.pondId = pondId;
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

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<WaterModel> getWaterModelList() {
        return waterModelList;
    }

    public void setWaterModelList(List<WaterModel> waterModelList) {
        this.waterModelList = waterModelList;
    }
}
