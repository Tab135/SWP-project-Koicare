import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import ProductService from "../../ShopService";
import { FaUpload } from "react-icons/fa";
import "./addProduct.css"; // We'll create this file for custom styles
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    amount: "",
    createAt: "", // New field
    expiresAt: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      if (role !== "SHOP") {
        navigate("/koicare");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
  useEffect(() => {
    ProductService.getAllCategory()
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]); // Set to an empty array if no data
        }
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
        setCategories([]); // Set to empty array on error
      });
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Ensure price and amount are not set below 1
    if ((name === "price" || name === "amount") && value < 1) {
      setProductData({
        ...productData,
        [name]: 1, // Reset to 1 if the value is less than 1
      });
      return;
    }

    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (imageFiles.length === 0) {
      setError("Please select at least one image");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });
    imageFiles.forEach((file) => formData.append("productImage", file));

    try {
      await ProductService.addProduct(productData, imageFiles);
      setMessage("Product added successfully!");
      setProductData({
        name: "",
        price: 0,
        description: "",
        categoryId: "",
        amount: 0,
        createAt: "",
        expiresAt: "",
      });
      setImageFiles([]);
      navigate("/shop/dashboard");
    } catch (error) {
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 add-product-container">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Add New Product</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={productData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    value={productData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                placeholder="Enter description"
                value={productData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Form.Check
                        type="radio"
                        id={`category-${category.categoryId}`} // Unique ID for each radio button
                        key={category.categoryId}
                        name="categoryId" // Same name for grouping
                        label={category.categoryName}
                        value={category.categoryId.toString()} // Ensure categoryId is a string
                        checked={
                          productData.categoryId ===
                          category.categoryId.toString()
                        } // Ensure proper comparison
                        onChange={handleInputChange} // Handle change event
                      />
                    ))
                  ) : (
                    <p>No categories available.</p> // Display message if no categories are loaded
                  )}
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={productData.amount}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Creation Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="createAt"
                    value={productData.createAt}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiration Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="expiresAt"
                    value={productData.expiresAt}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label>Product Images</Form.Label>
              <div className="custom-file-upload">
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="btn btn-outline-primary w-100"
                >
                  <FaUpload className="me-2" />
                  Choose Images
                </label>
              </div>
              {imageFiles.length > 0 && (
                <small className="text-muted">
                  {imageFiles.length} file(s) selected
                </small>
              )}
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" /> Adding
                    Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;
