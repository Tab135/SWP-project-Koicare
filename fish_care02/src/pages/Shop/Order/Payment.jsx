import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get("vnp_ResponseCode");
    const orderId = localStorage.getItem("orderId");

    // Debug information
    setDebugInfo({
      orderId,
      responseCode,
      allParams: Object.fromEntries(queryParams.entries()),
      search: location.search,
    });

    const validatePayment = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        console.log("Calling API with orderId:", orderId);

        const response = await axios.get(
          `http://170.64.198.85:8080/user/payment/payment-success`,
          {
            params: {
              orderId: orderId,
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        localStorage.removeItem("orderId");

        console.log("API Response:", response.data);
        setPaymentStatus(response.data);
      } catch (err) {
        console.error("Payment validation error:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Payment validation failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    // Only validate if we have an orderId
    if (orderId) {
      validatePayment();
    } else {
      setError("Order ID not found in URL parameters");
      setLoading(false);
    }
  }, [location]);

  const handleRedirectToShop = () => {
    navigate("/public/product"); // Redirects to the Shop page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Thank You!</h1>
        <p className="text-gray-700 text-center mb-6">
          Your payment has been successfully processed. We appreciate your
          business!
        </p>
        <button
          onClick={handleRedirectToShop}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Return to Shop
        </button>
      </div>
    </div>
  );
};

export default Payment;
