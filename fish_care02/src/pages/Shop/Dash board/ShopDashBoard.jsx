import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import ProductService from "../ShopService"; // Import your ProductService
import CategoryService from "./CategoryService";
import "./dashboard.scss";
import { Button,Row, Col } from "react-bootstrap"; // Removed Modal and Form imports
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utis/router";


const ShopDashboard = () => {
  const [products, setProducts] = useState([]); // State for storing products
  const [categories, setCategories] = useState([]); // State for storing categories
  const [orders, setOrders] = useState([]); // State for orders
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [error, setError] = useState(null);
  const [view, setView] = useState("products"); // State to track the current view (products, categories)

  // Fetch all products and categories on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await ProductService.getAllProducts();
        setProducts(productList); // Update state with fetched products
        setFilteredProducts(productList); // Set initial filtered products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categories = await CategoryService.getAllCategory();
        console.log("Fetched categories:", categories); // Add this to debug
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts(); // Call the fetch function for products
    fetchCategories(); // Call the fetch function for categories
  }, []);

  // Filter products based on the search term
  useEffect(() => {
    const results = products.filter((product) =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
  const totalProducts = filteredProducts.length; // Update total products to count filtered products
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

  // Function to render content based on the current view
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
          <Link to={ROUTERS.USER.AddCate}>
            <Button variant="primary" className="mb-3">
              Add Category
            </Button>
          </Link>
          <CategoryTable
            categories={categories}
            handleDeleteCategory={handleDeleteCategory}
          />
        </>
      );
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <aside className="sidebar">
        <h2 className="text-center">Statistics</h2>
        <div className="dashboard-stats">
          <Row className="justify-content-center"> {/* Centering the row */}
            <Col md={6} className="mb-3"> {/* Column for Total Revenue */}
              <StatsCard
                title="Total Revenue"
                value={`$${totalRevenue.toFixed(2)}`}
              />
            </Col>
            <Col md={6} className="mb-3"> {/* Column for Total Products */}
              <StatsCard title="Total Products" value={totalProducts} />
            </Col>
          </Row>
          <Row className="justify-content-center"> {/* Centering the row */}
            <Col md={6} className="mb-3"> {/* Column for Total Stock */}
              <StatsCard title="Total Stock" value={totalStock} />
            </Col>
            <Col md={6} className="mb-3"> {/* Column for Total Orders */}
              <StatsCard title="Total Orders" value={totalOrders} />
            </Col>
          </Row>
        </div>
      </aside>

      <main className="main-content flex-grow-1">
        <h1 className="my-4 text-center">Shop Dashboard</h1>

        {/* Adjusted button layout */}
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

        <h2>Stock Levels Chart</h2>
        <div className="chart-container">
          <Bar data={chartData} />
        </div>
      </main>
    </div>
  );
};

// Reusable StatsCard component
const StatsCard = ({ title, value }) => (
  <div className="card text-center mb-3" style={{ width: "10rem"　, marginLeft: "5em " }}>
    <div className="card-body">
      <h6>{value}</h6>
      <h6>{title}</h6>
    </div>
  </div>
);

// Reusable ProductTable component
const ProductTable = ({ products, handleDelete }) => (
  <table className="table table-striped table-hover">
    <thead>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Stock</th>
        <th>Amount</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id}>
          <td>{product.productName}</td>
          <td>{product.category?.categoryName || "No Category"}</td>
          <td>${product.price.toFixed(2)}</td>
          <td>{product.stockQuantity}</td>
          <td>{product.amount}</td>
          <td>
            <div className="btn-group" role="group">
              <Link to={ROUTERS.USER.AddProduct}>
                <Button variant="success" size="sm" className="me-2">
                  <FaPlus className="me-1" />
                </Button>
              </Link>
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

// Reusable CategoryTable component
const CategoryTable = ({ categories, handleDeleteCategory }) => (
  <table className="table table-striped table-hover">
    <thead>
      <tr>
        <th>Category ID</th>
        <th>Category Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {categories.map((category) => (
        <tr key={category.categoryId}>
          <td>{category.categoryId}</td>

          <td>{category.categoryName}</td>
          <td>
            <div className="btn-group" role="group">
              <Link to={`/shop/updateCate/${category.categoryId}`}>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  title="Edit Category"
                >
                  <FaEdit className="me-1" />
                </Button>
              </Link>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteCategory(category.categoryId)}
                title="Delete Category"
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

export default ShopDashboard;
