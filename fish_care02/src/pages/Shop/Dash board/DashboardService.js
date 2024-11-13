import axios from "axios";

class DashBoardService {
  static API_URL = "http://170.64.198.85:8080";

  static getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  static async getAllBlogs() {
    const token = this.getToken();
    try {
      const response = await axios.get(
        `${DashBoardService.API_URL}/shop/blog`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Log the entire response
      console.log("API response:", response.data);

      // Check if response is in expected format (an object with `blogList`)
      if (response.data && Array.isArray(response.data.blogList)) {
        return response.data.blogList; // Return the blog list array
      } else {
        console.warn("Unexpected response format:", response.data);
        return []; // Return an empty array if format is unexpected
      }
    } catch (error) {
      console.error(
        "Error fetching blogs:",
        error.response ? error.response.data : error.message
      );
      throw error; // Rethrow for further handling
    }
  }

  static async getAllNews() {
    const token = this.getToken();
    try {
      const response = await axios.get(
        `${DashBoardService.API_URL}/shop/news`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Log the entire response
      console.log("API response:", response.data);

      // Check if response contains `newsList`
      if (response.data && Array.isArray(response.data.newsList)) {
        return response.data.newsList; // Return the news list array
      } else {
        console.warn("Unexpected response format for news:", response.data);
        return []; // Return an empty array if format is unexpected
      }
    } catch (error) {
      console.error(
        "Error fetching news:",
        error.response ? error.response.data : error.message
      );
      throw error; // Rethrow for further handling
    }
  }

  static async deleteBlog(blogId) {
    const token = this.getToken();
    try {
      const response = await axios.delete(
        `${DashBoardService.API_URL}/shop/blog/${blogId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error deleting blogs:", err);
      throw new Error("An error occurred while deleting the blogs.");
    }
  }
  static async deleteNews(newsId) {
    const token = this.getToken();
    try {
      const response = await axios.delete(
        `${DashBoardService.API_URL}/shop/news/${newsId}/delete`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error deleting news item:", err);
      throw new Error("An error occurred while deleting the news item.");
    }
  }
}

export default DashBoardService;
