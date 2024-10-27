import axios from "axios";
class OrderService {
  static base_url = "http://localhost:8080/user";
  static API = "http://localhost:8080/shop";
  static buildEndpoint(endpoint) {
    return `${this.API}${endpoint}`;
  }

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
  static async getOrderByStatus() {
    const token = this.getToken();
    try {
      const response = await axios.get(
        `http://localhost:8080/shop/order/listStatus`, // Adjust the endpoint as necessary
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

  static async updateOrderStatus(orderId, newStatus) {
    const token = this.getToken();
    try {
      const response = await axios.put(
        `http://localhost:8080/shop/order/updateStatus/${orderId}`,
        newStatus, // Should be a string if OrderStatus is an enum
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update order status:", error);
      throw error;
    }
  }
  static async getTotalRevenue() {
    const token = this.getToken();
    try {
      const response = await axios.get(`http://localhost:8080/shop/total`, {
        headers: {
          Authorization: `Bearer ${token}`, // Corrected string interpolation
          "Content-Type": "application/json",
        },
      });
      return response.data; // Return the total revenue data
    } catch (err) {
      console.error("Error listing revenue:", err);
      throw new Error("An error occurred while listing the revenue.");
    }
  }
}
export default OrderService;
