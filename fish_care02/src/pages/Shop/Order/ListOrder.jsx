import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OrderService from "./OrderService"; // Adjust import as necessary
import {
  Alert,
  Spinner,
  Container,
  Row,
  Col,
  Table,
  Card,
  Button,
} from "react-bootstrap";
import "./listOrder.scss";
import PaymentService from "./PaymentService";
import ToastNotification from "../Cart/AddToCart/ToastNotification";
const ListOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      console.log("Order ID from URL:", orderId);
      if (!orderId) {
        setError("Order ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const orderData = await OrderService.getOrderById(orderId);
        console.log("Fetched Order Data:", orderData); // Add this line
        setOrder(orderData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
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
  const handlePayment = async () => {
    try {
      // Ensure you're using the correct amount and orderInfo from the fetched order
      const paymentData = {
        amount: order.totalAmount * 100, // Make sure totalAmount is a number
        orderInfo: `Order ID: ${orderId}`, // Use dynamic orderId
      };

      console.log("Payment Data:", paymentData); // Log payment data for debugging

      // Call the createPayment function in your service
      const paymentResponse = await PaymentService.createPayment(paymentData);
      console.log("Payment Response:", paymentResponse); // Log the response
      
      // Redirect the user to the payment URL
      if (paymentResponse.url) {
        window.location.href = paymentResponse.url; // Redirect to the payment page
      } else {
        throw new Error("Payment URL not found in response.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Render your order details here
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
          <div className="text-center">
            <Button size="sm" variant="success" onClick={handlePayment}>
              Pay Now
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ListOrder;
