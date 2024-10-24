import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const orderId = queryParams.get("vnp_TxnRef"); // Ensure this is correct
    const responseCode = queryParams.get("vnp_ResponseCode");
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    console.log("Order ID:", orderId); // Debugging line
    console.log("Response Code:", responseCode); // Debugging line

    // Call your backend to validate the payment
    const validatePayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/user/payment/payment-success`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            params: {
              orderId: orderId, // Pass orderId here
              vnp_ResponseCode: responseCode,
            },
          }
        );
        // Adjust this based on your response structure
        setPaymentStatus(response.data); // or set response.data.status if that's what your API returns
      } catch (err) {
        console.error("Payment validation error:", err); // Log error details for debugging
        setError("Payment validation failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId && responseCode) {
      validatePayment();
    } else {
      setError("Invalid payment response.");
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Payment Status</h1>
      <p>
        {paymentStatus
          ? JSON.stringify(paymentStatus)
          : "No payment status available."}
      </p>
      {/* You can also add a button to navigate back to the shop or view orders */}
    </div>
  );
};

export default Payment;
