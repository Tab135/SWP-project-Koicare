import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get("vnp_ResponseCode");
    const orderId = localStorage.getItem('orderId')
    // Debug information
    setDebugInfo({
      orderId,
      responseCode,
      allParams: Object.fromEntries(queryParams.entries()),
      search: location.search
    });

    const validatePayment = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        console.log('Calling API with orderId:', orderId);

        const response = await axios.get(`http://localhost:8080/user/payment/payment-success`, {
          params: {
            orderId: orderId
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        localStorage.removeItem("orderId");

        console.log('API Response:', response.data);
        setPaymentStatus(response.data);

      } catch (err) {
        console.error('Payment validation error:', err);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Payment Status</h1>



      {/* Debug Information Panel (only show in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Payment;