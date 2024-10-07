import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import ProductService from "./ShopService.js";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Form,
  InputGroup,
  Button,
  Badge,

} from "react-bootstrap";
import { FaShoppingCart, FaSearch,FaPlus } from "react-icons/fa";
import "./shop.css";
import { ROUTERS } from "../../utis/router.js";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await ProductService.getAllProducts();
        setProducts(productData);
        setLoading(false);
      } catch (error) {
        setError("Error fetching products: " + error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    if (searchTerm.trim() === "") {
      return;
    }
    console.log("Searching for:", searchTerm);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container fluid className="shop-container py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="shop-title text-center mb-4">Our Products</h1>
        </Col>
      </Row>
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6} lg={4}>
          <InputGroup className="custom-search-bar">
            <InputGroup.Text className="bg-primary text-white">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
              className="border-primary"
            />
          </InputGroup>
        </Col>
        <Col xs="auto" className="mt-3 mt-md-0">
          <Button
            variant="outline-primary"
            className="rounded-circle p-2 position-relative"
          >
            <FaShoppingCart size={24} />
            <Badge
              bg="danger"
              className="position-absolute top-0 start-100 translate-middle rounded-pill"
            >
              0
            </Badge>
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-end mb-4">
        <Col xs="auto">
          <Link to={ROUTERS.USER.AddProduct}>
            <Button variant="success" className="d-flex align-items-center">
              <FaPlus className="me-2" /> Add New Product
            </Button>
          </Link>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredProducts.length > 0 ? (
        <Row xs={1} md={2} lg={3} xl={4} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow product-card">
                {product.productImage && (
                  <Card.Img
                    variant="top"
                    src={`data:image/jpeg;base64,${product.productImage}`}
                    alt={product.productName}
                    className="product-image"
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="product-title">
                    {product.productName}
                  </Card.Title>
                  <Card.Text className="text-primary fw-bold mb-2">
                    ${product.price.toFixed(2)}
                  </Card.Text>
                  <Card.Text className="product-description flex-grow-1">
                    {product.description}
                  </Card.Text>
                  <Button
                    variant="outline-primary"
                    onClick={() => console.log("Add to cart clicked")}
                    className="mt-auto w-100"
                  >
                    Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info">No products available</Alert>
      )}
    </Container>
  );
};

export default Shop;
