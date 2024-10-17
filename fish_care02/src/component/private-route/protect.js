
import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkToken = async () => {
    let token = localStorage.getItem('token');
    if (!token) {
        token = sessionStorage.getItem('token');
    }
    console.log(token);
    if (!token) {
      console.log("No token found, redirecting to login...");
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      console.log("Token has expired, attempting to refresh...");

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
    } else {
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
        if (response.data === true) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking token: ", error.response ? error.response.data : error);
        setIsAuthenticated(false);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Outlet />; 
  }

  return null; 
};

export default ProtectedRoute;

