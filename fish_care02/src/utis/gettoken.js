import { jwtDecode } from 'jwt-decode';


export const getUsernameFromToken = (token) => {
    if (!token) return null;
  
    try {
      const decodedToken = jwtDecode(token);
      console.log("Thông tin trong token:", decodedToken);
      return decodedToken.email;
    } catch (error) {
      console.error("Token is invalid:", error);
      return null;
    }
  };