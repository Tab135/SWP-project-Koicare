import React, { memo, useState, useEffect } from "react";
import { ROUTERS } from "../../utis/router";
import { Outlet, Link } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/image/logo.jpg";
import { getUsernameFromToken } from "../../utis/gettoken";

const UserProfile = ({ setUserId, userId }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUserId(getUsernameFromToken(token)); 
      fetchUserDetails(token); 
    }
  }, [setUserId]);

  const fetchUserDetails = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/adminuser/get-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserId(userData.users.name); // Assuming `name` is the field for the user's name
      } else {
        console.error("Failed to fetch user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="header_login">
      {userId ? <DropdownMenu userId={userId} /> : <Link to={ROUTERS.USER.LOGIN}>Login</Link>}
    </div>
  );
};

const DropdownMenu = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <button className="dropdown-btn" onClick={toggleDropdown}>
        {userId}
        <span className="arrow-down">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="dropdown-content">
          <Link to={ROUTERS.USER.Profile}>Profile</Link>
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Reload the page after logout
  };

  return (
    <div>
      <Link to={ROUTERS.USER.LOGIN} onClick={handleLogout}>
        Logout
      </Link>
    </div>
  );
};

const Header = () => {
  const [userId, setUserId] = useState(null);

  const menus = [
    {
      name: "Koicare",
      path: ROUTERS.USER.KOICARE,
    },
    {
      name: "Shop",
      path: ROUTERS.USER.SHOP,
    },
    {
      name: "Blog",
      path: ROUTERS.USER.BLOG,
    },
    {
      name: "Contact",
      path: ROUTERS.USER.CONTACT,
    },
  ];

  return (
    <div className="header">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-3">
            <div className="header_logo">
              <Link to={ROUTERS.USER.HOME}>
                <img src={logo} alt="Logo" />
              </Link>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="header_menu">
              <ul>
                {menus.map((menu, menukey) => (
                  <li key={menukey}>
                    <Link to={menu.path} className="menu">
                      {menu.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3">
            <UserProfile setUserId={setUserId} userId={userId} />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default memo(Header);
