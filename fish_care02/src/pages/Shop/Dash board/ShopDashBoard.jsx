import React, { useState } from "react";


const ShopDashboard = () => {
  const [products, setProducts] = useState([
    {
      name: "Premium Wireless Headphones",
      category: "Electronics",
      price: 199.99,
      stock: 50,
    },
    {
      name: "Smart Fitness Tracker",
      category: "Wearables",
      price: 89.99,
      stock: 75,
    },
    {
      name: "Ultra-Thin Laptop",
      category: "Computers",
      price: 1299.99,
      stock: 25,
    },
    {
      name: "Professional Camera Kit",
      category: "Photography",
      price: 2499.99,
      stock: 10,
    },
  ]);

  const [orders, setOrders] = useState([
    {
      name: "John Doe",
      date: "2023-04-01",
      price: 199.99,
      status: "Shipped",
    },
    {
      name: "Jane Smith",
      date: "2023-04-02",
      price: 89.99,
      status: "Processing",
    },
    {
      name: "Bob Johnson",
      date: "2023-04-03",
      price: 1299.99,
      status: "Delivered",
    },
    {
      name: "Alice Brown",
      date: "2023-04-04",
      price: 2499.99,
      status: "Pending",
    },
  ]);

  const totalRevenue = orders.reduce((acc, order) => acc + order.price, 0);
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, product) => acc + product.stock, 0);
  const totalOrders = orders.length;

  return (
    <div className="container">
      <h1 className="my-4">Shop Dashboard</h1>
      <div className="row dashboard-stats">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>${totalRevenue.toFixed(2)}</h3>
              <h6>Total Revenue</h6>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{totalProducts}</h3>
              <h6>Total Products</h6>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{totalStock}</h3>
              <h6>Total Stock</h6>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h3>{totalOrders}</h3>
              <h6>Total Orders</h6>
            </div>
          </div>
        </div>
      </div>
      <h2>Product Inventory</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.name}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Order History</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.name}>
              <td>{order.name}</td>
              <td>{order.date}</td>
              <td>${order.price.toFixed(2)}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShopDashboard;
