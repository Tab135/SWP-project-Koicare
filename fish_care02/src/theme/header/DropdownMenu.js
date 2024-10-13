import React, { memo, useState, useEffect } from "react";
import { ROUTERS } from "../../utis/router";
import { Outlet, Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./header.scss";

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
  
export default DropdownMenu;  