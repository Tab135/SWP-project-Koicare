import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderService from "./OrderService";
import {
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  Table,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import PaymentService from "./PaymentService";
import axios from "axios";

const ListOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const [address, setAddress] = useState("");
  const [addressLoading, setAddressLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const orderData = await OrderService.getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/user/get-address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddress(response.data.address || "");
      } catch (err) {
        console.error("Failed to fetch address:", err);
        setError("Failed to load user address.");
      } finally {
        setAddressLoading(false);
      }
    };

    fetchAddress();
  }, []);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/user/update-address",
        { address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const paymentData = {
        amount: order.totalAmount * 100,
        orderInfo: `Order ID: ${orderId}`,
      };

      const paymentResponse = await PaymentService.createPayment(paymentData);

      if (paymentResponse.url) {
        window.location.href = paymentResponse.url;
      } else {
        throw new Error("Payment URL not found in response.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || addressLoading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!order) {
    return <Alert variant="warning">No order found.</Alert>;
  }

  // Check if address is empty or only contains whitespace
  const isAddressEmpty = !address || address.trim() === "";

  return (
    <Container className="order-container">
      <Card className="order-card">
        <Card.Body>
          <Card.Title>Order Details</Card.Title>
          <Row>
            <Col>
              <h5>Status: {order.orderStatus || "N/A"}</h5>
              <h5>
                Total Price:{" "}
                {order.totalAmount
                  .toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                  .replace("₫", "đ")}
              </h5>
              <h5>
                Order Date:{" "}
                {new Date(order.orderDate).toLocaleString() || "N/A"}
              </h5>
            </Col>
          </Row>
          <Table striped bordered hover className="order-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName || "N/A"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Form.Group controlId="formAddress">
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              placeholder="Enter your shipping address"
              onChange={handleAddressChange}
              isInvalid={isAddressEmpty}
            />
            {isAddressEmpty && (
              <Form.Text className="text-muted">
                Please enter a shipping address to proceed with payment
              </Form.Text>
            )}
          </Form.Group>
          <div className="text-center mt-4">
            <Button
              size="sm"
              variant="success"
              onClick={handlePayment}
              disabled={isAddressEmpty}
              style={{ opacity: isAddressEmpty ? 0.5 : 1 }}
            >
              Pay Now
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ListOrder;