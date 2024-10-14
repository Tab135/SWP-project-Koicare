package com.example.demo.Controller;

import com.example.demo.DTO.BlogModel;
import com.example.demo.DTO.NewsModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResBlog;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResNews;
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
import java.util.List;

@RestController

public class NewsController {
    @Autowired
    private NewsService newsService;
    @Autowired
    private JWTUtils jwt;
    @PostMapping("/shop/news/create")
    public ResponseEntity<ReqResNews> createNews(@RequestHeader ("Authorization") String token, @ModelAttribute ReqResNews request, @RequestParam(value ="image", required = false) MultipartFile[] image){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try{
            if( image !=null&& image.length >0 ){
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
    ResponseEntity<ReqResNews> updatePond(@RequestHeader ("Authorization") String token, @PathVariable int newsId, @ModelAttribute ReqResNews request, @RequestParam(value ="image", required = false) MultipartFile[] image){
        try{
            if(image !=null&& image.length >0){
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

    @GetMapping("/public/news/{newsId}/images")
    public ResponseEntity<List<String>> listImage(@PathVariable int newsId){
        NewsModel news = newsService.viewNews(newsId).getNews();
        List<byte[]> imageB = news.getNewsImage();
        if(imageB ==null || imageB.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        List<String> imageUrls = new ArrayList<>();
        for(int i =0; i<imageB.size(); i++){
            imageUrls.add("/public/news/"+ newsId +"/image/" +i);
        }
        return ResponseEntity.ok(imageUrls);


    }
    @GetMapping("/public/news/{newsId}/image/{imageIndex}")
    public ResponseEntity<byte[]> getImage(@PathVariable int newsId, @PathVariable int imageIndex){
        NewsModel news = newsService.viewNews(newsId).getNews();
        List<byte[]> imageB = news.getNewsImage();
        if (imageB == null || imageIndex < 0 || imageIndex >= imageB.size()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        byte[] image = imageB.get(imageIndex);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }






}
