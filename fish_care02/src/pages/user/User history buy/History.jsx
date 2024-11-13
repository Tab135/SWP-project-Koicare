import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryOrder from "./HistoryOrder";
import "./history.scss";

const History = () => {
  const [orderTrackingList, setOrderTrackingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderTracking = async () => {
      try {
        const orders = await HistoryOrder.getOrderByUser();
        setOrderTrackingList(orders);
      } catch (err) {
        console.error("Error fetching order tracking:", err);
        setError(err.message || "Failed to fetch order tracking.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderTracking();
  }, []);

  const handleRedirectToOrderDetails = (orderId) => {
    navigate(`/user/detail/${orderId}`);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "status-pending",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
    };
    return statusColors[status.toLowerCase()] || "status-default";
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1>Order History</h1>
        <p className="subtitle">Track your previous orders and their status</p>
      </div>

      {orderTrackingList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>When you make your first order, it will appear here.</p>
        </div>
      ) : (
        <div className="order-list">
          {orderTrackingList.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-image">
                {order.productImageBase64 ? (
                  <img
                    src={order.productImageBase64}
                    alt={order.productName}
                    className="product-image"
                  />
                ) : (
                  <div className="image-placeholder">No Image</div>
                )}
              </div>

              <div className="order-info">
                <div className="order-header">
                  <h2>Order #{order.orderId}</h2>
                  <span
                    className={`status-badge ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-details">
                  {order.productName && (
                    <div className="detail-item">
                      <span className="label">Product:</span>
                      <span className="value">{order.productName}</span>
                    </div>
                  )}

                  {order.userName && (
                    <div className="detail-item">
                      <span className="label">Customer:</span>
                      <span className="value">{order.userName}</span>
                    </div>
                  )}

                  <div className="detail-item">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(order.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleRedirectToOrderDetails(order.orderId)}
                  className="view-details-button"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
