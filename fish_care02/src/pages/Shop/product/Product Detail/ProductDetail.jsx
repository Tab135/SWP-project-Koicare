import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../../ShopService";
import ReviewService from "./ReviewService"; // Import your ReviewService
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
import "./productdetail.css"; // Import custom CSS if needed

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]); // State to hold reviews
  const [newReview, setNewReview] = useState({ comment: "", rating: 0 }); // State for new review

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await ProductService.getProductById(productId);
        console.log("Fetched product data:", productData);
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Error fetching product details: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const reviewData = await ReviewService.getReviewsByProductId(productId);
        console.log("Fetched reviews:", reviewData);
        setReviews(reviewData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Error fetching reviews: " + err.message);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [productId]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };
  const handleRatingChange = (newRating) => {
    setNewReview((prev) => ({ ...prev, rating: newRating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await ReviewService.postReview({ ...newReview, productId });
      // Optionally, refetch reviews after submitting
      const updatedReviews = await ReviewService.getReviewsByProductId(
        productId
      );
      setReviews(updatedReviews);
      setNewReview({ comment: "", rating: 0 }); // Reset form
    } catch (err) {
      console.error("Error posting review:", err);
      setError("Error posting review: " + err.message);
    }
  };

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-5">
      {product ? (
        <Card className="shadow-sm">
          <Card.Body>
            <Row>
              <Col md={4} className="text-center">
                {product.productImageBase64 ? (
                  <Card.Img
                    variant="top"
                    src={`data:image/jpeg;base64,${product.productImageBase64}`}
                    alt={product.productName}
                    className="img-fluid product-image"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </Col>
              <Col md={8}>
                <Card.Title className="product-title">
                  {product.name}
                </Card.Title>
                <Card.Text className="fw-bold">
                  Category: {product.categoryName}
                </Card.Text>
                <Card.Text className="fw-bold">
                  Price:{" "}
                  {product.price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Card.Text>
                <Card.Text className="product-description">
                  Amount: {product.amount}
                </Card.Text>
                <Card.Text className="fw-bold">
                  Rating: {product.productRating}
                </Card.Text>
                <Card.Text className="product-description">
                  {product.description}
                </Card.Text>
              </Col>
            </Row>

            {/* Reviews Section */}
            <div className="mt-4">
              <h5>Reviews</h5>
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <Card key={index} className="mb-2">
                    <Card.Body>
                      <Card.Text>
                        <strong>{review.userID}</strong>: {review.comment}{" "}
                        <br />
                        <span>Rating: {review.rating} stars</span>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <Alert variant="info">No reviews yet.</Alert>
              )}

              {/* Review Form */}
              <h6>Write a Review</h6>
              <Form onSubmit={handleSubmitReview}>
                <Form.Group controlId="formComment">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="comment"
                    value={newReview.comment}
                    onChange={handleReviewChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formRating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    name="rating"
                    value={newReview.rating}
                    onChange={handleReviewChange}
                    min={0}
                    max={5}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-2">
                  Submit Review
                </Button>
              </Form>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning">Product not found</Alert>
      )}
    </Container>
  );
};

export default ProductDetail;
