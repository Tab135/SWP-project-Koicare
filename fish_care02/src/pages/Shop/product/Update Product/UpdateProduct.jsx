import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Spinner, Card } from "react-bootstrap";
import ProductService from "../../ShopService";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./update.scss";
import { FaUpload } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

const UpdateProduct = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    amount: 0,
    categoryId: 0,
  });
  const [currentImage, setCurrentImage] = useState(""); // Holds the URL of the existing image
  const [imageFiles, setImageFiles] = useState([]); // For new image files
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    // Fetch product data by ID to prefill the form
    ProductService.ProById(productId)
      .then((product) => {
        if (product) {
          setProductData({
            name: product.name || "",
            price: product.price || "",
            description: product.description || "",
            amount: product.amount || "",
            categoryId: product.categoryId ? product.categoryId.toString() : "",
          });
          setCurrentImage(product.productImageBase64); // Store the existing image URL
        } else {
          setError("Product not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
        setError("Failed to load product data.");
      });

    // Fetch available categories from API
    ProductService.getAllCategory()
      .then((fetchedCategories) => {
        setCategories(fetchedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories.");
      });
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Convert value to a number for validation
    const numericValue = Number(value);

    // Validate amount and price fields
    if (name === "amount" && (numericValue < 1 || isNaN(numericValue))) {
      setError("Amount must be a positive number greater than 0.");
      return;
    } else if (name === "price" && (numericValue < 1 || isNaN(numericValue))) {
      setError("Price must be a positive number greater than 0.");
      return;
    } else {
      setError(null); // Clear error if input is valid
    }

    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImageFiles([...files]); // Update with new selected images
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    // Append new images or the existing image if no new images were selected
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => formData.append("imageFile", file));
    } else if (currentImage) {
      formData.append("existingImage", currentImage); // Use the current image URL if no new image is selected
    }

    try {
      await ProductService.updateProduct(productId, formData);
      setMessage("Product updated successfully!");
      setImageFiles([]); // Reset image files
      navigate("/shop/dashboard");
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 update-product-container">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Update Product</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 update-product-name">
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

            <Form.Group className="mb-3 update-product-price">
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

            <Form.Group className="mb-3 update-product-description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                placeholder="Enter product description"
                value={productData.description}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 update-product-amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                placeholder="Enter amount"
                value={productData.amount}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 update-product-category">
              <Form.Label>Category</Form.Label>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <Form.Check
                    type="radio"
                    id={`category-${category.categoryId}`}
                    key={category.categoryId}
                    name="categoryId"
                    label={category.categoryName}
                    value={category.categoryId.toString()}
                    checked={
                      productData.categoryId === category.categoryId.toString()
                    } // Check for selected category
                    onChange={handleInputChange}
                  />
                ))
              ) : (
                <p>No categories available.</p>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Product Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                id="file-upload"
                className="d-none"
              />
              <label
                htmlFor="file-upload"
                className="btn btn-outline-primary w-100"
              >
                <FaUpload className="me-2" /> Choose Images
              </label>
              {imageFiles.length > 0 ? (
                <small className="text-muted">
                  {imageFiles.length} file(s) selected
                </small>
              ) : (
                <small className="text-muted">Using existing image</small>
              )}
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" /> Updating
                    Product...
                  </>
                ) : (
                  "Update Product"
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UpdateProduct;
