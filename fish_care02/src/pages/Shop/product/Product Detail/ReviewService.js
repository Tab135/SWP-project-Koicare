import axios from "axios";

class ReviewService {
  static base_url = "http://localhost:8080"; // Assuming this is your base API URL

  // Helper function to get token from local or session storage
  static getToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  }

  // Method to post a review
  static async postReview(productId, reviewData) {
    const token = this.getToken();
    try {
      const response = await axios.post(
        `${this.base_url}/user/review/${productId}`, // Correct endpoint for posting reviews
        reviewData, // Send review data (rating, comment)
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token for authorization
          },
        }
      );
      return response.data; // Return the posted review data
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while submitting the review.";
      console.error("Error submitting review:", errorMessage);
      throw new Error(errorMessage);
    }
  }
  static async getReviewsByProductId(productId) {
    const token = this.getToken();
    try {
      const response = await axios.get(
        `${this.base_url}/public/review/listReview/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // Return the list of reviews
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        "An error occurred while fetching reviews.";
      console.error("Error fetching reviews:", errorMessage);
      throw new Error(errorMessage);
    }
  }
}

export default ReviewService;
