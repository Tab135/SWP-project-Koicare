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
        <th>Price</th>
        <th>Stock</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id}>
          <td>{product.productName}</td>
          <td>${product.price.toFixed(2)}</td>
          <td>{product.amount}</td>
          <td>
            <Button variant="danger" onClick={() => handleDelete(product.id)}>
              <FaTrashAlt />
            </Button>
            <Link to={`${ROUTERS.USER.UpdateProduct}/${product.id}`}>
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
