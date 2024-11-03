import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { ROUTERS } from "../../../../utis/router";

const ProductTable = ({ products, handleDelete }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Product Name</th>
        <th>Category</th>
        <th>Price (VND)</th> {/* Updated column header */}
        <th>Stock</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id}>
          <td>{product.productName}</td>
          <td>{product.category?.categoryName || "No Category"}</td>
          <td>{(product.price ).toFixed(0)} VND</td>{" "}
          {/* Convert to VND and format */}
          <td>{product.amount}</td>
          <td>
            <Button variant="danger" onClick={() => handleDelete(product.id)}>
              <FaTrashAlt />
            </Button>
            <Link to={`/shop/updatePro/${product.id}`}>
              <Button variant="warning" className="ms-2">
                <FaEdit />
              </Button>
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ProductTable;
