import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify'; // Add this for security
import './ViewNews.scss';

const ViewNews = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { newsId } = useParams();

  // Function to process HTML content and resize images
  const processContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // Find all images in the content
    const images = doc.getElementsByTagName('img');

    // Modify each image
    Array.from(images).forEach(img => {
      img.classList.add('content-image-view');
      // Remove any inline styles that might affect size
      img.removeAttribute('style');
      img.removeAttribute('width');
      img.removeAttribute('height');
    });

    return doc.body.innerHTML;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://170.64.198.85:8080/public/news/${newsId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews({
          ...data.news,
          // Process the content before setting it
          newsContent: processContent(data.news.newsContent)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!news) {
    return (
      <Container>
        <Alert variant="info">News article not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="news-view-view">
      <article className="news-article-view">
        <h1 className="news-headline">{news.headline}</h1>

        <div className="news-metadata-view">
          <span className="news-date-view">
            {new Date(news.date).toLocaleDateString()}
          </span>
        </div>

        {news.newsImage && (
          <div className="news-image-container-view">
            <img
              src={`data:image/jpeg;base64,${news.newsImage}`}
              alt={news.headline}
              className="news-image-view"
            />
          </div>
        )}

        <div
          className="news-content-view"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(news.newsContent)
          }}
        />
      </article>
    </Container>
  );
};

export default ViewNews;