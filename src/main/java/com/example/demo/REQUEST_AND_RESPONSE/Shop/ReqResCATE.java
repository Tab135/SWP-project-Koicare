package com.example.demo.REQUEST_AND_RESPONSE.Shop;

import com.example.demo.DTO.Shop.CategoryModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResCATE {
    private int statusCode;
    private String error;
    private String categoryName;
    private String message;
    private CategoryModel cateM;
    private List<CategoryModel> cateList;

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

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public CategoryModel getCateM() {
        return cateM;
    }

    public void setCateM(CategoryModel cateM) {
        this.cateM = cateM;
    }

    public List<CategoryModel> getCateList() {
        return cateList;
    }

    public void setCateList(List<CategoryModel> cateList) {
        this.cateList = cateList;
    }
}
