package com.example.demo.REQUEST_AND_RESPONSE;


import java.io.Serializable;

public class ReqResPayment implements Serializable {
    private int status;
    private String message;
    private String URL;

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getURL() {
        return URL;
    }

    public void setURL(String URL) {
        this.URL = URL;
    }
}
