package com.example.demo.REQUEST_AND_RESPONSE;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;


@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResFood {
    private float Food_amount;
    private float food_split;
    private String feeding_time;
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public float getFood_amount() {
        return Food_amount;
    }

    public void setFood_amount(float food_amount) {
        Food_amount = food_amount;
    }

    public float getFood_split() {
        return food_split;
    }

    public void setFood_split(float food_split) {
        this.food_split = food_split;
    }

    public String getFeeding_time() {
        return feeding_time;
    }

    public void setFeeding_time(String feeding_time) {
        this.feeding_time = feeding_time;
    }
}
