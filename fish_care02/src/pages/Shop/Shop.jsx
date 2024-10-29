import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
import ToastNotification from "./Cart/AddToCart/ToastNotification.jsx";
import "./_shop.scss";
import { useNavigate } from "react-router-dom";

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      const userId = extractUserId(token.replace("Bearer ", ""));
      setId(userId);
      const storedCount = localStorage.getItem(`cartItemCount_${userId}`);
      if (storedCount) {
        setCartItemCount(Number(storedCount));
      }
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
    const fetchCartItemCount = async () => {
      if (Id) {
        try {
          const response = await CartService.countItemsInCart(Id);
          setCartItemCount(response.data);
        } catch (error) {
          console.error("Error fetching cart item count:", error);
        }
      }
    };

    fetchCartItemCount();
  }, [Id]);

  const handleAddToCart = async (productId) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
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

      // Proceed to add the product to the cart
      await CartService.addProductToCart(productId, 1);
      const newCount = cartItemCount + 1;
      setCartItemCount(newCount);
      localStorage.setItem(`cartItemCount_${Id}`, newCount);
      setToastMessage("Product added to cart successfully!");
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      setToastMessage("Failed to add product to cart: " + error.message);
      setShowToast(true);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="shop-container">
      {showToast && (
        <ToastNotification
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}

      <Container>
        <Row className="justify-content-center mb-4">
          <Col xs={12} md={6} lg={4}>
            <div className="search-bar-container">
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </Col>
          <Col xs="auto" className="d-flex align-items-center">
            <Link to="/user/cart/getCartByUser" className="cart-button-link">
              <div className="cart-button">
                <FaShoppingCart size={20} />
                {cartItemCount > 0 && (
                  <span className="cart-badge">{cartItemCount}</span>
                )}
              </div>
            </Link>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredProducts.length > 0 ? (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.id}>
                <Card className="product-card">
                  <div className="product-image-container">
                    {product.productImage ? (
                      <img
                        src={`data:image/jpeg;base64,${product.productImage}`}
                        alt={product.productName}
                        className="product-image"
                      />
                    ) : (
                      <div className="placeholder-image">
                        <FaImage size={40} />
                      </div>
                    )}
                  </div>
                  <Card.Body>
                    <h3 className="product-title">{product.productName}</h3>
                    <div className="product-price">
                      {/* Ensure the price is formatted as VND */}
                      {product.price
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                        .replace("₫", "đ")}
                    </div>
                    {product.description && (
                      <p className="product-description">
                        {product.description}
                      </p>
                    )}
                    {product.amount && (
                      <div className="product-amount">
                        Stock: {product.amount}
                      </div>
                    )}
                    <div className="mt-auto">
                      <AddToCart
                        userId={Id}
                        productId={product.id}
                        onAdd={handleAddToCart}
                      />
                      <Link to={`/public/product/${product.id}`}>
                        <Button variant="info">View Details</Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info" className="text-center">
            No products found
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default Shop;
