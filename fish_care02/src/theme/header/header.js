import { memo, useState } from "react";
import { ROUTERS } from "../../utis/router";
import { Outlet, Link } from "react-router-dom";
import "./header.scss";
import logo from "../../assets/image/logo.jpg";
import React, { useEffect } from "react";
import { getUsernameFromToken } from "../../utis/gettoken";

const Header = () => {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const UserProfile = () => {
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        setUserId(getUsernameFromToken(token)); // Assuming `getUsernameFromToken` sets the `userId`
        fetchUserDetails(); // Fetch user details using the token
      }
    }, []);

    return (
      <div className="header_login">
        {userId ? <DropdownMenu /> : <Link to={ROUTERS.USER.LOGIN}>Login</Link>}
      </div>
    );
  };
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/adminuser/get-profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUsername(userData.name); // Assuming `name` is the field for the user's name in the response
      } else {
        console.error("Failed to fetch user details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const DropdownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle the dropdown menu's visibility
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className="dropdown">
        <button className="dropdown-btn" onClick={toggleDropdown}>
          {username}
          <span className="arrow-down">{isOpen ? "▲" : "▼"}</span>
        </button>

        {isOpen && (
          <div className="dropdown-content">
            <Link to={ROUTERS.USER.Profile}>Profile</Link>
            <a href="#settings">Settings</a>
            <LogoutButton />
          </div>
        )}
      </div>
    );
  };
  const LogoutButton = ({ username }) => {
    const handleLogout = () => {
      localStorage.removeItem("token");
      setUserId(null);
    };

    return (
      <div>
        <Link to={ROUTERS.USER.LOGIN} onClick={handleLogout}>
          Logout
        </Link>
      </div>
    );
  };
  const [menus, setmenu] = useState([
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
  ]);
  return (
    <div className="header">
      <div className="container">
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-3">
            <div className="header_logo">
            <Link to={ROUTERS.USER.HOME} ><img src={(logo)} alt="Logo" /></Link>   
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6">
            <div className="header_menu">
              <ul>
                {menus?.map((menu, menukey) => (
                  <li key={menukey}>
                    <Link to={menu.path} className="menu">
                      {menu?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3">
            {/* <div >{username ? (
                        <h1>Welcome, {username}!</h1>
                            ) : (
                                <Link to={ROUTERS.USER.LOGIN}>Login</Link>
                                )}</div>       */}
            <UserProfile />
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default memo(Header);
