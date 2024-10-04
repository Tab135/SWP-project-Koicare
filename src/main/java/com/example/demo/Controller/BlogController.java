package com.example.demo.Controller;

import com.example.demo.DTO.BlogModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResBlog;
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
import java.util.List;

@RestController
public class BlogController {
    @Autowired
    private BlogService bService;
    @Autowired
    private JWTUtils jwt;

    @PostMapping("/admin/blog/create")
    public ResponseEntity<ReqResBlog> createBlog(@RequestHeader ("Authorization") String token, @ModelAttribute ReqResBlog request, @RequestParam("image") MultipartFile[] image){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try{
            if( image !=null|| image.length >0 ){
                request.setBlogImage(image);
            }else{
                request.setBlogImage(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.ok(bService.createBlog(request, userId));
    }

    @GetMapping("/admin/blog/{blogId}")
    public ResponseEntity<ReqResBlog> viewBlog(@RequestHeader ("Authorization") String token, @PathVariable int blogId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(bService.viewBlogsByUserId(userId, blogId));
    }

    @GetMapping("/admin/blog")
    public ResponseEntity<ReqResBlog> listBlog(@RequestHeader ("Authorization") String token){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(bService.listBlogsByUserId(userId));
    }
    @DeleteMapping("/admin/blog/{blogId}/delete")
    public String deleteBlog(@RequestHeader ("Authorization") String token, @PathVariable int blogId){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        ReqResBlog res = bService.viewBlogsByUserId(userId, blogId);
        if(res.getStatusCode()==200){
            bService.deleteBlog(blogId);
            return "Delete success";
        }
        else{
            return "Delete failed, blog not found";
        }
    }

    @PutMapping("/admin/blog/{blogId}/update")
    public ResponseEntity<ReqResBlog> updateBlog(@RequestHeader ("Authorization") String token, @PathVariable int blogId,@ModelAttribute ReqResBlog request, @RequestParam("image") MultipartFile[] image){
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        try{
            if(image !=null|| image.length >0){
                request.setBlogImage(image);
            }else{
                request.setBlogImage(null);
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }

        return ResponseEntity.ok(bService.updateBlog(userId, blogId, request));
    }

    @GetMapping("admin/blog/{blogId}/images")
    public ResponseEntity<List<String>> listImage(@PathVariable int blogId){
        BlogModel blog = bService.viewBlog(blogId).getBlog();
        List<byte[]> imageB = blog.getBlogImage();
        if(imageB ==null || imageB.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        List<String> imageUrls = new ArrayList<>();
        for(int i =0; i<imageB.size(); i++){
            imageUrls.add("/admin/blog/"+ blogId +"/image/" +i);
        }
        return ResponseEntity.ok(imageUrls);


    }
    @GetMapping("admin/blog/{blogId}/image/{imageIndex}")
    public ResponseEntity<byte[]> getImage(@PathVariable int blogId, @PathVariable int imageIndex){
        BlogModel blog = bService.viewBlog(blogId).getBlog();
        List<byte[]> imageB = blog.getBlogImage();
        if (imageB == null || imageIndex < 0 || imageIndex >= imageB.size()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        byte[] image = imageB.get(imageIndex);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        return new ResponseEntity<>(image, headers, HttpStatus.OK);
    }


    @PostMapping("/admin/blog/{keyword}")
    public ResponseEntity<ReqResBlog> search (@PathVariable String keyword){
        return ResponseEntity.ok(bService.searchBlog(keyword));
    }
}
