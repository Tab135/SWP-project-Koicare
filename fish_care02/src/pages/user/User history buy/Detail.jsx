import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HistoryOrder from "./HistoryOrder";
import "./detail.scss";

const Detail = () => {
  const { orderId } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const orderData = await HistoryOrder.getOrderDetail(orderId);
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
    navigate("/user/track/history");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <i className="fas fa-exclamation-circle"></i>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={handleBackToHistory} className="btn-back">
            Return to Order History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      <div className="order-header">
        <h1>Order Details</h1>
        <span
          className="order-status"
          data-status={orderDetail?.status?.toLowerCase()}
        >
          {orderDetail?.status || "N/A"}
        </span>
      </div>

      {orderDetail &&
      orderDetail.products &&
      orderDetail.products.length > 0 ? (
        <div className="order-content">
          <div className="order-info">
            <div className="info-section">
              <h3>Order Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Order Date</label>
                  <span>
                    {new Date(orderDetail.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="info-item">
                  <label>Total Amount</label>
                  <span className="price">
                    {orderDetail.totalAmount
                      ? `${orderDetail.totalAmount.toLocaleString()} VND`
                      : "0.00 VND"}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3>Customer Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <span>{orderDetail.userName || "N/A"}</span>
                </div>
                <div className="info-item">
                  <label>Delivery Address</label>
                  <span>{orderDetail.userAddress || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="products-section">
            <h3>Ordered Products</h3>
            <div className="products-grid">
              {orderDetail.products.map((product, index) => (
                <div key={index} className="product-card">
                  {product.productImageBase64 && (
                    <div className="product-image-container">
                      <img
                        src={product.productImageBase64}
                        alt={product.productName}
                        className="product-image"
                      />
                    </div>
                  )}
                  <div className="product-info">
                    <h4>{product.productName || "N/A"}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleBackToHistory} className="btn-back">
            <i className="fas fa-arrow-left"></i> Back to Order History
          </button>
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-box-open"></i>
          <p>No details found for this order.</p>
          <button onClick={handleBackToHistory} className="btn-back">
            Return to Order History
          </button>
        </div>
      )}
    </div>
  );
};

export default Detail;
