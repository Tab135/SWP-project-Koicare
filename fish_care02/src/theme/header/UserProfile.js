import React, { memo, useState, useEffect } from "react";
import { ROUTERS } from "../../utis/router";
import { Outlet, Link, NavLink } from "react-router-dom";
import "./header.scss";
import DropdownMenu from "./DropdownMenu";

const UserProfile = ({ setUserId, userId }) => {
    useEffect(() => {
      const token = localStorage.getItem("token");
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
      } else if (token) {
        fetchUserDetails(token);
      }
    }, [setUserId]);
  
  
    const fetchUserDetails = async (token) => {
      try {
        const response = await fetch(
          "http://localhost:8080/adminusershop/get-profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (response.ok) {
          const userData = await response.json();
          const userName = userData.users.name;
          setUserId(userName);
          localStorage.setItem("userId", userName);
        } else {
          console.error("Failed to fetch user details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
  
    return (
      <div className="header_login">
        {userId ? (
          <DropdownMenu userId={userId} />
        ) : (
          <Link to={ROUTERS.USER.LOGIN} className="btn btn-dark btn-custom">
            Login
          </Link>
        )}
      </div>
    );
  };
  export default UserProfile;