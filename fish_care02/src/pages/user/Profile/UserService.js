import axios from "axios";
class UserService {
  static BASE_URL = "http://localhost:8080";
  static async getYourProfile(token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/adminuser/get-profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
  static async updateUser(userId, userData, token) {
    if (!userId || !token) {
      throw new Error("Missing user ID or authentication token");
    }
  
    try {
      const response = await axios.put(
        `${UserService.BASE_URL}/adminuser/update/${userId}`, // Ensure BASE_URL is correct
        userData,
        {
          headers: { Authorization: `Bearer ${token}` }, // Include token in headers
        }
      );
      
      return response.data; // Return the response data
    } catch (err) {
      console.error("Error updating user:", err.response ? err.response.data : err.message); // Better error handling
      throw err; // Rethrow the error to handle it in the calling function
    }
  }
}
export default UserService;
