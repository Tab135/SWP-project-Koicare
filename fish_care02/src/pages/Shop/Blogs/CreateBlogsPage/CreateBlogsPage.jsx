import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateBlogsPage.scss';

const CreateBlogsPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrl(fileUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('blogContent', content);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            await axios.post('http://localhost:8080/shop/blog/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Blog created successfully!");
            //navigate('/public/blog');
        } catch (error) {
            console.error("Error creating blog:", error);
            alert("Error creating blog. Please try again.");
        }
    };

    const handleDeleteImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    return (
        <div>
            <h1>Create New Blog</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Blog Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <div className="add-image-blog-upload-container">
                    {previewUrl ? (
                        <>
                            <img src={previewUrl} alt="Preview" className="add-blog-image-preview"/>
                            <button
                                type="button"
                                className="add-blog-change-image-button"
                                onClick={() => document.querySelector('input[type="file"]').click()}
                            >
                                Change Image
                            </button>
                            <button
                                type="button"
                                className="add-blog-delete-image-button"
                                onClick={handleDeleteImage}
                            >
                                Delete Image
                            </button>
                        </>
                    ) : (
                        <div className="add-blog-image-upload"
                             onClick={() => document.querySelector('input[type="file"]').click()}>
                            Select Image
                        </div>
                    )}
                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        style={{display: 'none'}}
                        accept="image/*"
                    />
                </div>

                <textarea
                    placeholder="Blog Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />

                <button type="submit">Create Blog</button>
            </form>
        </div>
    );
};

export default CreateBlogsPage;
