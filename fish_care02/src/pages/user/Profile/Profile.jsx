import React, { useEffect, useState } from "react";
import "./profile.css";
import UserService from "./UserService";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { FaEnvelope, FaUser, FaPencilAlt } from "react-icons/fa";

function Profile() {
  const [profileInfo, setProfileInfo] = useState({});
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

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
      setProfileInfo(response.users);
      setUserId(response.users.id);
    } catch (err) {
      console.log("Error fetching profile information: ", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="profile-card shadow">
            <Card.Header className="bg-primary text-white text-center py-4">
              <h2>{profileInfo.name}</h2>
              <p className="mb-0">
                <FaUser className="me-2" />
                {profileInfo.username}
              </p>
            </Card.Header>
            <Card.Body>
              <h4 className="mb-3">Contact Information</h4>
              <p>
                <FaEnvelope className="me-2" />
                {profileInfo.email}
              </p>
              <div className="text-center mt-4">
                <Link
                  to={`/adminusershop/update/${userId}`}
                  className="btn btn-primary"
                >
                  <FaPencilAlt className="me-2" />
                  Update Profile
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
