// src/components/AddCategory.jsx

import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import CategoryService from "../../Dash board/CategoryService";
import { useNavigate } from "react-router-dom";

const AddCate = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === "") {
      alert("Category name is required.");
      return;
    }

    try {
      await CategoryService.addCategory({ categoryName: newCategoryName });
      alert("Category added successfully!");
      navigate("/shop/product"); // Redirect after successful addition
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Failed to add category.");
    }
  };

  return (
    <div className="container">
      <h2>Add New Category</h2>
      <Form onSubmit={handleAddCategory}>
        <Form.Group controlId="formCategoryName">
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Add Category
        </Button>
      </Form>
    </div>
  );
};

export default AddCate;
