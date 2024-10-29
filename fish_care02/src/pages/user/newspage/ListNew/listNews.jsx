import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ListNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const itemsPerPage = 6; // Number of news items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:8080/public/news');
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();

        if (data.statusCode === 200) {
          setNews(data.newsList || []);
        } else {
          setError(data.message || 'Failed to fetch news');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (newsId) => {
    navigate(`/public/news/${newsId}`);
  };

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  const totalPages = Math.ceil(news.length / itemsPerPage);
  const paginatedNews = news
    .filter(article => article.headline.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by search query
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query state
    setCurrentPage(1); // Reset to the first page on search
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
      <h1 className="news-title-list">Latest News</h1>

      <input
        type="text"
        placeholder="Search by headline..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="search-input"
      />

      <div className="news-grid-list">
        {paginatedNews.map((article) => (
          <div
            key={article.id || article.newsId}
            className="news-card-list"
            onClick={() => handleNewsClick(article.id || article.newsId)}
          >
            {article.newsImage && (
              <div className="news-image-container-list">
                <img
                  src={`data:image/jpeg;base64,${article.newsImage}`}
                  alt={article.headline}
                  className="news-image-list"
                />
              </div>
            )}

            <div className="news-content-list">
              <h2 className="news-headline-list">
                {article.headline || 'No Title'}
              </h2>

              <div className="news-meta-list">
                <span className="news-date-list">
                  {article.date ? new Date(article.date).toLocaleDateString() : 'No Date'}
                </span>
              </div>

              <div className="news-description-list">
                {truncateText((article.newsContent || '').replace(/<[^>]*>/g, ''), 100)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {news.length === 0 && (
        <div className="no-news-message-list">
          No news articles found.
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

export default ListNews;
