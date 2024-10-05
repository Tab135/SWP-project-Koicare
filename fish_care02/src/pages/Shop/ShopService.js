import axios from "axios";

class ProductService {
  static base_url = "http://localhost:8080";

  // Fetch all products using GET request
  static async getAllProducts() {
    try {
      const response = await axios.get(
        `${ProductService.base_url}/public/product`
      );
      return response.data; // Ensure response.data is the correct array structure
    } catch (err) {
      console.error("Error fetching products", err);
      throw err;
    }
  }
  
}

export default ProductService;
