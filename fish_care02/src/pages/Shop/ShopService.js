import axios from "axios";

class ProductService {
  static base_url = "http://170.64.198.85:8080";
  static async getAllCategory() {
    try {
      const response = await axios.get(
        `${ProductService.base_url}/public/category`
      );
      console.log("API response:", response.data); // Log API response for debugging

      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && Array.isArray(response.data.categories)) {
        return response.data.categories;
      } else {
        console.warn("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response ? error.response.data : error
      );
      throw error; // Rethrow the error for further handling
    }
  }
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

    // Append product data
    Object.keys(productData).forEach((key) => {
      if (productData[key] !== null && productData[key] !== undefined) {
        formData.append(key, productData[key]);
      }
    });

    // Append images
    if (Array.isArray(imageFiles)) {
      imageFiles.forEach((file) => {
        formData.append("productImage", file);
      });
    }

    // Log FormData for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }
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
        "Error adding product:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  }

  static async deleteProduct(productId) {
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }
      const response = await axios.delete(
        `${ProductService.base_url}/shop/deletePro/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  }
  static async getProductById(productId) {
    if (!productId) {
      console.error("Invalid productId provided");
      return;
    }
    try {
      const response = await axios.get(
        `${ProductService.base_url}/public/product/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching product details:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  }
  static async ProById(productId) {
    if (!productId) {
      console.error("Invalid productId provided");
      return;
    }
    productId = productId.trim();
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }
      const response = await axios.get(
        `${ProductService.base_url}/shop/product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching product details:",
        error.response ? error.response.data : error
      );
      throw error;
    }
  }

  static async getProductsByCategoryId(categoryId) {
    if (!categoryId) {
      console.error("Invalid categoryId provided");
      return;
    }
    try {
      const response = await axios.get(
        `${ProductService.base_url}/public/product/search/${categoryId}`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by category ID:", error);
      throw error;
    }
  }
  // In ProductService.js
  static async updateProduct(productId, formData) {
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        token = sessionStorage.getItem("token");
      }
      const response = await axios.put(
        `${ProductService.base_url}/shop/updatePro/${productId}`,
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
      console.error("Error updating product:", error);
      throw error;
    }
  }
}

export default ProductService;
