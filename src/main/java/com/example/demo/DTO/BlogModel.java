package com.example.demo.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class BlogModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int blogId;
    @Lob
    @Column(name = "image", columnDefinition = "VARBINARY(MAX)")
    private byte[] blogImage;
    @Column (columnDefinition = "TEXT")
    private String blogContent;
    private LocalDate date;
    @ManyToOne
    @JoinColumn(name ="author")
    private UserModel author;
    private String title;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getBlogContent() {
        return blogContent;
    }

    public void setBlogContent(String blogContent) {
        this.blogContent = blogContent;
    }

    public byte[] getBlogImage() {
        return blogImage;
    }

    public void setBlogImage(byte[] blogImage) {
        this.blogImage = blogImage;
    }

    public int getBlogId() {
        return blogId;
    }

    public void setBlogId(int blogId) {
        this.blogId = blogId;
    }

    public UserModel getAuthor() {
        return author;
    }

    public void setAuthor(UserModel author) {
        this.author = author;
    }

    public BlogModel(UserModel author, int blogId, byte[] blogImage, String blogContent, LocalDate date, String title) {
        this.author = author;
        this.blogId = blogId;
        this.blogImage = blogImage;
        this.blogContent = blogContent;
        this.date = date;
        this.title = title;
    }

    public BlogModel() {
    }
}
