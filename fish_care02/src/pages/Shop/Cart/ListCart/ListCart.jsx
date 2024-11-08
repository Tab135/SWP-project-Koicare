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
  Form,
} from "react-bootstrap";
import { FaImage, FaTrash } from "react-icons/fa";
import CartService from "../CartService";
import "./_list.scss";
import OrderService from "../../Order/OrderService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const extractUserId = (token) => {
  const payload = token.split(".")[1];
  const decodedPayload = JSON.parse(atob(payload));
  return decodedPayload.userId;
};

const ListCart = () => {
  const { userId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) throw new Error("User not authenticated.");
        const userId = extractUserId(token.replace("Bearer ", ""));
        const cartData = await CartService.getCartByUser();
        setCartItems(cartData.items);
        setCartItemCount(cartData.items.length);
        await handleGetTotalPrice();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      if (role !== "USER") {
        navigate("/login");
      }
    } else {
      navigate("/user/cart/getCartByUser");
    }
  }, [navigate]);

  const handleGetTotalPrice = async () => {
    try {
      const response = await CartService.getTotalPrice();
      setTotalPrice(response);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuantityChange = async (cartItemId, quantity) => {
    const updatedItems = cartItems.map((item) => {
      if (item.id === cartItemId) {
        const validQuantity = Math.min(quantity, item.product.amount); // Ensure quantity does not exceed stock
        return { ...item, quantity: Math.max(validQuantity, 1) };
      }
      return item;
    });

    setCartItems(updatedItems);
    const updatedItem = updatedItems.find((item) => item.id === cartItemId);
    const productId = updatedItem.product.id;

    try {
      await CartService.updateCart(productId, updatedItem.quantity);
      await handleGetTotalPrice();
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
      setCartItemCount((prevCount) => Math.max(prevCount - 1, 0));
      localStorage.setItem(`cartItemCount_${userId}`, cartItemCount - 1);
      await handleGetTotalPrice();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const orderResponse = await OrderService.createOrder();
      const orderId = orderResponse.id;
      console.log("Order created with ID:", orderId);
      navigate(`/user/order/getOrder/${orderId}`);
      alert("Order created successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
                  <div className="me-3 product-image-containers">
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
                    <Card.Text>
                      <strong>Available Stock:</strong> {item.product.amount}
                    </Card.Text>
                    <div className="d-flex align-items-center">
                      <Form.Control
                        type="number"
                        value={item.quantity}
                        min="1"
                        max={item.product.amount} // Set max to the available amount of product
                        onChange={(e) =>
                          handleQuantityChange(item.id, Number(e.target.value))
                        }
                        style={{ width: "80px", marginRight: "10px" }}
                      />
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
              <Button
                variant="success"
                className="mt-3 w-100"
                onClick={handleCheckout}
              >
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
