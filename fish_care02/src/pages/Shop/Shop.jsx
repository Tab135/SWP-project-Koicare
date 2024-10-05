import React, { useState, useEffect } from "react";
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
} from "react-bootstrap";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import "./shop.css";

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
    // You can add additional search logic here if needed
    console.log("Searching for:", searchTerm);
    // For now, we're just logging the search term
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
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Our Products</h1>
        <div className="d-flex align-items-center">
          <InputGroup className="me-3 custom-search-bar">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </InputGroup>
          <div className="position-relative">
            <FaShoppingCart size={24} />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              0
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredProducts.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.productName}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    Price: ${product.price.toFixed(2)}
                  </Card.Text>
                  <Card.Text className="flex-grow-1">
                    {product.description}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => console.log("Add to cart clicked")}
                    className="mt-auto"
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
