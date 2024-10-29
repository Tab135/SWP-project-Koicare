import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";


const BlogTable = ({ blogs, handleEdit, handleDelete }) => {
  return (
    <div className="blog-table">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.blogId}>
              <td>{blog.blogId}</td>
              <td>{blog.title}</td>
              <td>{new Date(blog.date).toLocaleDateString()}</td>
              <td>
                <Link to={`/shop/blog/update/${blog.blogId}`}>
                  <Button
                    variant="warning"
                    className="me-2"
                    onClick={() => handleEdit(blog.blogId)}
                  >
                    <FaEdit /> Edit
                  </Button>
                </Link>

                <Button
                  variant="danger"
                  onClick={() => handleDelete(blog.blogId)}
                >
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BlogTable;
