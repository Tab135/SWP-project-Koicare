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
    const orderId = queryParams.get("orderId"); // Assuming you pass this in the return URL
    const responseCode = queryParams.get("vnp_ResponseCode");

    // Call your backend to validate the payment
    const validatePayment = async () => {
      try {
        const response = await axios.get(`/user/payment/payment-success`, {
          params: {
            orderId: orderId,
            vnp_ResponseCode: responseCode,
          },
        });
        setPaymentStatus(response.data); // or whatever structure your API returns
      } catch (err) {
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
      <p>{paymentStatus}</p>
      {/* You can also add a button to navigate back to the shop or view orders */}
    </div>
  );
};

export default Payment;
