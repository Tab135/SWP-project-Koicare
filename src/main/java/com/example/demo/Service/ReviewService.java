package com.example.demo.Service;


import com.example.demo.DTO.Shop.ProductModel;
import com.example.demo.DTO.ReviewModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResReview;
import com.example.demo.Repo.Shop.ProductRepo;
import com.example.demo.Repo.ReviewRepo;
import com.example.demo.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ReviewService {

    @Autowired
    private ReviewRepo reviewRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private ProductRepo productRepo;


    public ReqResReview writeReview(ReqResReview review,int userId,int pondId){
        ReqResReview resp = new ReqResReview();
        ReviewModel reviewModel = new ReviewModel();

        UserModel user = userRepo.findById(userId).orElseThrow();
        ProductModel product = productRepo.findById(pondId).orElseThrow();
        reviewModel.setUser(user);
        reviewModel.setRating(review.getRating());
        reviewModel.setComment(review.getComment());
        reviewModel.setProduct(product);

        ReviewModel savedReview = reviewRepo.save(reviewModel);
        if(savedReview.getId() > 0){
            resp.setComment(review.getComment());
            resp.setRating(review.getRating());
        }
        return resp;
    }

    public ReqResReview deleteReview(int id){
        ReqResReview resp = new ReqResReview();
        try{
            Optional<ReviewModel> review = reviewRepo.findById(id);
            if(review.isPresent()){
                reviewRepo.deleteById(id);
                resp.setMessage("Successfully deleted comment");
            }
        }catch (Exception e){
            resp.setMessage(e.getMessage());
        }
        return resp;
    }
    public List<ReqResReview> listReviewByProductId(int productId) {
        // Fetch the list of reviews for the given productId
        List<ReviewModel> reviews = reviewRepo.findByProductId(productId);

        // Convert ReviewModel to ReqResReview
        return reviews.stream().map(review -> {
            ReqResReview reqResReview = new ReqResReview();
            reqResReview.setComment(review.getComment());
            reqResReview.setRating(review.getRating());
            reqResReview.setUserID(review.getUser().getId()); // Assuming UserModel has a getId() method
            reqResReview.setProductId(review.getProduct().getId()); // Assuming ProductModel has a getId() method
            return reqResReview;
        }).collect(Collectors.toList());
    }
}

