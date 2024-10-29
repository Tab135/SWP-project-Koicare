package com.example.demo.Controller;

import com.example.demo.DTO.BlogModel;
import com.example.demo.DTO.KoiFishModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResBlog;
import com.example.demo.Repo.BlogRepo;
import com.example.demo.Service.BlogService;
import com.example.demo.Service.JWTUtils;
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
public class BlogController {
    @Autowired
    private BlogService bService;
    @Autowired
    private JWTUtils jwt;
    @Autowired
    BlogRepo blogR;
    @PostMapping("/shop/blog/create")
    public ResponseEntity<ReqResBlog> createBlog(@RequestHeader ("Authorization") String token, @ModelAttribute ReqResBlog request, @RequestParam(value ="image", required = false) MultipartFile image){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try{
            if( image !=null&& !image.isEmpty()){
                request.setBlogImage(image);
            }else{
                request.setBlogImage(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(bService.createBlog(request, userId));
    }


    @DeleteMapping("/shop/blog/{blogId}/delete")
    public String deleteBlog(@RequestHeader ("Authorization") String token, @PathVariable int blogId){
        ReqResBlog res = bService.viewBlog(blogId);
        if(res.getStatusCode()==200){
            bService.deleteBlog(blogId);
            return "Delete success";
        }
        else{
            return "Delete failed, blog not found";
        }
    }

    @PutMapping("/shop/blog/{blogId}/update")
    public ResponseEntity<ReqResBlog> updateBlog(@RequestHeader ("Authorization") String token, @PathVariable int blogId,@ModelAttribute ReqResBlog request, @RequestParam(value ="image", required = false) MultipartFile image){
        try{
            if(image !=null&& !image.isEmpty()){
                request.setBlogImage(image);
            }else{
                request.setBlogImage(null);
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }

        return ResponseEntity.ok(bService.updateBlog(blogId, request));
    }

    @GetMapping("/public/blog/{blogId}/image")
    public ResponseEntity<String> getBlogImage(@PathVariable int blogId) {
        Optional<BlogModel> blog = blogR.findById(blogId);

        if (blog.isPresent() && blog.get().getBlogImage() != null) {
            byte[] imageData = blog.get().getBlogImage();

            String base64Image = Base64.getEncoder().encodeToString(imageData);

            return ResponseEntity.ok(base64Image);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Image not found");
        }


    }


//=============================================================================================//
    @GetMapping("/public/blog")
    public ResponseEntity<ReqResBlog> publicBLog(){
        return ResponseEntity.ok(bService.listBlog());
    }

    @GetMapping("/shop/blog")
    public ResponseEntity<ReqResBlog> shopBLog(){
        return ResponseEntity.ok(bService.listBlog());
    }

    @GetMapping("/public/blog/{blogId}")
    public ResponseEntity<ReqResBlog> publicGetBlog(@PathVariable int blogId){
        return ResponseEntity.ok(bService.viewBlog(blogId));
    }

}
