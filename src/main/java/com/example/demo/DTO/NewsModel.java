package com.example.demo.DTO;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class NewsModel {
    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private int newsId;
    @Lob
    @ElementCollection
    private List<byte[]> newsImage;

    @Column (columnDefinition = "TEXT")
    private String newsContent;
    private LocalDate date;
    private String headline;
    @ManyToOne
    @JoinColumn(name ="author")
    private UserModel author;

    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public int getNewsId() {
        return newsId;
    }

    public void setNewsId(int newsId) {
        this.newsId = newsId;
    }

    public List<byte[]> getNewsImage() {
        return newsImage;
    }

    public void setNewsImage(List<byte[]> newsImage) {
        this.newsImage = newsImage;
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

    public UserModel getAuthor() {
        return author;
    }

    public void setAuthor(UserModel author) {
        this.author = author;
    }

    public NewsModel(String headline, int newsId, List<byte[]> newsImage, String newsContent, LocalDate date, UserModel author) {
        this.headline = headline;
        this.newsId = newsId;
        this.newsImage = newsImage;
        this.newsContent = newsContent;
        this.date = date;
        this.author = author;
    }

    public NewsModel() {
    }
}
