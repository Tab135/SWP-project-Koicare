import React, { useEffect,useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import './CreateNews.scss';
import { jwtDecode } from 'jwt-decode';



const CreateNews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const navigate = useNavigate();
useEffect(() => {
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
}, [navigate]);
  const [previewImage, setPreviewImage] = useState(null);

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
      formDataToSend.append('Headline', formData.title);
      formDataToSend.append('NewsContent', formData.content);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch('http://localhost:8080/shop/news/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem("token")}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        window.location.href = '/shop/dashboard';
      } else {
        throw new Error('Failed to create news');
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

  // Quill toolbar and modules configuration for font size
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],  // Font size options
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']  // Remove formatting
    ]
  };

  return (
    <Container className="create-news-container-add">
      <div className="create-news-form-add">
        <h2>Create News Article</h2>

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
              modules={modules}  // Include the custom toolbar modules here
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
                  <span> Creating...</span>
                </>
              ) : (
                'Create News'
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/news'}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default CreateNews;
