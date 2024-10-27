import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ProductService from "../ShopService";
import CategoryService from "./CategoryService";
import "./dashboard.scss";
import { Button, Row, Col } from "react-bootstrap";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utis/router";

const ShopDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [view, setView] = useState("products");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await ProductService.getAllProducts();
        setProducts(productList);
        setFilteredProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categories = await CategoryService.getAllCategory();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = products.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
  const totalProducts = filteredProducts.length;
  const totalStock = filteredProducts.reduce(
    (acc, product) => acc + product.stock,
    0
  );
  const totalOrders = orders.length;

  const chartData = {
    labels: filteredProducts.map((product) => product.productName),
    datasets: [
      {
        label: "Stock Levels",
        data: filteredProducts.map((product) => product.stock),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ProductService.deleteProduct(productId);
        setProducts(products.filter((product) => product.id !== productId));
        setFilteredProducts(
          filteredProducts.filter((product) => product.id !== productId)
        );
        alert("Product deleted successfully");
      } catch (error) {
        setError("Failed to delete product: " + error.message);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This will delete associated products as well."
      )
    ) {
      try {
        const response = await CategoryService.deleteCategory(categoryId);
        if (response.statusCode === 200) {
          setCategories(
            categories.filter((cat) => cat.categoryId !== categoryId)
          );
          alert("Category and associated products deleted successfully.");
        } else {
          alert(response.message);
        }
      } catch (error) {
        alert("Failed to delete category: " + error.message);
      }
    }
  };

  const renderContent = () => {
    if (view === "products") {
      return (
        <>
          <h2>Product Inventory</h2>
          <ProductTable
            products={filteredProducts}
            handleDelete={handleDelete}
          />
        </>
      );
    } else if (view === "categories") {
      return (
        <>
          <h2>Category List</h2>
          <CategoryTable
            categories={categories}
            handleDeleteCategory={handleDeleteCategory}
          />
        </>
      );
    }
  };

  return (
    <div className="custom-dashboard-container d-flex flex-column">
      <Row className="mb-4">
        <Col>
          <h2>Stock Levels Chart</h2>
          <div className="custom-chart-container">
            <Bar data={chartData} />
          </div>
        </Col>
      </Row>

      <Row className="DB custom-row-margin">
        <Col md={6} className="custom-sidebar">
          <h2 className="text-center">Statistics</h2>
          <div className="custom-dashboard-stats">
            <Row className="justify-content-center">
              <Col md={6} className="mb-3">
                <CustomStatsCard
                  title="Total Revenue"
                  value={`$${totalRevenue.toFixed(2)}`}
                />
              </Col>
              <Col md={6} className="mb-3">
                <CustomStatsCard title="Total Products" value={totalProducts} />
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={6} className="mb-3">
                <CustomStatsCard title="Total Stock" value={totalStock} />
              </Col>
              <Col md={6} className="mb-3">
                <CustomStatsCard title="Total Orders" value={totalOrders} />
              </Col>
            </Row>
          </div>
        </Col>

        <Col md={6} className="custom-main-content">
          <h1 className="my-4 text-center">Shop Dashboard</h1>
          <div className="d-flex justify-content-start mb-3">
            <Button
              variant="primary"
              className="me-2"
              size="sm"
              onClick={() => setView("products")}
            >
              Products
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setView("categories")}
            >
              Categories
            </Button>
          </div>
          {renderContent()}
        </Col>
      </Row>
    </div>
  );
};

const CustomStatsCard = ({ title, value }) => (
  <div className="custom-card text-center mb-3">
    <div className="custom-card-body">
      <h6>{value}</h6>
      <h6>{title}</h6>
    </div>
  </div>
);

const ProductTable = ({ products, handleDelete }) => (
  <table className="custom-table table-striped table-hover">
    <thead>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Amount</th>
        <th>
          Actions
          <Link to={ROUTERS.USER.AddProduct}>
            <Button variant="success" size="sm" className="ms-2">
              <FaPlus className="me-1" /> Add Product
            </Button>
          </Link>
        </th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id} className="hover-row">
          <td>{product.productName}</td>
          <td>{product.category?.categoryName || "No Category"}</td>
          <td>${product.price.toFixed(2)}</td>
          <td>{product.amount}</td>
          <td>
            <div className="btn-group" role="group">
              <Link to={`/shop/updatePro/${product.id}`}>
                <Button variant="warning" size="sm" className="me-2">
                  <FaEdit className="me-1" />
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(product.id)}
              >
                <FaTrashAlt className="me-1" />
              </Button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const CategoryTable = ({ categories, handleDeleteCategory }) => (
  <table className="custom-table table-striped table-hover">
    <thead>
      <tr>
        <th>Category ID</th>
        <th>Category Name</th>
        <th>
          Actions
          <Link to={ROUTERS.USER.AddCate}>
            <Button
              variant="primary"
              size="sm"
              className="ms-2 custom-small-button"
            >
              <FaPlus className="me-1" /> Add Category
            </Button>
          </Link>
        </th>
      </tr>
    </thead>
    <tbody>
      {categories.map((category) => (
        <tr key={category.categoryId} className="hover-row">
          <td>{category.categoryId}</td>
          <td>{category.categoryName}</td>
          <td>
            <Button
              variant="danger"
              size="sm"
              className="me-2 custom-small-button"
              onClick={() => handleDeleteCategory(category.categoryId)}
            >
              <FaTrashAlt className="me-1" />
            </Button>
            <Link to={`/shop/updateCategory/${category.categoryId}`}>
              <Button
                variant="warning"
                size="sm"
                className="custom-small-button"
              >
                <FaEdit className="me-1" />
              </Button>
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ShopDashboard;
