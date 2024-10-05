package com.example.demo.REQUEST_AND_RESPONSE;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResSaltCal {
    private float salt;
    private float water_change_salt;

    public float getSalt() {
        return salt;
    }

    public void setSalt(float salt) {
        this.salt = salt;
    }

    public float getWater_change_salt() {
        return water_change_salt;
    }

    public void setWater_change_salt(float water_change_salt) {
        this.water_change_salt = water_change_salt;
    }
}
