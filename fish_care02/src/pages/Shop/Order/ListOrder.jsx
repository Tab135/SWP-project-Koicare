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
  const [phone, setPhone] = useState("");
  const [addressLoading, setAddressLoading] = useState(true);
  const [phoneLoading, setPhoneLoading] = useState(true);

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

  localStorage.setItem("orderId", orderId);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch address and phone in parallel
        const [addressResponse, phoneResponse] = await Promise.all([
          axios.get("http://170.64.198.85:8080/user/get-address", { headers }),
          axios.get("http://170.64.198.85:8080/user/get-phone", { headers })
        ]);

        setAddress(addressResponse.data.address || "");
        setPhone(phoneResponse.data.phone || "");
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load user information.");
      } finally {
        setAddressLoading(false);
        setPhoneLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Update both address and phone in parallel
      await Promise.all([
        axios.post(
          "http://170.64.198.85:8080/user/update-address",
          { address },
          { headers }
        ),
        axios.post(
          "http://170.64.198.85:8080/user/update-phone",
          { phone },
          { headers }
        )
      ]);

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

  if (loading || addressLoading || phoneLoading) {
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

  // Check if address or phone is empty or only contains whitespace
  const isAddressEmpty = !address || address.trim() === "";
  const isPhoneEmpty = !phone || phone.trim() === "";
  const isFormValid = !isAddressEmpty && !isPhoneEmpty;

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

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              placeholder="Enter your shipping address"
              onChange={handleAddressChange}
              isInvalid={isAddressEmpty}
            />
            {isAddressEmpty && (
              <Form.Text className="text-danger">
                Please enter a shipping address
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group controlId="formPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="tel"
              value={phone}
              placeholder="Enter your phone number"
              onChange={handlePhoneChange}
              isInvalid={isPhoneEmpty}
            />
            {isPhoneEmpty && (
              <Form.Text className="text-danger">
                Please enter a phone number
              </Form.Text>
            )}
          </Form.Group>

          <div className="text-center mt-4">
            <Button
              size="sm"
              variant="success"
              onClick={handlePayment}
              disabled={!isFormValid}
              style={{ opacity: isFormValid ? 1 : 0.5 }}
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