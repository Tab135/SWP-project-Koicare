import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";
import { FaImage, FaTrash } from "react-icons/fa";
import CartService from "../CartService";
import "./list.scss"; // Adjust the import path as necessary

const extractUserId = (token) => {
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload.userId; // Adjust according to your token's structure
};

const ListCart = () => {
  const { userId } = useParams(); // Assuming you're using the userId from the URL
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0); // State to hold total price

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated.");
        }
        const userId = extractUserId(token.replace("Bearer ", ""));
        const cartData = await CartService.getCartByUser();
        setCartItems(cartData.items);
        // Fetch total price after cart items are loaded
        await handleGetTotalPrice();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleGetTotalPrice = async () => {
    try {
      const response = await CartService.getTotalPrice();
      setTotalPrice(response); // Set total price in state
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuantityChange = async (cartItemId, change) => {
    try {
      const updatedItems = cartItems.map((item) => {
        if (item.id === cartItemId) {
          const newQuantity = item.quantity + change;
          return { ...item, quantity: Math.max(newQuantity, 1) }; // Ensure quantity doesn't go below 1
        }
        return item;
      });
      const updatedItem = updatedItems.find((item) => item.id === cartItemId);
      const productId = updatedItem.product.id;
      // Call the backend to update the quantity
      await CartService.updateCart(productId, updatedItem.quantity);
      setCartItems(updatedItems);
      await handleGetTotalPrice(); // Update total price after quantity change
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveFromCart = async (cartItemId) => {
    try {
      await CartService.removeFromCart(cartItemId);
      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== cartItemId)
      );
      await handleGetTotalPrice(); // Update total price after removing an item
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container fluid className="cart-container py-5">
      <h2>Your Cart</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : cartItems && cartItems.length === 0 ? (
        <Alert variant="info">Your cart is empty.</Alert>
      ) : (
        <Row>
          <Col md={8}>
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-3 shadow-sm cart-card">
                <Card.Body className="d-flex align-items-start">
                  <div className="me-3 product-image-container">
                    {item.product.productImage ? (
                      <Card.Img
                        variant="top"
                        src={`data:image/jpeg;base64,${item.product.productImage}`}
                        alt={item.product.productName}
                        className="product-image"
                      />
                    ) : (
                      <div className="placeholder-image">
                        <FaImage size={48} color="#ccc" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <Card.Title className="product-name">
                      {item.product.productName}
                    </Card.Title>
                    <Card.Text>Size {item.product.size}</Card.Text>
                    <Card.Text className="text-primary fw-bold product-price">
                      {item.product.price
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                        .replace("₫", "đ")}
                    </Card.Text>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="me-2 quantity-button"
                      >
                        -
                      </Button>
                      <span className="my-auto">{item.quantity}</span>
                      <Button
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="ms-2 quantity-button"
                      >
                        +
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="ms-3 remove-button d-flex align-items-center justify-content-center"
                        style={{ width: "40px", height: "40px", padding: "0" }}
                      >
                        <FaTrash size={20} color="#fff" />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col md={4}>
            <div className="p-3 bg-light rounded shadow-sm">
              <h4>Summary</h4>
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>
                  {totalPrice
                    .toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                    .replace("₫", "đ")}
                </span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Estimated Delivery & Handling</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>
                  {totalPrice
                    .toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                    .replace("₫", "đ")}
                </strong>
              </div>

              <Button variant="dark" className="w-100 mt-2">
                Checkout
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ListCart;
