package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.RegistrationForm;
import com.example.demo.DTO.UserModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResRegistrationForm {
    private int statusCode;
    private String message;
    private String name;
    private String phone;
    private String status;
    private LocalDateTime submittedAt;
    private List<RegistrationForm> RFformList;
    private String Bank;
    private String Bank_name;
    private String Address;
    private String Additional_info;

    public String getAdditional_info() {
        return Additional_info;
    }

    public void setAdditional_info(String additional_info) {
        Additional_info = additional_info;
    }

    public String getAddress() {
        return Address;
    }

    public void setAddress(String address) {
        Address = address;
    }

    public String getBank() {
        return Bank;
    }

    public void setBank(String bank) {
        Bank = bank;
    }

    public String getBank_name() {
        return Bank_name;
    }

    public void setBank_name(String bank_name) {
        Bank_name = bank_name;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }


    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<RegistrationForm> getRFformList() {
        return RFformList;
    }

    public void setRFformList(List<RegistrationForm> RFformList) {
        this.RFformList = RFformList;
    }
}
