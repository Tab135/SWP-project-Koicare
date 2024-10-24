import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoryService from "../../Dash board/CategoryService";
import { Button } from "react-bootstrap";

const UpdateCategory = () => {
  const { cateId } = useParams(); // Get the category ID from the URL
  const navigate = useNavigate(); // Hook for navigation
  const [categoryName, setCategoryName] = useState(""); // State for category name
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the current category details
    const fetchCategory = async () => {
      try {
        const category = await CategoryService.getCategoryById(cateId); // Make sure to implement this method in CategoryService
        setCategoryName(category.categoryName); // Set the category name in state
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory(); // Call the fetch function
  }, [cateId]);

  const handleUpdate = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    try {
      await CategoryService.updateCategory(cateId, { categoryName }); // Make sure to implement this method in CategoryService
      alert("Category updated successfully!");
      navigate("/shop/product"); // Redirect to the dashboard after successful update
    } catch (error) {
      setError("Failed to update category: " + error.message);
    }
  };

  return (
    <div className="update-category-container">
      <h2>Update Category</h2>
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label htmlFor="categoryName" className="form-label">
            Category Name
          </label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <Button variant="primary" type="submit">
          Update Category
        </Button>
      </form>
    </div>
  );
};

export default UpdateCategory;
