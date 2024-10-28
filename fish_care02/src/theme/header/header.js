import React, { memo, useState, useEffect } from "react";
import { ROUTERS } from "../../utis/router";
import { Outlet, Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import "./header.scss";
import logo from "../../assets/image/logo.jpg";
import UserProfile from "./UserProfile"
const Header = () => {
  const [userId, setUserId] = useState(null);

  const menus = [
    { name: "Koicare", path: ROUTERS.USER.KOICARE },
    { name: "Shop", path: ROUTERS.USER.Shop },
    { name: "Blog", path: ROUTERS.USER.LIST_BLOGS },
    { name: "News", path: ROUTERS.USER.ListNews },
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
