package com.example.demo.Service;

import com.example.demo.DTO.NewsModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResNews;
import com.example.demo.Repo.NewsRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class NewsService {
    @Autowired
    private NewsRepo newsRepo;
    @Autowired
    private UserRepo userR;

    public ReqResNews createNews(ReqResNews request, int userId){
        ReqResNews res = new ReqResNews();
        Optional<UserModel> author = userR.findById(userId);
        System.out.println(request.getNewsContent());
        try{
            NewsModel newsModel = new NewsModel();

                if(request.getNewsImage() !=null) {
                    byte[] imageByte = request.getNewsImage().getBytes();
                    newsModel.setNewsImage(imageByte);

                    newsModel.setNewsImage(imageByte);

                }else{
                    newsModel.setNewsImage(null);
                }
            newsModel.setNewsContent(request.getNewsContent());
            newsModel.setDate(LocalDate.now());
            newsModel.setHeadline(request.getHeadline());
            newsModel.setAuthor(author.get());

            NewsModel result = newsRepo.save(newsModel);
            if(result.getNewsId() >0){
                res.setMessage("News created");
                res.setStatusCode(200);
                res.setNews(result);
            }
        }catch (Exception ex){
            res.setStatusCode(500);
            res.setError(ex.getMessage());
        }
        return res;
    }
//========================================================================
    public ReqResNews listNews(){
        ReqResNews res = new ReqResNews();
        List<NewsModel> newsList = newsRepo.findAllByOrderByDateDesc();
        if(newsList.isEmpty()){
            res.setStatusCode(404);
            res.setMessage("These is nothing here");
        }else{
            res.setStatusCode(200);
            res.setMessage("News");
            res.setNewsList(newsList);
        }
        return res;
    }

    public ReqResNews viewNews(int newsId){
        Optional<NewsModel> news = newsRepo.findById(newsId);
        ReqResNews res = new ReqResNews();
        if(news.isPresent()){
            res.setStatusCode(200);
            res.setMessage("Found");
            res.setNews(news.get());
            return res;
        }
            res.setStatusCode(404);
            res.setError("Not exist");

        return res;
    }
//================================================================//

//    public ReqResNews listNewsByUserId(int userId){
//        ReqResNews res = new ReqResNews();
//        List<NewsModel> newsList = newsRepo.findAllByAuthor(userId);
//        if(newsList.isEmpty()){
//            res.setStatusCode(404);
//            res.setError("These is nothing here");
//        }else{
//            res.setStatusCode(200);
//            res.setMessage("News");
//            res.setNewsList(newsList);
//        }
//        return res;
//    }
//
//    public ReqResNews viewNewsByUserId(int userId, int newsId){
//        ReqResNews res = new ReqResNews();
//        List<NewsModel> nList = listNewsByUserId(userId).getNewsList();
//        boolean exist = false;
//        for(NewsModel news: nList){
//            if(news.getNewsId() == newsId){
//                res.setStatusCode(200);
//                res.setMessage("Found");
//                res.setNews(news);
//                exist = true;
//            }
//        }
//        if(!exist){
//            res.setStatusCode(404);
//            res.setError("Not exist");
//        }
//        return res;
//    }
//==========================================================//

    public void deleteNews(int newsId){
        newsRepo.deleteById(newsId);
    }

    public ReqResNews updateNews(int newsId, ReqResNews request){
        ReqResNews res = new ReqResNews();
        Optional<NewsModel> checkNews = newsRepo.findById(newsId);
        Optional<NewsModel> checkHeadline = newsRepo.findByHeadline(request.getHeadline());

        try {
            if (checkNews.isPresent()) {
                NewsModel news = checkNews.get();
                if (request.getNewsImage() !=null) {


                    byte[] imageByte = request.getNewsImage().getBytes();
                    news.setNewsImage(imageByte);
                    news.setNewsImage(imageByte);
                }
                if (request.getNewsContent() != null) {
                    news.setNewsContent(request.getNewsContent());
                }
                if (request.getHeadline() != null) {
                    news.setHeadline(request.getHeadline());
                }
                newsRepo.save(news);
                res.setStatusCode(200);
                res.setMessage("Updated successfully");
                res.setNews(news);
                return res;

            } else {
                res.setStatusCode(404);
                res.setError("Not found");
                return res;
            }
        }catch(Exception ex){
            res.setStatusCode(500);
            res.setError("Error in NewsService: "+ex.getMessage());
        }
        return res;
    }

    public ReqResNews search(String keyword){
        List<NewsModel> search = newsRepo.findByHeadlineContainingIgnoreCase(keyword);
        ReqResNews res = new ReqResNews();
        if(search.isEmpty()){
            res.setStatusCode(404);
            res.setError("Not found");
            return res;
        }else{
            res.setNewsList(search);
            res.setStatusCode(200);
            res.setMessage("News");
            return res;
        }
    }


}
