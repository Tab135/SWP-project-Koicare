import axios from "axios";

class ProductService {
  static base_url = "http://localhost:8080";

  // Fetch all products using GET request
  static async getAllProducts() {
    try {
      const response = await axios.get(
        `${ProductService.base_url}/public/product`
      );
      console.log("API response:", response.data); // Log the entire response data

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        return response.data;
      }
      // If it's an object with a 'products' property that is an array
      else if (response.data && Array.isArray(response.data.products)) {
        return response.data.products;
      }
      // If it's an object with a different property that contains the array
      else if (response.data && typeof response.data === "object") {
        // Find the first property that is an array
        const productsArray = Object.values(response.data).find(Array.isArray);
        if (productsArray) {
          return productsArray;
        }
      }

      // If we couldn't find an array, log an error and return an empty array
      console.error("Unexpected data structure received:", response.data);
      return [];
    } catch (err) {
      console.error("Error fetching products", err);
      throw err;
    }
  }

  static async addProduct(productData, imageFiles = []) {
    const formData = new FormData();

    // Append product data to formData
    for (const key in productData) {
      formData.append(key, productData[key]);
    }

    // Append images to formData
    if (Array.isArray(imageFiles) && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("productImage", file);
      });
    } else {
      console.error("imageFiles is not an array or is empty.");
    }

    // Log FormData entries for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const token = localStorage.getItem("token"); // Ensure you get the correct token
      const response = await axios.post(
        `${ProductService.base_url}/shop/addPro`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error adding product: ",
        error.response ? error.response.data : error
      );
      throw error;
    }
  }
}

export default ProductService;
