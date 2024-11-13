import React, { memo } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./footer.css";
import logo from "../../assets/image/logo.jpg";

const Footer = () => {
  return (
    <footer className="footer crystal-bg py-5">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <div className="footer-logo">
              <Image
                src={logo}
                alt="Koi Care Logo"
                fluid
                className="mb-3 rounded-circle"
                style={{ maxWidth: "100px" }}
              />
              <h4 className="text-white fw-bold">Koi Care</h4>
            </div>
          </Col>
          <Col lg={4} md={6}>
            <h5 className="text-uppercase mb-4 fw-bold">About Us</h5>
            <p className="mb-0">
              Koi Care is dedicated to providing the best care and products for
              your koi fish. With years of experience, we ensure the health and
              beauty of your pond.
            </p>
          </Col>
          <Col lg={4} md={6}>
            <h5 className="text-uppercase mb-4 fw-bold">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/" className="text-white-50 hover-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/public/product" className="text-white-50 hover-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/public/blog/list" className="text-white-50 hover-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/koicare/aboutus" className="text-white-50 hover-white">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>
         
        </Row>
        
      </Container>
    </footer>
  );
};

export default memo(Footer);
