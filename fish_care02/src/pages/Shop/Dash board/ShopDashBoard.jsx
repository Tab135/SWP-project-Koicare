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
  FaBlogger,
  FaRegNewspaper,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { ROUTERS } from "../../../utis/router";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Import components
import ProductTable from "./table/ProductTable";
import CategoryTable from "./table/CategoryTable";
import OrderTable from "./table/OrderTable";
import StatCard from "./StatCard";
import BlogTable from "./table/BlogTable";
import DashBoardService from "./DashboardService";
import NewsTable from "./table/NewsTable";

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
  const [blogs, setBlogs] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const navigate = useNavigate();

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
  const fetchBlogs = async () => {
    try {
      const response = await DashBoardService.getAllBlogs();
      console.log("Fetched Blogs:", response); // Verify data
      setBlogs(response);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };
  const fetchNewsItems = async () => {
    try {
      const response = await DashBoardService.getAllNews();
      console.log("Fetched News:", response); // Verify data
      setNewsItems(response);
    } catch (error) {
      console.error("Error fetching news items:", error);
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
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  const handleEditBlog = (blogId) => {
    console.log("Edit blog with ID:", blogId);
    // Add logic for editing a blog (e.g., redirect to edit page or open modal)
  };

  const handleDeleteBlog = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await DashBoardService.deleteBlog(blogId);
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
        alert("Blog deleted successfully");
      } catch (error) {
        console.error("Failed to delete blog:", error);
      }
    }
  };
  const handleEditNews = (newsId) => {
    console.log("Edit news with ID:", newsId);
    // Logic for editing a news item (e.g., redirect to edit page or open modal)
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        await DashBoardService.deleteNews(newsId);
        setNewsItems(newsItems.filter((news) => news.id !== newsId));
        alert("News item deleted successfully");
      } catch (error) {
        console.error("Failed to delete news item:", error);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchTotalRevenue(),
        fetchBlogs(),
        fetchNewsItems(),
      ]);
    };
    fetchData();
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
              <Link to={ROUTERS.USER.AddCate}>
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
      case "blogs":
        return (
          <div className="data-table">
            <div className="d-flex justify-content-between align-items-center p-4">
              <h2 className="p-4 m-0">Blogs</h2>
              <Link to={ROUTERS.USER.CREATE_BLOG}>
                <Button className="add-btn">
                  <FaPlus /> Add Blogs
                </Button>
              </Link>
            </div>
            <BlogTable blogs={blogs} 
            handleEdit={handleEditBlog}
            handleDelete={handleDeleteBlog} />
          </div>
        );
      case "news":
        return (
          <div className="data-table">
            <div className="d-flex justify-content-between align-items-center p-4">
              <h2 className="m-0">News</h2>
              <Link to={ROUTERS.USER.News}>
                <Button className="add-btn">
                  <FaPlus /> Add News
                </Button>
              </Link>
            </div>
            <NewsTable newsItems={newsItems} 
            handleEdit={handleEditNews}
            handleDelete={handleDeleteNews} />
          </div>
        );
      default:
        return (
          <>
            <div className="dashboard-stats">
              <StatCard
                icon={<FaChartBar />}
                title="Total Revenue"
                value={`$${totalAmount ? totalAmount.toFixed(2) : "0.00"}`} // Check if totalAmount exists
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
          <Button
            className={`nav-btn ${view === "blogs" ? "active" : ""}`}
            onClick={() => setView("blogs")}
          >
            <FaBlogger className="me-2" /> Blogs
          </Button>
          <Button
            className={`nav-btn ${view === "news" ? "active" : ""}`}
            onClick={() => setView("news")}
          >
            <FaRegNewspaper className="me-2" /> News
          </Button>
        </div>

        <div className="dashboard-content">{renderContent()}</div>
      </Container>
    </div>
  );
};

export default ShopDashboard;
