import axios from "axios";
class OrderService {
  static base_url = "http://localhost:8080/user";
  static getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }
  static async createOrder() {
    const token = this.getToken();
    try {
      const response = await axios.post(
        `${OrderService.base_url}/order`, // Ensure this is the correct endpoint
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the order data
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while creating the order.";
      console.error("Error creating order:", errorMessage);
      throw new Error(errorMessage);
    }
  }
  static async getOrderById(orderId) {
    const token = this.getToken();
    try {
      const response = await axios.get(
        `${OrderService.base_url}/order/getOrder/${orderId}`, // Adjust the endpoint as necessary
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the order details
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while fetching the order details.";
      console.error("Error fetching order:", errorMessage);
      throw new Error(errorMessage);
    }
  }
}
export default OrderService;
