import axios from "axios";

class HistoryOrder {
  static base_url = "http://170.64.198.85:8080/user";

  // Retrieve the token from localStorage or sessionStorage
  static getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  // Fetch order history for the user
  static async getOrderByUser() {
    const token = this.getToken();
    try {
      const response = await axios.get(
        `${HistoryOrder.base_url}/track/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Return the order history data
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "An error occurred while fetching the order details.";
      console.error("Error fetching order:", errorMessage);
      throw new Error(errorMessage); // Throw the error for further handling
    }
  }

  static async getOrderDetail(orderId) {
    const token = this.getToken();
    try {
      const response = await axios.get(
        `${HistoryOrder.base_url}/detail/${orderId}`, // Adjust the URL as per your API
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Return the specific order data
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "An error occurred while fetching the order detail.";
      console.error("Error fetching order detail:", errorMessage);
      throw new Error(errorMessage); // Throw the error for further handling
    }
  }
}

export default HistoryOrder;
