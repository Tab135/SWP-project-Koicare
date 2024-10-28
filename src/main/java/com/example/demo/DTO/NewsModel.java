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
    @Column(name = "image", columnDefinition = "VARBINARY(MAX)")
    private byte[] newsImage;

    @Column (columnDefinition = "NVARCHAR(MAX)")
    private String newsContent;
    private LocalDate date;
    @Column (columnDefinition = "NVARCHAR(MAX)")
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

    public byte[] getNewsImage() {
        return newsImage;
    }

    public void setNewsImage(byte[] newsImage) {
        this.newsImage = newsImage;
    }

    public NewsModel(UserModel author, String headline, LocalDate date, String newsContent, byte[] newsImage, int newsId) {
        this.author = author;
        this.headline = headline;
        this.date = date;
        this.newsContent = newsContent;
        this.newsImage = newsImage;
        this.newsId = newsId;
    }

    public NewsModel() {
    }
}
