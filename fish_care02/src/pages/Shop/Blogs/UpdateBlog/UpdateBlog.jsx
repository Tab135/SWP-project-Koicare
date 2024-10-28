import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import 'react-quill/dist/quill.snow.css';

const UpdateBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    // Check authentication and role
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;
      if (role !== 'SHOP') {
        navigate('/koicare');
      }
    } else {
      navigate('/');
    }

    // Fetch existing news data
    const fetchNewsData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/public/blog/${blogId}`);
        if (!response.ok) throw new Error('Failed to fetch news data');
        const data = await response.json();

        setFormData({
          title: data.blog.title || '',
          content: data.blog.blogContent || '',
          image: null
        });

        // Fetch and set image preview if exists
        const imageResponse = await fetch(`http://localhost:8080/public/blog/${blogId}/image`);
        if (imageResponse.ok) {
          const base64Image = await imageResponse.text();
          if (base64Image && base64Image !== "Image not found") {
            setPreviewImage(`data:image/jpeg;base64,${base64Image}`);
          }
        }
      } catch (err) {
        setError('Failed to load news data: ' + err.message);
      }
    };

    fetchNewsData();
  }, [blogId, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({
      ...prev,
      content: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('blogContent', formData.content);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(`http://localhost:8080/shop/blog/${blogId}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        window.location.href = '/news';
      } else {
        throw new Error('Failed to update news');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setFormData(prev => ({
      ...prev,
      image: null
    }));
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ]
  };
  return (
    <Container className="create-news-container-add">
      <div className="create-news-form-add">
        <h2>Update News Article</h2>

        {error && (
          <Alert variant="danger">{error}</Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <div className="image-upload-section-add">
            <div className="image-upload-container-add">
              {previewImage ? (
                <div className="preview-container-add">
                  <img src={previewImage} alt="Preview" className="preview-image-add"/>
                  <Button
                    variant="danger"
                    size="sm"
                    className="remove-image-btn-add"
                    onClick={removeImage}
                  >
                    ✕
                  </Button>
                </div>
              ) : (
                <label className="upload-placeholder-add">
                  <div className="upload-icon-add">📷</div>
                  <span>Upload Image</span>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                </label>
              )}
            </div>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter news title"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <ReactQuill
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Enter news content"
              required
              theme="snow"
              style={{ minHeight: '200px' }}
              modules={modules}
            />
          </Form.Group>

          <div className="button-group-add">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span> Updating...</span>
                </>
              ) : (
                'Update News'
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/public/blog'}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default UpdateBlog;
