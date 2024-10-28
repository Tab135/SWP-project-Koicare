import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify'; // Add this for security

const ViewBlog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { blogId } = useParams();


  const processContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');


    const images = doc.getElementsByTagName('img');


    Array.from(images).forEach(img => {
      img.classList.add('content-image-view');

      img.removeAttribute('style');
      img.removeAttribute('width');
      img.removeAttribute('height');
    });

    return doc.body.innerHTML;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:8080/public/blog/${blogId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();
        setBlog({
          ...data.blog,
          // Process the content before setting it
          blogContent: processContent(data.blog.blogContent)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [blogId]);

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

  if (!blog) {
    return (
      <Container>
        <Alert variant="info">News article not found</Alert>
      </Container>
    );
  }

  return (
    <Container className="news-view-view">
      <article className="news-article-view">
        <h1 className="news-headline">{blog.title}</h1>

        <div className="news-metadata-view">
          <span className="news-date-view">
            {new Date(blog.date).toLocaleDateString()}
          </span>
        </div>

        {blog.blogImage && (
          <div className="news-image-container-view">
            <img
              src={`data:image/jpeg;base64,${blog.blogImage}`}
              alt={blog.title}
              className="news-image-view"
            />
          </div>
        )}

        <div
          className="news-content-view"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog.blogContent)
          }}
        />
      </article>
    </Container>
  );
};

export default ViewBlog;