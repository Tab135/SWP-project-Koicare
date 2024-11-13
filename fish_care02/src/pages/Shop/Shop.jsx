import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import GuestCartService from "./Guest/GuestCartService.js";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get the userId from the token if logged in
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      const userId = extractUserId(token.replace("Bearer ", ""));
      setId(userId);
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryData = await ProductService.getAllCategory();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
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

  // Get cart item count based on logged-in user
  useEffect(() => {
    const fetchCartItemCount = async () => {
      if (Id) {
        try {
          const response = await CartService.getCartByUser();
          setCartItemCount(response.data.itemNumber); // Use the number of items in the cart
        } catch (error) {
          console.error("Error fetching cart item count:", error);
        }
      } else {
        // If no user, check for items in session storage
        const cartItems = sessionStorage.getItem("cartItems");
        setCartItemCount(cartItems ? JSON.parse(cartItems).length : 0);
      }
    };

    fetchCartItemCount();
  }, [Id]);
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      const userId = extractUserId(token.replace("Bearer ", ""));
      setId(userId);
      setIsLoggedIn(true);

      // When user logs in, merge their guest cart with their user cart
      const mergeGuestCart = async () => {
        try {
          await CartService.mergeGuestCart();
          // After merging, update the cart item count
          const response = await CartService.getCartByUser();
          setCartItemCount(response.data.itemNumber);
        } catch (error) {
          console.error("Error merging guest cart:", error);
        }
      };

      mergeGuestCart();
    } else {
      setIsLoggedIn(false);
      // If not logged in, get cart count from guest cart
      const guestCartCount = GuestCartService.getGuestCartCount();
      setCartItemCount(guestCartCount);
    }
  }, []);

  // Handle adding to the cart
  const handleAddToCart = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);

      if (!isLoggedIn) {
        // Add to guest cart if not logged in
        GuestCartService.addToGuestCart(product);
        setCartItemCount(GuestCartService.getGuestCartCount());
        setToastMessage("Product added to guest cart!");
        setShowToast(true);
      } else {
        // Add to user cart if logged in
        await CartService.addProductToCart(productId, 1);
        const response = await CartService.getCartByUser();
        setCartItemCount(response.data.itemNumber);
        setToastMessage("Product added to cart successfully!");
        setShowToast(true);
      }

      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    } catch (error) {
      setToastMessage("Failed to add product to cart: " + error.message);
      setShowToast(true);
    }
  };

  // Filtering products based on search term and selected category
  const filteredProducts = products.filter(
    (product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory
        ? product.category.categoryName === selectedCategory
        : true)
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
          <Col xs={12} md={4}>
            <Form.Control
              as="select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mb-2"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </Form.Control>
          </Col>
          <Col xs={12} md={4}>
            <Form.Control
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </Col>
          <Col xs="auto" className="d-flex align-items-center">
            <Link
              to="/user/cart/getCartByUser"
              className="cart-button-link"
             
            >
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
            {filteredProducts.map((product) => {
              if (product.amount === 0) return null; // Don't render if out of stock
              return (
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
                        {product.price.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
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
              );
            })}
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
