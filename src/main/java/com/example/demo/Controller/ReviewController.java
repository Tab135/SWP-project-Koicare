package com.example.demo.Controller;

import com.example.demo.REQUEST_AND_RESPONSE.ReqResReview;
import com.example.demo.Service.JWTUtils;
import com.example.demo.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReviewController {

    @Autowired
    private ReviewService review;
    @Autowired
    private JWTUtils jwt;

    @PostMapping("/user/review/{productId}")
    public ResponseEntity<ReqResReview> postReview(@RequestHeader("Authorization") String token, @RequestBody ReqResReview reviewBody, @PathVariable int productId) {
        int userId = jwt.extractUserId(token.replace("Bearer ", ""));
        return ResponseEntity.ok(review.writeReview(reviewBody, userId, productId));
    }

    @DeleteMapping("/admin/review/{reviewId}")
    public ResponseEntity<ReqResReview> deleteReview(@PathVariable int reviewId) {
        return ResponseEntity.ok(review.deleteReview(reviewId));
    }

    @GetMapping("/public/review/listReview/{productId}")
    public ResponseEntity<List<ReqResReview>> show(@PathVariable int productId) {
        return ResponseEntity.ok(review.listReviewByProductId(productId));
    }

}
