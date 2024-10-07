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
          <Col lg={3} md={6}>
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
          <Col lg={3} md={6}>
            <h5 className="text-uppercase mb-4 fw-bold">About Us</h5>
            <p className="mb-0">
              Koi Care is dedicated to providing the best care and products for
              your koi fish. With years of experience, we ensure the health and
              beauty of your pond.
            </p>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="text-uppercase mb-4 fw-bold">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/" className="text-white-50 hover-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-white-50 hover-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white-50 hover-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white-50 hover-white">
                  Contact
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="text-uppercase mb-4 fw-bold">Contact Us</h5>
            <ul className="list-unstyled footer-contact">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2" /> 123 Koi Street, Pond City,
                12345
              </li>
              <li className="mb-2">
                <FaPhone className="me-2" /> (123) 456-7890
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2" /> info@koicare.com
              </li>
            </ul>
            <div className="mt-4 social-icons">
              <a href="#!" className="text-white me-3 hover-scale">
                <FaFacebook size={24} />
              </a>
              <a href="#!" className="text-white me-3 hover-scale">
                <FaTwitter size={24} />
              </a>
              <a href="#!" className="text-white hover-scale">
                <FaInstagram size={24} />
              </a>
            </div>
          </Col>
        </Row>
        <hr className="my-4 bg-white" />
        <Row>
          <Col className="text-center">
            <p className="mb-0 text-white-50">
              &copy; {new Date().getFullYear()} Koi Care. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default memo(Footer);
