package com.example.demo.DTO;

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
    @ElementCollection
    private List<byte[]> blogImage;
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

    public List<byte[]> getBlogImage() {
        return blogImage;
    }

    public void setBlogImage(List<byte[]> blogImage) {
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

    public BlogModel(String title, UserModel author, LocalDate date, String blogContent, List<byte[]> blogImage, int blogId) {
        this.title = title;
        this.author = author;
        this.date = date;
        this.blogContent = blogContent;
        this.blogImage = blogImage;
        this.blogId = blogId;
    }

    public BlogModel() {
    }
}
