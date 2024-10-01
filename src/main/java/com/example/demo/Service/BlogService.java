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
        if(blogRepo.existsByTitle(request.getTitle())){
            res.setError("Blog's title existed");
            res.setStatusCode(409);
            return res;
        }
        try{
            BlogModel blog = new BlogModel();
            try {
                if(request.getBlogImage() !=null){
                    List<byte[]> imageB = new ArrayList<>();
                    for(MultipartFile image: request.getBlogImage()){
                        imageB.add(image.getBytes());
                    }
                    blog.setBlogImage(imageB);
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
//=========================================================//
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
    List<BlogModel> bList = listBlog().getBlogList();
    ReqResBlog res = new ReqResBlog();

    boolean exist = false;
    for(BlogModel blog: bList){
        if(blog.getBlogId() == blogId){
            res.setStatusCode(200);
            res.setMessage("Found");
            res.setBlog(blog);
            exist = true;
        }
    }
    if(!exist){
        res.setStatusCode(404);
        res.setError("Not exist");
    }
    return res;
    }


//=========================================================//

    public ReqResBlog listBlogsByUserId(int userId){
        ReqResBlog res = new ReqResBlog();
        Optional<UserModel> user = userR.findById(userId);
        List<BlogModel> bList = blogRepo.findAllByAuthor(user.get());
        res.setAuthor(userId);
        if(bList.isEmpty()){
            res.setStatusCode(404);
            res.setError("These is nothing here");
        }else{
            res.setStatusCode(200);
            res.setMessage("Blogs");
            res.setBlogList(bList);
        }
        return res;
    }

    public ReqResBlog viewBlogsByUserId(int userId, int blogId){
        ReqResBlog res = new ReqResBlog();
        List<BlogModel> bList = listBlogsByUserId(userId).getBlogList();
        res.setAuthor(userId);
        boolean exist = false;
        for(BlogModel blog: bList){
            if(blog.getBlogId() == blogId){
                res.setStatusCode(200);
                res.setMessage("Found");
                res.setBlog(blog);
                exist = true;
            }
        }
        if(!exist){
            res.setStatusCode(404);
            res.setError("Not exist");
        }
        return res;
    }

    //===================================================================//
    public void deleteBlog(int blogId){
        blogRepo.deleteById(blogId);
    }

    public ReqResBlog updateBlog (int userId, int blogId, ReqResBlog request){
        ReqResBlog res = viewBlogsByUserId(userId, blogId);
        BlogModel blog = res.getBlog();
        ReqResBlog blogList = listBlog();
        if(blogList.getBlogList() !=null){
        for(BlogModel bList: blogList.getBlogList()) {
            if (bList.getTitle().equals(request.getTitle())) {
                ReqResBlog result = new ReqResBlog();
                result.setStatusCode(409);
                result.setError("Title existed");
                return result;
            }
        }
        }
        try {
            if (res.getStatusCode() == 200) {
                if (request.getBlogImage() ==null) {
                    blog.setBlogImage(null);
                }else {
                    List<byte[]> imageB = new ArrayList<>();
                    for(MultipartFile image: request.getBlogImage()){
                        if(image !=null){
                            imageB.add(image.getBytes());
                        }
                    }
                    blog.setBlogImage(imageB);
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
            } else {
                return res;
            }
        }catch (Exception ex){
            res.setStatusCode(500);
            res.setError("Error: "+ ex.getMessage());
        }
        return res;
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
