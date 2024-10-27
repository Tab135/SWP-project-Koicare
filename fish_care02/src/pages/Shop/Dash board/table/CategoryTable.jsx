import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const CategoryTable = ({ categories, handleDeleteCategory }) => (
  <table className="table">
    <thead>
      <tr>
        <th>Category Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {categories.map((category) => (
        <tr key={category.categoryId}>
          <td>{category.categoryName}</td>
          <td>
            <Button
              variant="danger"
              onClick={() => handleDeleteCategory(category.categoryId)}
            >
              <FaTrashAlt />
            </Button>
            <Link to={`/shop/updateCate/${category.categoryId}`}>
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

export default CategoryTable;
