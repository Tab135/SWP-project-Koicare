import React, { useState, useEffect } from "react";
import UserService from "./UserService";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { ROUTERS } from "../../../utis/router";
import { jwtDecode } from "jwt-decode";
import "./update_profile.css";

function UpdateProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileInfo();
  }, []);

  const fetchProfileInfo = async () => {
    try {
      let token = localStorage.getItem('token');
      if (!token) {
          token = sessionStorage.getItem('token');
      }
      const response = await UserService.getYourProfile(token);
      const decodedToken = jwtDecode(token);
      console.log("Token information:", decodedToken);
      if (response && response.users) {
        setProfileInfo({
          name: response.users.name,
          email: response.users.email,
        });
      }
    } catch (error) {
      console.error("Error fetching profile information:", error);
      setError("Failed to load profile information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileInfo({ ...profileInfo, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      let token = localStorage.getItem('token');
      if (!token) {
          token = sessionStorage.getItem('token');
      }
      const response = await UserService.updateUser(userId, profileInfo, token);
      if (response) {
        alert("Profile updated successfully!");
        navigate(ROUTERS.USER.Profile);
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        "An error occurred while updating the profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Alert variant="info">Loading profile information...</Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center mb-4">Update Profile</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={profileInfo.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={profileInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default UpdateProfile;
