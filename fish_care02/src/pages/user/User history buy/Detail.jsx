import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HistoryOrder from "./HistoryOrder"; // Adjust the import path as necessary
import "./detail.scss"; // Import the SCSS file

const Detail = () => {
  const { orderId } = useParams(); // Extract orderId from the URL
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const orderData = await HistoryOrder.getOrderDetail(orderId); // Fetch order by ID
        setOrderDetail(orderData);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(err.message || "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleBackToHistory = () => {
    navigate("/user/track/history"); // Navigate back to order history page
  };

  // Render loading state
  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Render order detail
  return (
    <div className="container py-5 order-detail-container">
      <h1 className="mb-4 text-center">Order Detail</h1>
      {orderDetail &&
      orderDetail.products &&
      orderDetail.products.length > 0 ? (
        <div className="card order-card shadow">
          <h5 className="card-title">Order ID: {orderDetail.orderId}</h5>
          <p className="card-text">
            <strong>Status:</strong> {orderDetail.status || "N/A"}
          </p>
          <p className="card-text">
            <strong>Date:</strong>{" "}
            {new Date(orderDetail.timestamp).toLocaleDateString()}
          </p>
          {orderDetail.products.map((product, index) => (
            <div key={index} className="product-item">
              {product.productImageBase64 && (
                <img
                  src={product.productImageBase64}
                  alt={product.productName}
                  className="card-img-top product-image"
                />
              )}
              <div className="card-body">
                <p className="card-text">
                  <strong>Product:</strong> {product.productName || "N/A"}
                </p>
              </div>
            </div>
          ))}
          <button
            onClick={handleBackToHistory}
            className="btn btn-outline-primary mt-3"
          >
            Back to Order History
          </button>
        </div>
      ) : (
        <p className="text-center text-muted">
          No details found for this order.
        </p>
      )}
    </div>
  );
};

export default Detail;
