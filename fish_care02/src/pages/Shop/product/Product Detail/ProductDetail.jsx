import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../../ShopService";
import ReviewService from "./ReviewService";
import StarRating from "./StarRating";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";
import { FaStar, FaUser } from "react-icons/fa";
import "./productdetail.scss";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [canReview, setCanReview] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, reviewData] = await Promise.all([
          ProductService.getProductById(productId),
          ReviewService.getReviewsByProductId(productId),
        ]);
        setProduct(productData);
        setReviews(reviewData);

        // Check if user can review
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          const response = await fetch(`http://localhost:8080/public/review/canReview/${productId}/${userId}`);
          const canReviewData = await response.json();
          setCanReview(canReviewData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleStarRatingChange = (rating) => {
    setNewReview((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      // Check user role
      if (role !== "USER") {
        navigate("/login");
        return;
      }

      // Proceed to post the review
      await ReviewService.postReview(productId, {
        comment: newReview.comment,
        rating: newReview.rating,
      });

      const [updatedProduct, updatedReviews] = await Promise.all([
        ProductService.getProductById(productId),
        ReviewService.getReviewsByProductId(productId),
      ]);

      setProduct(updatedProduct);
      setReviews(updatedReviews);
      setNewReview({ comment: "", rating: 0 });
    } catch (err) {
      console.error("Error posting review:", err);
      setError("Error posting review: " + err.message);
    }
  };

  const renderReviewForm = () => {
    if (!canReview) {
      return null;
    }

    return (
      <div className="review-form-section">
        <h3>Write a Review</h3>
        <Form onSubmit={handleSubmitReview}>
          <Form.Group className="rating-group">
            <Form.Label>Your Rating</Form.Label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={handleStarRatingChange}
            />
          </Form.Group>
          <Form.Group className="comment-group">
            <Form.Label>Your Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="comment"
              value={newReview.comment}
              onChange={handleReviewChange}
              placeholder="Share your thoughts about this product..."
              required
            />
          </Form.Group>
          <Button type="submit" className="submit-review-btn">
            Submit Review
          </Button>
        </Form>
      </div>
    );
  };

  return (
    <div className="product-detail-page">
      <Container>
        {error && <Alert variant="danger">{error}</Alert>}
        {product ? (
          <>
            <div className="product-section">
              <Row>
                <Col md={6} className="product-image-section">
                  {product.productImageBase64 ? (
                    <div className="image-container">
                      <img
                        src={`data:image/jpeg;base64,${product.productImageBase64}`}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                  ) : (
                    <div className="no-image">No image available</div>
                  )}
                </Col>
                <Col md={6} className="product-info-section">
                  <h1 className="product-title">{product.name}</h1>
                  <div className="product-meta">
                    <span className="category">
                      Category: {product.categoryName}
                    </span>
                    <div className="rating">
                      <FaStar className="star-icon" />
                      <span>{product.productRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="price">
                    {product.price.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </div>
                  <div className="stock-info">
                    <span
                      className={`stock-badge ${
                        product.amount > 0 ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {product.amount > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                    <span className="stock-amount">
                      {product.amount} units available
                    </span>
                  </div>
                  <div className="description">
                    <h3>Description</h3>
                    <p>{product.description}</p>
                  </div>
                  <div className="period-info">
                    <h3>Availability Period</h3>
                    <p>{product.expirationPeriod}</p>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="reviews-section">
              <h2>Customer Reviews</h2>
              <div className="reviews-container">
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <Card key={index} className="review-card">
                      <Card.Body>
                        <div className="review-header">
                          <div className="reviewer-info">
                            <FaUser className="user-icon" />
                            <span className="reviewer-name">
                              {review.userName}
                            </span>
                          </div>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < review.rating
                                    ? "star-filled"
                                    : "star-empty"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <div className="review-content">{review.comment}</div>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <div className="no-reviews">
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>

              {renderReviewForm()}
            </div>
          </>
        ) : (
          <Alert variant="warning">Product not found</Alert>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;