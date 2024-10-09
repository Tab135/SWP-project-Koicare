import React, { memo, useState, useEffect } from "react";
import { ROUTERS } from "../../utis/router";
import { Outlet, Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
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
        setUserId(userData.users.name);
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

const DropdownMenu = ({ userId }) => {
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="primary"
        id="dropdown-basic"
        className="user-dropdown"
      >
        <FaUser className="me-2" /> {userId}
      </Dropdown.Toggle>

      <Dropdown.Menu className="user-dropdown-menu">
        <Dropdown.Item as={Link} to={ROUTERS.USER.Profile}>
          Profile
        </Dropdown.Item>
        <Dropdown.Divider />
        <LogoutButton />
      </Dropdown.Menu>
    </Dropdown>
  );
};

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Dropdown.Item
      as={Link}
      to={ROUTERS.USER.LOGIN}
      onClick={handleLogout}
      className="logout-item"
    >
      <FaSignOutAlt className="me-2" /> Logout
    </Dropdown.Item>
  );
};

const Header = () => {
  const [userId, setUserId] = useState(null);

  const menus = [
    { name: "Koicare", path: ROUTERS.USER.KOICARE },
    { name: "Shop", path: ROUTERS.USER.Shop },
    { name: "Blog", path: ROUTERS.USER.BLOG },
    { name: "Contact", path: ROUTERS.USER.CONTACT },
  ];

  return (
    <Navbar expand="lg" className="header crystal-bg">
      <Container>
        <Navbar.Brand as={Link} to={ROUTERS.USER.HOME} className="header_logo">
          <img src={logo} alt="Logo" className="rounded-circle" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-center"
        >
          <Nav className="header_menu w-100">
            {menus.map((menu, menukey) => (
              <Nav.Link
                key={menukey}
                as={NavLink}
                to={menu.path}
                className="menu"
              >
                {menu.name}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
        <UserProfile setUserId={setUserId} userId={userId} />
      </Container>
      <Outlet />
    </Navbar>
  );
};

export default memo(Header);
