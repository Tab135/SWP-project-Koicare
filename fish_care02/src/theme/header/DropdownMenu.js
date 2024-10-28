import { ROUTERS } from "../../utis/router";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { FaUser, FaSignOutAlt, FaHistory } from "react-icons/fa";
import "./header.scss";
import {jwtDecode} from 'jwt-decode';
import React, { useEffect, useState } from 'react';
const DropdownMenu = ({ userId }) => {
  const [role, setRole]= useState(null)
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
    }
  }, []);
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
        <Dropdown.Item as={Link} to={ROUTERS.USER.History}>
          <FaHistory className="me-2" /> Order History
        </Dropdown.Item>
        {role === 'ADMIN' && (
              <Dropdown.Item as={Link} to={ROUTERS.ADMIN.DASHBOARD}>
              DashBoard
            </Dropdown.Item>
        )}
        {role === 'SHOP' && (
              <Dropdown.Item as={Link} to={ROUTERS.USER.ShopDashboard}>
              DashBoard
            </Dropdown.Item>
        )}
        <Dropdown.Divider />
        <LogoutButton />
      </Dropdown.Menu>
    </Dropdown>
  );
};

const LogoutButton = () => {
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
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

export default DropdownMenu;
