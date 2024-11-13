import axios from "axios";
import GuestCartService from "../Guest/GuestCartService";
class CartService {
  static base_url = "http://170.64.198.85:8080/user/cart";
  static async mergeGuestCart() {
    const guestCart = GuestCartService.getGuestCart();
    if (guestCart.length === 0) return;

    try {
      // Add each guest cart item to the user's cart
      for (const item of guestCart) {
        await this.addProductToCart(item.productId, item.quantity);
      }

      // Clear the guest cart after successful merge
      GuestCartService.clearGuestCart();
    } catch (error) {
      console.error("Error merging guest cart:", error);
      throw error;
    }
  }

  static async addProductToCart(productId, quantity) {
    // Ensure productId and quantity are numbers
    if (typeof productId !== "number" || typeof quantity !== "number") {
      throw new Error("Product ID and quantity must be numbers.");
    }
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero.");
    }

    try {
      const token = this.getToken();

      const response = await axios.post(
        `${CartService.base_url}/addCart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API Call:", {
        url: `${CartService.base_url}/addCart/${productId}`,
        data: { quantity },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data; // Return response data
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while adding the product to the cart.";
      console.error("Error adding product to cart:", errorMessage);
      throw new Error(errorMessage); // Rethrow with user-friendly message
    }
  }

  static getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }
  static getCartByUser = async () => {
    const token = this.getToken(); // Make sure token is fetched correctly
    try {
      const response = await axios.get(
        `${CartService.base_url}/getCartByUser`, // Ensure the endpoint is correct
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Ensure data is returned
    } catch (error) {
      console.error("Error fetching cart data:", error);
      throw new Error("An error occurred while fetching the cart.");
    }
  };
  static async updateCart(productId, quantity) {
    try {
      const token = this.getToken();
      const response = await axios.put(
        `${CartService.base_url}/updateCart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while updating the cart item.";
      console.error("Error updating cart item:", errorMessage);
      throw new Error(errorMessage);
    }
  }
  static async removeFromCart(cartItemId) {
    const token = this.getToken();
    try {
      const response = await axios.delete(
        `${CartService.base_url}/deleteCartItem/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response on removeFromCart:", response.data); // Log the response data
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while removing the item from the cart.";
      console.error("Error removing from cart:", errorMessage);
      throw new Error(errorMessage);
    }
  }
  static async getTotalPrice() {
    try {
      const token = this.getToken();
      const response = await axios.get(`${CartService.base_url}/totalPrice`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Total Price:", response.data);
      return response.data; // Return total price data
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while fetching the total price.";
      console.error("Error fetching total price:", errorMessage);
      throw new Error(errorMessage); // Rethrow with user-friendly message
    }
  }
  static async countItem() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("Authorization token not found.");
      }
      const response = await axios.get(`${CartService.base_url}/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Total items in cart:", response.data);
      return response.data; // Return total item count
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while fetching the item count.";
      console.error("Error fetching item count:", errorMessage);
      throw new Error(errorMessage); // Rethrow with user-friendly message
    }
  }
}

export default CartService;
