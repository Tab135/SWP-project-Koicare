import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryOrder from "./HistoryOrder"; // Adjust the import path as necessaryimo
import "./history.scss"
const History = () => {
  const [orderTrackingList, setOrderTrackingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderTracking = async () => {
      try {
        const orders = await HistoryOrder.getOrderByUser(); // Use the service to get order history
        setOrderTrackingList(orders); // Adjust based on your API response structure
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
    navigate(`/user/detail/${orderId}`); // Adjust this to match your order details route
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <h1 className="text-red-500">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Render order history
  return (
    <div className="history-container">
      <h1>Order History</h1>
      {orderTrackingList.length === 0 ? (
        <p className="text-center text-gray-600">No orders found.</p>
      ) : (
        <ul className="order-list">
          {orderTrackingList.map((order) => (
            <li key={order.orderId} className="order-item">
              <div className="order-card">
                {/* Display Product Image */}
                {order.productImageBase64 && (
                  <img
                    src={order.productImageBase64}
                    alt={order.productName}
                    className="product-image "
                  />
                )}
                <div className="order-details">
                  <h2>Order ID: {order.orderId}</h2>
                  {/* Display Product Name */}
                  {order.productName && (
                    <p className="text-gray-700">
                      Product:{" "}
                      <span className="font-medium">{order.productName}</span>
                    </p>
                  )}
                  {/* Display Order Status */}
                  <p className="status text-gray-600">
                    Status:{" "}
                    <span className="font-semibold">{order.status}</span>
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date(order.timestamp).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleRedirectToOrderDetails(order.orderId)}
                    className="view-details-button"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
