package com.example.demo.REQUEST_AND_RESPONSE;

import com.example.demo.DTO.BlogModel;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqResBlog {
    private MultipartFile blogImage;
    private String blogContent;
    private LocalDate date;
    private int author;
    private String title;
    private int statusCode;
    private String error;
    private String message;
    private BlogModel blog;
    private List<BlogModel> blogList;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBlogContent() {
        return blogContent;
    }

    public void setBlogContent(String blogContent) {
        this.blogContent = blogContent;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getAuthor() {
        return author;
    }

    public void setAuthor(int author) {
        this.author = author;
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

    public BlogModel getBlog() {
        return blog;
    }

    public void setBlog(BlogModel blog) {
        this.blog = blog;
    }

    public List<BlogModel> getBlogList() {
        return blogList;
    }

    public void setBlogList(List<BlogModel> blogList) {
        this.blogList = blogList;
    }

    public MultipartFile getBlogImage() {
        return blogImage;
    }

    public void setBlogImage(MultipartFile blogImage) {
        this.blogImage = blogImage;
    }

    public ReqResBlog(String message, MultipartFile blogImage, String blogContent, LocalDate date, int author, String title, int statusCode, String error, BlogModel blog, List<BlogModel> blogList) {
        this.message = message;
        this.blogImage = blogImage;
        this.blogContent = blogContent;
        this.date = date;
        this.author = author;
        this.title = title;
        this.statusCode = statusCode;
        this.error = error;
        this.blog = blog;
        this.blogList = blogList;
    }

    public ReqResBlog() {
    }
}
