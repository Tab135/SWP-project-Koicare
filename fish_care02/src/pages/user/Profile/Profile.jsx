import React, { useEffect, useState } from "react";
import "./profile.css";
import UserService from "./UserService";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utis/router";

function Profile() {
  const [profileInfo, setProfileInfo] = useState({});

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getYourProfile(token);
      setProfileInfo(response.users);
    } catch (err) {
      console.log("Error fetching profile information: ", err);
    }
  };

  // Check if profileInfo is loaded
  if (!profileInfo.name) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>{profileInfo.name}</h2>
          <p className="profile-username">{profileInfo.username}</p>
        </div>
        <div className="profile-info">
          <h3>About Me</h3>
          <p>
            Hi! I'm {profileInfo.name}, a software engineer with a passion for web development
            and artificial intelligence. I love building applications that make
            people's lives easier.
          </p>
          <h3>Contact</h3>
          <ul className="contact-info">
            <li>Email: {profileInfo.email}</li>
          </ul>
          <button>
            <Link to={ROUTERS.USER.UpdateProfile}>Update This Profile</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
