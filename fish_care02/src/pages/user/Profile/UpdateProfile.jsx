import React, { useState, useEffect } from "react";
import UserService from "./UserService";
import { useParams, useNavigate } from "react-router-dom";
import "./update_profile.css";
import { ROUTERS } from "../../../utis/router";

function UpdateProfile() {
  const { id } = useParams(); // Get the user ID from the URL
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
      const response = await UserService.getYourProfile(token); // Fetch the user's profile data
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
      const response = await UserService.updateUser(id, profileInfo, token); // Update the user's profile

      // Handle successful response
      if (response) {
        alert("Profile updated successfully!");
        navigate(ROUTERS.USER.Profile); // Ensure you replace the placeholder `:userId` correctly
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
