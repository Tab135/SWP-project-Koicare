package com.example.demo.REQUEST_AND_RESPONSE;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReqResWater {
    private int statusCode;
    private String error;
    private int pondId;
    private Float nitrite;
    private Float nitrate;
    private Float phosphate;
    private Float ammonium;
    private Float hardnessGH;
    private Float oxygen;
    private Integer temperature;
    private Float pH;
    private Float carbonHardnessKH;
    private Float salt;
    private Float CO2;
    private Float totalChlorine;
    private Integer outdoorTemperature;
    private Float amountFed;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime date;
    private String message;

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

    public Float getHardnessGH() {
        return hardnessGH;
    }

    public void setHardnessGH(Float hardnessGH) {
        this.hardnessGH = hardnessGH;
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

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
