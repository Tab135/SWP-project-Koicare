import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListBlogs.scss';

const ListBlog = () => {
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const itemsPerPage = 6; // Number of news items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://170.64.198.85:8080/public/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();

        if (data.statusCode === 200) {
          setBlog(data.blogList || []);
        } else {
          setError(data.message || 'Failed to fetch blog');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (blogId) => {
    navigate(`/public/blog/${blogId}`);
  };

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  // Filter blogs based on the search term
  const filteredBlogs = blog.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const paginatedNews = filteredBlogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return (
      <div className="loading-container-list">
        <div className="loading-spinner-list" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container-list">
        <div className="error-message-list">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="news-container-list">
      <h1 className="news-title-list">Latest Blogs</h1>

      {/* Search Input */}
      <div className="search-container-list">
        <input
          type="text"
          placeholder="Search blog titles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          className="search-input-list"
        />
      </div>

      <div className="news-grid-list">
        {paginatedNews.map((article) => (
          <div
            key={article.id || article.blogId}
            className="news-card-list"
            onClick={() => handleNewsClick(article.id || article.blogId)}
          >
            {article.blogImage && (
              <div className="news-image-container-list">
                <img
                  src={`data:image/jpeg;base64,${article.blogImage}`}
                  alt={article.title}
                  className="news-image-list"
                />
              </div>
            )}

            <div className="news-content-list">
              <h2 className="news-headline-list">
                {article.title || 'No Title'}
              </h2>

              <div className="news-meta-list">
                <span className="news-date-list">
                  {article.date ? new Date(article.date).toLocaleDateString() : 'No Date'}
                </span>
              </div>

              <div className="news-description-list">
                {truncateText((article.blogContent || '').replace(/<[^>]*>/g, ''), 100)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="no-news-message-list">
          No blog articles found.
        </div>
      )}

      <div className="pagination-list">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListBlog;
