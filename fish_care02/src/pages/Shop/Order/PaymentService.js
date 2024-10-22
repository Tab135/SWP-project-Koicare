import axios from "axios";

class PaymentService {
  static base_url = "http://localhost:8080/user/payment"; // Adjust the base URL as needed

  static getToken() {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("Retrieved Token:", token); // Log the token to check its value
    return token;
  }

  static async createPayment(paymentData) {
    const token = this.getToken();
    try {
      const response = await axios.post(
        `${PaymentService.base_url}/create_payment`,
        paymentData, // Send paymentData as request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Ensure content type is set
          },
        }
      );
      return response.data; // Return the payment response
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while creating the payment.";
      console.error("Error creating payment:", errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default PaymentService;
