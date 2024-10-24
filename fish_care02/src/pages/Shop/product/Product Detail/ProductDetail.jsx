import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../../ShopService";
import { Container, Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import "./productdetail.css"; // Import custom CSS if needed

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchProduct();
  }, [productId]);

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
          </Card.Body>
        </Card>
      ) : (
        <Alert variant="warning">Product not found</Alert>
      )}
    </Container>
  );
};

export default ProductDetail;
