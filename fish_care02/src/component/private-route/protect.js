
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  const checkToken = async () => {
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      console.log("No token found, redirecting to login...");
      setIsAuthenticated(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      console.log("Token has expired, attempting to refresh...");

          await refreshToken();
    } else {
      await validateToken(token);
    }
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
            const refreshResponse = await axios.post('http://localhost:8080/auth/refresh-token', {
          token: refreshToken,
        });

             if (refreshResponse.data.token) {
          localStorage.setItem('token', refreshResponse.data.token);
          console.log("Token refreshed successfully.");
          setIsAuthenticated(true);
        } else {
          console.log("Refresh token was not valid or returned no new token.");
          setIsAuthenticated(false);
        }
      } catch (error) {
               console.error("Error refreshing token: ", error.response ? error.response.data : error);
        setIsAuthenticated(false);
      }
    } else {
      console.log("No refresh token found, redirecting to login...");
      setIsAuthenticated(false);
    }
  };

  const validateToken = async (token) => {
    try {
      const response = await axios.post(
        'http://localhost:8080/auth/check-token-expired',
        { token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from check-token-expired: ", response.data);
      setIsAuthenticated(!response.data);
    } catch (error) {
      console.error("Error checking token: ", error.response ? error.response.data : error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    // Check token immediately when component mounts
    checkToken();

    // check token every 10 minutes
    const intervalId = setInterval(checkToken, 10 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

   useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  
  // Render the protected content immediately
  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;