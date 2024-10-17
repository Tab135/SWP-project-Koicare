package com.example.demo.DTO;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Getter
@Setter
public class SignupOTP {
    public SignupOTP(int otp, Date expirationTime) {
        this.otp = otp;
        this.expirationTime = expirationTime;
    }

    private int otp;
    private Date expirationTime;
    private int verified;

    public int getOtp() {
        return otp;
    }

    public void setOtp(int otp) {
        this.otp = otp;
    }

    public Date getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Date expirationTime) {
        this.expirationTime = expirationTime;
    }

}
