package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.RevenueModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResRevenue {
    private int id;
    private BigDecimal amount;
    private LocalDate date;
    private RevenueModel revenueModel;
    private String message;
    private int userId;
    private List<RevenueModel> revenueModelList;
    private BigDecimal totalAmount;

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public RevenueModel getRevenueModel() {
        return revenueModel;
    }

    public void setRevenueModel(RevenueModel revenueModel) {
        this.revenueModel = revenueModel;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public List<RevenueModel> getRevenueModelList() {
        return revenueModelList;
    }

    public void setRevenueModelList(List<RevenueModel> revenueModelList) {
        this.revenueModelList = revenueModelList;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public RevenueModel getRevenueDTO() {
        return revenueModel;
    }

    public void setRevenueDTO(RevenueModel revenueModel) {
        this.revenueModel = revenueModel;
    }


}
