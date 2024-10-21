package com.example.demo.Controller;

import com.example.demo.DTO.BlogModel;
import com.example.demo.DTO.NewsModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResBlog;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResNews;
import com.example.demo.Repo.NewsRepo;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController

public class NewsController {
    @Autowired
    private NewsService newsService;
    @Autowired
    private JWTUtils jwt;
    @Autowired
    private NewsRepo newsR;
    @PostMapping("/shop/news/create")
    public ResponseEntity<ReqResNews> createNews(@RequestHeader ("Authorization") String token, @ModelAttribute ReqResNews request, @RequestParam(value ="image", required = false) MultipartFile image){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try{
            if( image !=null&& !image.isEmpty()){
                request.setNewsImage(image);
            }else{
                request.setNewsImage(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(newsService.createNews(request, userId));
    }

    @GetMapping("/public/news")
    public ResponseEntity<ReqResNews> listNews(){
        return ResponseEntity.ok(newsService.listNews());
    }

    @GetMapping("/public/news/{newsId}")
    public ResponseEntity<ReqResNews> getNews (@PathVariable int newsId){
        return ResponseEntity.ok(newsService.viewNews(newsId));
    }

    @DeleteMapping("/shop/news/{newsId}/delete")
    public String deleteNews(@RequestHeader ("Authorization") String token, @PathVariable int newsId){
        ReqResNews res = newsService.viewNews(newsId);
        if(res.getStatusCode() ==200){
            newsService.deleteNews(newsId);
            return "Delete success";
        }
        else{
            return "Delete failed, news not found";
        }
    }
    @PutMapping ("/shop/news/{newsId}/update")
    ResponseEntity<ReqResNews> updatePond(@RequestHeader ("Authorization") String token, @PathVariable int newsId, @ModelAttribute ReqResNews request, @RequestParam(value ="image", required = false) MultipartFile image){
        try{
            if(image !=null&& !image.isEmpty()){
                request.setNewsImage(image);
            }else{
                request.setNewsImage(null);
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return ResponseEntity.ok(newsService.updateNews(newsId, request));
    }

    @PostMapping ("/public/news/{keyword}")
    ResponseEntity<ReqResNews> search(@PathVariable String keyword){
        return ResponseEntity.ok(newsService.search(keyword));
    }

    //========================image==============================//

    @GetMapping("/public/news/{newsId}/image")
    public ResponseEntity<String> getNewsImage(@PathVariable int newsId) {
        Optional<NewsModel> news = newsR.findById(newsId);

        if (news.isPresent() && news.get().getNewsImage() != null) {
            byte[] imageData = news.get().getNewsImage();

            String base64Image = Base64.getEncoder().encodeToString(imageData);

            return ResponseEntity.ok(base64Image);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        }


    }






}
