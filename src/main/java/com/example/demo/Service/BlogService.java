package com.example.demo.Service;

import com.example.demo.DTO.BlogModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResBlog;
import com.example.demo.Repo.BlogRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BlogService {
    @Autowired
    private BlogRepo blogRepo;
    @Autowired
    private UserRepo userR;

    public ReqResBlog createBlog(ReqResBlog request, int userId){
        ReqResBlog res = new ReqResBlog();
        Optional<UserModel> user = userR.findById(userId);
        try{
            BlogModel blog = new BlogModel();
            try {
                if(request.getBlogImage() !=null){
                    byte[] imageByte = request.getBlogImage().getBytes();
                    blog.setBlogImage(imageByte);
                }else{
                    blog.setBlogImage(null);
                }


            }catch (Exception ex){
                ex.printStackTrace();
            }

            blog.setBlogContent(request.getBlogContent());
            blog.setDate(LocalDate.now());
            blog.setAuthor(user.get());
            blog.setTitle(request.getTitle());

            BlogModel result = blogRepo.save(blog);
            if(result.getBlogId() >0){
                res.setStatusCode(200);
                res.setMessage("Blog created successfully");
                res.setBlog(result);
            }
        }catch (Exception ex){
            res.setStatusCode(500);
            res.setError("Error: "+ex.getMessage());
        }
        return res;
    }
//==========================PUBLIC===============================//
    public ReqResBlog listBlog(){
        ReqResBlog res = new ReqResBlog();
        List<BlogModel> bList = blogRepo.findAllByOrderByDateDesc();
        if(bList.isEmpty()){
            res.setStatusCode(404);
            res.setMessage("These is nothing here");
        }else{
            res.setStatusCode(200);
            res.setMessage("Blog");
            res.setBlogList(bList);
        }
        return res;
    }

    public ReqResBlog viewBlog(int blogId){
    ReqResBlog res = new ReqResBlog();
    Optional<BlogModel> blog = blogRepo.findById(blogId);
    if(blog.isPresent()) {
        res.setStatusCode(200);
        res.setMessage("Found");
        res.setBlog(blog.get());
        return res;
    }
        res.setStatusCode(404);
        res.setError("Not exist");

    return res;
    }


    //==========================PUBLIC===============================//

    //===============================================================//
//    public ReqResBlog listBlogsByUserId(int userId){
//        ReqResBlog res = new ReqResBlog();
//        Optional<UserModel> user = userR.findById(userId);
//        List<BlogModel> bList = blogRepo.findAllByAuthor(user.get());
//        res.setAuthor(userId);
//        if(bList.isEmpty()){
//            res.setStatusCode(404);
//            res.setError("These is nothing here");
//        }else{
//            res.setStatusCode(200);
//            res.setMessage("Blogs");
//            res.setBlogList(bList);
//        }
//        return res;
//    }
//
//    public ReqResBlog viewBlogsByUserId(int blogId){
//        ReqResBlog res = new ReqResBlog();
//        Optional<BlogModel> blog = blogRepo.findById(blogId);
//            if(blog.isPresent()){
//            res.setStatusCode(200);
//            res.setMessage("Found");
//            res.setBlog(blog.get());
//            return res;
//        }
//            res.setStatusCode(404);
//            res.setError("Not exist");
//
//        return res;
//    }

    //===============================================================//
    public void deleteBlog(int blogId){
        blogRepo.deleteById(blogId);
    }

    public ReqResBlog updateBlog (int blogId, ReqResBlog request) {
        ReqResBlog res = new ReqResBlog();
        Optional<BlogModel> updateBlog = blogRepo.findById(blogId);

        if (updateBlog.isEmpty()) {
            ReqResBlog result = new ReqResBlog();
            result.setStatusCode(404);
            result.setError("Blog not found");
            return result;
        } else {
            try {
                BlogModel blog = updateBlog.get();


                 if (request.getBlogImage() != null){
                     byte[] imageByte = request.getBlogImage().getBytes();
                     blog.setBlogImage(imageByte);
                }
                if (request.getBlogContent() != null) {
                    blog.setBlogContent(request.getBlogContent());
                }
                if (request.getTitle() != null) {
                    blog.setTitle(request.getTitle());
                }
                blogRepo.save(blog);
                res.setStatusCode(200);
                res.setMessage("Updated successfully");
                res.setBlog(blog);
                return res;

            } catch (Exception ex) {
                res.setStatusCode(500);
                res.setError("Error: " + ex.getMessage());
            }
            return res;
        }
    }

    public ReqResBlog searchBlog(String keyword){
        List<BlogModel> search = blogRepo.findByTitleContainingIgnoreCase(keyword);
        ReqResBlog res = new ReqResBlog();
        if(search.isEmpty()){
            res.setStatusCode(404);
            res.setError("Nothing");
            return res;
        }else{
            res.setStatusCode(200);
            res.setBlogList(search);
            res.setMessage("Blog");
            return res;
        }
    }
}
