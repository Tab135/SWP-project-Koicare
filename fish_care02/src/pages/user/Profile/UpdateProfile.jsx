import React, { useState, useEffect } from "react";
import UserService from "./UserService";
import { useParams, useNavigate } from "react-router-dom";
import "./update_profile.css";
import { ROUTERS } from "../../../utis/router";
import { jwtDecode } from 'jwt-decode';
function UpdateProfile() {
  const { userId } = useParams(); 
  console.log(userId);
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getYourProfile(token); 
      const decodedToken = jwtDecode(token);
      console.log("Thông tin trong token:", decodedToken);
      if (response && response.users) {
        setProfileInfo({
          name: response.users.name,
          email: response.users.email,
        });
      }

    } catch (error) {
      console.error("Error fetching profile information:", error);  
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token); 
      const response = await UserService.updateUser(userId, profileInfo, token); 
      if (response) {
        alert("Profile updated successfully!");
        navigate(ROUTERS.USER.Profile); 
      } else {
        console.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="update-profile-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={profileInfo.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={profileInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="update-button">Update Profile</button>
      </form>
    </div>
  );
}

export default UpdateProfile;
