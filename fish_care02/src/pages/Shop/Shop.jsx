import React, { useState, useEffect } from "react";
import { Link , useLocation } from "react-router-dom";
import ProductService from "./ShopService.js";
import CartService from "./Cart/CartService.js";
import { jwtDecode } from "jwt-decode";
import { ROUTERS } from "../../utis/router.js";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  Button,
  Badge,
} from "react-bootstrap";
import { FaShoppingCart, FaImage } from "react-icons/fa";
import AddToCart from "./Cart/AddToCart/AddToCart.jsx";
import ToastNotification from "./Cart/AddToCart/ToastNotification.jsx"; // Import the Toast component
import "./_shop.scss";

// Function to extract user ID from token
const extractUserId = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded ? decoded.userId : null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

const Shop = () => {
  const [Id, setId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const location = useLocation();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      const userId = extractUserId(token.replace("Bearer ", ""));
      setId(userId);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ProductService.getAllProducts();
        setProducts(productData);
      } catch (error) {
        setError("Error fetching products: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Check if the payment was successful from the URL params
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment");

    if (paymentStatus === "Successfully") {
      setToastMessage("Payment was successful!");
      setShowToast(true);

      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  }, [location]);

  const handleAddToCart = async (productId) => {
    console.log("Attempting to add product ID:", productId);
    try {
      const response = await CartService.addProductToCart(productId, 1);
      setCartItemCount((prevCount) => prevCount + 1);
      console.log("Product added to cart:", response);
      setToastMessage("Product added to cart successfully!"); // Set success message
      setShowToast(true); // Show the toast

      // Auto-close the toast after 2 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to add product to cart:",
        error.response ? error.response.data : error
      );
      alert("Failed to add product to cart: " + error.message);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="shop-container py-5">
      {showToast && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setShowToast(false)} // Close the toast manually if needed
        />
      )}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6} lg={4}>
          <div className="search-bar-container">
            <Form.Control
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="search-input"
            />
          </div>
        </Col>
        <Col xs="auto" className="mt-3 mt-md-0">
          {/* Make the cart icon a link to the cart page */}
          <Link to="/user/cart/getCartByUser">
            <Button
              variant="outline-primary"
              className="rounded-circle p-2 position-relative"
            >
              <FaShoppingCart size={24} />
              <Badge
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle rounded-pill"
              >
                {cartItemCount}
              </Badge>
            </Button>
          </Link>
        </Col>
      </Row>
      {/* Render products */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredProducts.length > 0 ? (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm product-card">
                <div className="product-image-container">
                  {product.productImage ? (
                    <Card.Img
                      variant="top"
                      src={`data:image/jpeg;base64,${product.productImage}`}
                      alt={product.productName}
                      className="product-image"
                    />
                  ) : (
                    <div className="placeholder-image">
                      <FaImage size={48} color="#ccc" />
                    </div>
                  )}
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="product-title">
                    {product.productName}
                  </Card.Title>
                  <Card.Text className="text-primary fw-bold mb-2">
                    {product.price
                      .toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                      .replace("₫", "đ")}
                  </Card.Text>
                  {product.description && (
                    <Card.Text className="product-description">
                      {product.description}
                    </Card.Text>
                  )}
                  <div className="mt-auto">
                    {/* Add to Cart Button */}
                    <AddToCart
                      userId={Id}
                      productId={product.id}
                      onAdd={handleAddToCart}
                      className="mb-2" // Add margin-bottom for spacing
                    />
                    <Link to={`/public/product/${product.id}`}>
                      <Button
                        variant="info"
                        className="w-100 mb-2"
                        style={{ padding: "0.75rem 1rem" }}
                      >
                        Detail
                      </Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">No products available</Alert>
      )}
    </Container>
  );
};

export default Shop;
