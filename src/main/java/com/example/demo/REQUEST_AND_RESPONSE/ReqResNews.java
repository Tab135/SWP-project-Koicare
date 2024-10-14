package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.NewsModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResNews {
    private MultipartFile[] newsImage;
    private String newsContent;
    private LocalDate date;
    private String headline;

    private NewsModel news;
    private List<NewsModel> newsList;
    private int statusCode;
    private String error;
    private String message;

    public List<NewsModel> getNewsList() {
        return newsList;
    }

    public void setNewsList(List<NewsModel> newsList) {
        this.newsList = newsList;
    }


    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }



    public NewsModel getNews() {
        return news;
    }

    public void setNews(NewsModel news) {
        this.news = news;
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

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public MultipartFile[] getNewsImage() {
        return newsImage;
    }

    public void setNewsImage(MultipartFile[] newsImage) {
        this.newsImage = newsImage;
    }

    public ReqResNews(int statusCode, MultipartFile[] newsImage, String newsContent, LocalDate date, String headline, NewsModel news, List<NewsModel> newsList, String error, String message) {
        this.statusCode = statusCode;
        this.newsImage = newsImage;
        this.newsContent = newsContent;
        this.date = date;
        this.headline = headline;
        this.news = news;
        this.newsList = newsList;
        this.error = error;
        this.message = message;
    }

    public ReqResNews() {
    }
}
