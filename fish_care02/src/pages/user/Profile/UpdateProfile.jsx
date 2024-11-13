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
  Modal,
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

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

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
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

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    try {
      let token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await UserService.changePassword(
          passwords.currentPassword,
          passwords.newPassword,
          token
      );

      if (response.statusCode === 200) {
        alert("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswords({ currentPassword: "", newPassword: "" });
      } else {
        setError("Current password is incorrect. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while changing the password. Please try again.");
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
      setShowPasswordModal(false);
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
              <div className="d-grid mt-3">
                <Button variant="secondary" onClick={() => setShowPasswordModal(true)}>
                  Change Password
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} backdrop={false}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                  type="password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleChangePassword} disabled={passwordLoading}>
            {passwordLoading ? "Changing..." : "Change Password"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default UpdateProfile;
