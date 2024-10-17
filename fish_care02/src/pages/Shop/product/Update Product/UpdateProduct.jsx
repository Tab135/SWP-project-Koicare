import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Spinner, Card } from "react-bootstrap";
import ProductService from "../../ShopService";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
  const { productId } = useParams();

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    description: "",
    amount: "",
    categoryId: "", // Category field (ID)
  });

  const [categories, setCategories] = useState([]); // Available categories
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]); // To hold selected images

  useEffect(() => {
    // Fetch product data by ID to prefill the form
    ProductService.getProductById(productId)
      .then((product) => {
        if (product) {
          setProductData({
            name: product.name || "",
            price: product.price || "",
            stockQuantity: product.stockQuantity || "",
            description: product.description || "",
            amount: product.amount || "",
            categoryId: product.categoryId || "", // Prepopulate categoryId
          });
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
    setProductData({
      ...productData,
      [name]: value, // Ensure this updates categoryId correctly
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImageFiles([...files]); // Update the state with the new files
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

    // Create a new FormData object
    const formData = new FormData();
    // Append the product data to the form data
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    // Append the images to the form data
    imageFiles.forEach((file) => formData.append("imageFile", file));

    try {
      // Call the updateProduct function and pass the formData
      const response = await ProductService.updateProduct(productId, formData);
      setImageFiles([]); // Reset image files after successful update
      setMessage("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 add-product-container">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="text-center mb-4">Update Product</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}

          <Form onSubmit={handleSubmit}>
            {/* Product Name */}
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

            {/* Price */}
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

            {/* Stock Quantity */}
            <Form.Group className="mb-3">
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type="number"
                name="stockQuantity"
                placeholder="Enter stock quantity"
                value={productData.stockQuantity}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
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

            {/* Amount */}
            <Form.Group className="mb-3">
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

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="categoryId"
                value={productData.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Image Upload */}
            <Form.Group className="mb-3">
              <Form.Label>Product Images</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
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
