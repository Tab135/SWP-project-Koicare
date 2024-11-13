import axios from "axios";
class UserService {
  static BASE_URL = "http://170.64.198.85:8080";
  static async getYourProfile(token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/adminusershop/get-profile`,
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
        `${UserService.BASE_URL}/adminusershop/update/${userId}`, // Ensure BASE_URL is correct
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
  static async changePassword(currentPassword, newPassword, token) {
    if (!currentPassword || !newPassword || !token) {
      throw new Error("Missing current password, new password, or authentication token");
    }

    try {
      const response = await axios.post(
          `${UserService.BASE_URL}/adminusershop/changepassword/${currentPassword}/${newPassword}`,
          {},
          {
            headers: {Authorization: `Bearer ${token}`},
          }
      );
      return response.data;
    } catch (err) {
      console.error("Error changing password:", err.response ? err.response.data : err.message);
      throw err;
    }
  }
}
export default UserService;
