import React from "react";
import "./profile.css";

const Profile = () => {
  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          
          <h2>John Doe</h2>
          <p className="profile-username">@johndoe</p>
        </div>
        <div className="profile-info">
          <h3>About Me</h3>
          <p>
            Hi! I'm John, a software engineer with a passion for web development
            and artificial intelligence. I love building applications that make
            people's lives easier.
          </p>
          <h3>Contact</h3>
          <ul className="contact-info">
            <li>Email: johndoe@example.com</li>
            <li>Phone: +123-456-7890</li>
          </ul>
          <h3>Social Links</h3>
          <ul className="social-links">
            <li>
              <a href="#">Twitter</a>
            </li>
            <li>
              <a href="#">LinkedIn</a>
            </li>
            <li>
              <a href="#">GitHub</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
