import axios from "axios";

class CategoryService {
  static API_URL = "http://localhost:8080";

  static getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  static async addCategory(categoryData) {
    const token = this.getToken(); // Make sure token is fetched correctly
    try {
      const response = await axios.post(
        `${CategoryService.API_URL}/shop/addCate`, // Ensure the endpoint is correct
        categoryData, // Pass the category data here
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        }
      );
      return response.data; // Ensure data is returned
    } catch (error) {
      console.error("Error adding category:", error);
      throw new Error("An error occurred while adding the category.");
    }
  }
  static async updateCategory(cateId, categoryData) {
    const token = this.getToken();
    const response = await axios.put(
      `${this.API_URL}/shop/updateCate/${cateId}`,
      categoryData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }

  static async getAllCategory() {
    const token = this.getToken();
    try {
      // Make the API request with the Bearer token in the Authorization header
      const response = await axios.get(
        `${CategoryService.API_URL}/shop/category`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("API response:", response.data); // Debugging: Log the full API response

      // Since the API directly returns an array of categories, check if the data is an array
      if (Array.isArray(response.data)) {
        return response.data; // Return the list of categories
      } else {
        console.warn("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      // Enhanced error logging
      console.error(
        "Error fetching categories:",
        error.response ? error.response.data : error.message
      );
      throw error; // Rethrow for further handling
    }
  }
  static async deleteCategory(cateId) {
    const token = this.getToken();
    try {
      const response = await axios.delete(
        `${CategoryService.API_URL}/shop/deleteCate/${cateId}`, // Use axios.delete instead
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Return the response data (e.g., success message)
    } catch (error) {
      console.error("Error deleting category:", error);
      throw new Error("An error occurred while deleting the category.");
    }
  }
}

export default CategoryService;
