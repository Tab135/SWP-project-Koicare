import React, { useState } from "react";
import { Form, Button, Container, Alert, Spinner } from "react-bootstrap";
import ProductService from "../../ShopService";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: "",
    price: 0,
    description: "",
    categoryId: "",
    stockQuantity: 0,
    amount: 0,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFiles([...e.target.files]); // e.target.files is a FileList, converting it to an array
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append product data to formData
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    // Append images to formData
    imageFiles.forEach((file) => formData.append("productImage", file)); // Use "productImage" as the key

    try {
      await ProductService.addProduct(formData); // Pass formData directly
      alert("Product added successfully!");
    } catch (error) {
      alert("Failed to add product: " + error.message);
    }
  };

  return (
    <Container className="mt-5">
      <h1>Add New Product</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      <Form onSubmit={handleSubmit}>
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

        <Form.Group className="mb-3">
          <Form.Label>Category ID</Form.Label>
          <Form.Control
            type="number"
            name="categoryId"
            placeholder="Enter category ID"
            value={productData.categoryId}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Stock Quantity</Form.Label>
          <Form.Control
            type="number"
            name="stockQuantity"
            placeholder="Enter stock quantity"
            value={productData.stockQuantity}
            onChange={handleInputChange}
          />
        </Form.Group>

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

        <Form.Group className="mb-3">
          <Form.Label>Product Images</Form.Label>
          <Form.Control
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <Spinner as="span" animation="border" size="sm" />
          ) : (
            "Add Product"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default AddProduct;
