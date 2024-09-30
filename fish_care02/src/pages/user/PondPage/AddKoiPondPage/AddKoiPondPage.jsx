import React, { useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';  // Fix incorrect import
import './AddKoiPondPage.css';

const AddKoiPondPage = () => {
    const [pond, setPond] = useState({
        pondName: '',
        depth: '',
        drain: '',
        location: '',
        numberOfFish: '',
        pumpingCapacity: '',
        skimmers: '',
        volume: '',
        waterSource: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    const handleChange = (e) => {
        setPond({
            ...pond,
            [e.target.name]: e.target.value
        });
    };

    // Handle image file selection and preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        setIsImageUploaded(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('picture', selectedFile);
        Object.keys(pond).forEach(key => {
            formData.append(key, pond[key]);
        });

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to add a pond.');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;
            console.log('User ID:', userId);

            const config = {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                },
            };

            const response = await axios.post('http://localhost:8080/user/createPond', formData, config);

            if (response.status === 200) {
                alert('Pond added successfully!');
            } else {
                alert('Failed to add pond.');
            }
        } catch (error) {
            console.error('Error adding pond: ', error);
            alert('Failed to add pond.');
        }
    };

    return (
        <div className="pond-form-container">
            <h1>Create New Pond</h1>
            <div className="image-upload-container">
                {isImageUploaded ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="image-preview" />
                        <button
                            type="button"
                            className="change-image-button"
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                            Change Image
                        </button>
                    </>
                ) : (
                    <div className="image-upload" onClick={() => document.querySelector('input[type="file"]').click()}>
                        Select Image
                    </div>
                )}
                <input
                    type="file"
                    name="picture"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                />
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Pond Name:</label>
                    <input type="text" name="pondName" value={pond.pondName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Depth:</label>
                    <input type="number" name="depth" value={pond.depth} onChange={handleChange} required />
                    <label>Volume:</label>
                    <input type="number" name="volume" value={pond.volume} onChange={handleChange} required />
                </div>
                <div>
                    <label>Drain:</label>
                    <input type="number" name="drain" value={pond.drain} onChange={handleChange} required />
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" name="location" value={pond.location} onChange={handleChange} required />
                </div>
                <div>
                    <label>Skimmers:</label>
                    <input type="text" name="skimmers" value={pond.skimmers} onChange={handleChange} required />
                </div>
                <div>
                    <label>Pumping Capacity:</label>
                    <input type="number" name="pumpingCapacity" value={pond.pumpingCapacity} onChange={handleChange} required />
                </div>
                <div>
                    <label>Water Source:</label>
                    <input type="text" name="waterSource" value={pond.waterSource} onChange={handleChange} required />
                </div>
                <button type="submit">Add Pond</button>
            </form>
        </div>
    );
};

export default AddKoiPondPage;
