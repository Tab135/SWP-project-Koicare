import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "./dashboard.scss";
import ProductService from "../ShopService";
import CategoryService from "./CategoryService";
import OrderService from "../Order/OrderService";
import { Button, Container } from "react-bootstrap";
import {
  FaPlus,
  FaChartBar,
  FaBox,
  FaList,
  FaShoppingCart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utis/router";

// Import components
import ProductTable from "./table/ProductTable";
import CategoryTable from "./table/CategoryTable";
import OrderTable from "./table/OrderTable";
import StatCard from "./StatCard";

const ShopDashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [view, setView] = useState("dashboard");

  const orderStatuses = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELED"];

  const chartData = {
    labels: products.map((product) => product.productName || ""),
    datasets: [
      {
        label: "Stock Levels",
        data: products.map((product) => product.amount || 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

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

  const fetchOrders = async () => {
    try {
      const response = await OrderService.getOrderByStatus();
      setOrders(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchTotalRevenue = async () => {
    try {
      const revenueData = await OrderService.getTotalRevenue();
      const totalRevenue = revenueData.totalAmount; // Accessing totalAmount directly
      setTotalAmount(totalRevenue);
    } catch (error) {
      console.error("Error fetching total revenue:", error);
    }
  };

  const calculateTotals = (products, orders) => {
    setTotalProducts(products.length);
    setTotalStock(
      products.reduce((acc, product) => acc + (product.amount || 0), 0)
    );
    setTotalOrders(orders.length);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ProductService.deleteProduct(productId);
        const updatedProducts = products.filter(
          (product) => product.id !== productId
        );
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        alert("Product deleted successfully");
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await CategoryService.deleteCategory(categoryId);
        if (response.statusCode === 200) {
          setCategories(
            categories.filter((cat) => cat.categoryId !== categoryId)
          );
          alert("Category deleted successfully.");
        } else {
          alert(response.message);
        }
      } catch (error) {
        console.error("Failed to delete category:", error);
      }
    }
  };

  const handleUpdateStatus = async (orderId, orderStatus) => {
    try {
      console.log("Updating Order ID:", orderId, "to Status:", orderStatus); // Log for debugging
      const updatedOrder = await OrderService.updateOrderStatus(
        orderId,
        orderStatus
      );
      console.log("Order updated successfully:", updatedOrder);
      fetchOrders(); // Re-fetch orders to reflect the updated status
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchOrders(),
      fetchTotalRevenue(),
    ]); // Fetch all data
  }, []);

  useEffect(() => {
    calculateTotals(products, orders);
  }, [products, orders]);

  const renderContent = () => {
    switch (view) {
      case "products":
        return (
          <div className="data-table">
            <div className="d-flex justify-content-between align-items-center p-4">
              <h2 className="m-0">Product Inventory</h2>
              <Link to={ROUTERS.USER.AddProduct}>
                <Button className="add-btn">
                  <FaPlus /> Add Product
                </Button>
              </Link>
            </div>
            <ProductTable
              products={filteredProducts}
              handleDelete={handleDelete}
            />
          </div>
        );
      case "categories":
        return (
          <div className="data-table">
            <div className="d-flex justify-content-between align-items-center p-4">
              <h2 className="m-0">Categories</h2>
              <Link to={ROUTERS.USER.AddCategory}>
                <Button className="add-btn">
                  <FaPlus /> Add Category
                </Button>
              </Link>
            </div>
            <CategoryTable
              categories={categories}
              handleDeleteCategory={handleDeleteCategory}
            />
          </div>
        );
      case "orders":
        return (
          <div className="data-table">
            <h2 className="p-4 m-0">Orders</h2>
            <OrderTable
              orders={orders}
              onUpdateStatus={handleUpdateStatus} // Pass the function directly
              orderStatuses={orderStatuses} // Pass order statuses for selection
            />
          </div>
        );
      default:
        return (
          <>
            <div className="dashboard-stats">
              <StatCard
                icon={<FaChartBar />}
                title="Total Revenue"
                value={`$${totalAmount.toFixed(2)}`} // Display the total revenue
                color="#4338ca"
              />
              <StatCard
                icon={<FaBox />}
                title="Total Products"
                value={totalProducts}
                color="#059669"
              />
              <StatCard
                icon={<FaList />}
                title="Total Stock"
                value={totalStock}
                color="#db2777"
              />
              <StatCard
                icon={<FaShoppingCart />}
                title="Total Orders"
                value={totalOrders}
                color="#9333ea"
              />
            </div>

            <div className="chart-container">
              <h4>Stock Levels</h4>
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allow resizing
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
                height={250} // Set the height of the chart
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="dashboard">
      <Container fluid>
        <div className="dashboard-header">
          <h1>Shop Dashboard</h1>
        </div>

        <div className="dashboard-nav">
          <Button
            className={`nav-btn me-2 ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            <FaChartBar className="me-2" /> Dashboard
          </Button>
          <Button
            className={`nav-btn me-2 ${view === "products" ? "active" : ""}`}
            onClick={() => setView("products")}
          >
            <FaBox className="me-2" /> Products
          </Button>
          <Button
            className={`nav-btn me-2 ${view === "categories" ? "active" : ""}`}
            onClick={() => setView("categories")}
          >
            <FaList className="me-2" /> Categories
          </Button>
          <Button
            className={`nav-btn ${view === "orders" ? "active" : ""}`}
            onClick={() => setView("orders")}
          >
            <FaShoppingCart className="me-2" /> Orders
          </Button>
        </div>

        <div className="dashboard-content">{renderContent()}</div>
      </Container>
    </div>
  );
};

export default ShopDashboard;
