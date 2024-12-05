package com.example.demo.Service;


import com.example.demo.DTO.Shop.OrderItem;
import com.example.demo.DTO.Shop.OrderStatus;
import com.example.demo.DTO.Shop.ProductModel;
import com.example.demo.DTO.ReviewModel;
import com.example.demo.DTO.UserModel;
import com.example.demo.REQUEST_AND_RESPONSE.ReqResReview;
import com.example.demo.Repo.Shop.OrderItemRepository;
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
    @Autowired
    private OrderItemRepository orderItemRepository;

    public boolean CanReview(int userId, int productId) {
        List<OrderItem> orderItems = orderItemRepository.findByProductIdAndUserId(productId, userId);
        boolean hasDeliveredOrder = orderItems.stream().anyMatch(orderItem ->
                orderItem.getOrder().getOrderTrackingList().stream()
                        .anyMatch(tracking -> tracking.getStatus() == OrderStatus.SHIPPED)
        );
        return hasDeliveredOrder;
    }


    public ReqResReview writeReview(ReqResReview review, int userId, int productId) {
        ReqResReview resp = new ReqResReview();
        ReviewModel reviewModel = new ReviewModel();

        // Fetch user and product using their IDs
        UserModel user = userRepo.findById(userId).orElseThrow();
        ProductModel product = productRepo.findById(productId).orElseThrow();
        if (CanReview(userId,productId)) {
            // Set the user, rating, comment, and product for the review
            reviewModel.setUser(user);
            reviewModel.setRating(review.getRating());
            reviewModel.setComment(review.getComment());
            reviewModel.setProduct(product);

            // Save the review
            ReviewModel savedReview = reviewRepo.save(reviewModel);
            if (savedReview.getId() > 0) {
                resp.setComment(review.getComment());
                resp.setRating(review.getRating());

                // Calculate the average rating for the product
                double averageRating = calculateAverageRating(product.getId());

                // Update the product's average rating
                product.setProductRating(averageRating);
                productRepo.save(product); // Save the updated product
            }
        }
        return resp;
    }
    public double calculateAverageRating(int productId) {
        List<ReviewModel> reviews = reviewRepo.findByProductId(productId);

        if (reviews.isEmpty()) {
            return 0.0; // Return 0 if no reviews are present
        }

        double totalRating = 0.0;
        for (ReviewModel review : reviews) {
            totalRating += review.getRating();
        }

        return totalRating / reviews.size(); // Calculate the average
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
            reqResReview.setUserName(review.getUser().getName()); // Assuming UserModel has a getId() method
            reqResReview.setProductId(review.getProduct().getId()); // Assuming ProductModel has a getId() method
            return reqResReview;
        }).collect(Collectors.toList());
    }
}

