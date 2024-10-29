// NewsTable.jsx
import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const NewsTable = ({ newsItems, handleEdit, handleDelete }) => {
  return (
    <div className="news-table">
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
          {newsItems && newsItems.length > 0 ? (
            newsItems.map((news) => (
              <tr key={news.newsId}>
                <td>{news.newsId}</td>
                <td>{news.headline}</td>

                <td>{new Date(news.date).toLocaleDateString()}</td>
                <td>
                  <Link to={`/shop/updatenews/${news.newsId}`}>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(news.newsId)}
                    >
                      <FaEdit /> Edit
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(news.newsId)}
                  >
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No news available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default NewsTable;
