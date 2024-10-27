import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPondPage.scss';

const EditPondPage = () => {
    const { pondId } = useParams();
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
    const [picture, setPicture] = useState(null);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPond = async () => {
            try {
                let token = localStorage.getItem('token');
                if (!token) {
                    token = sessionStorage.getItem('token');
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get(`http://localhost:8080/user/pond/${pondId}/get`, config);
                setPond(response.data.pond);
                setPreviewUrl(response.data.pond.picture);
                setIsImageUploaded(!!response.data.pond.picture);
            } catch (error) {
                setError("Error fetching pond data.");
            }
        };

        fetchPond();
    }, [pondId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['depth', 'volume', 'pumpingCapacity', 'drain'].includes(name)) {
            if (value < 0) {
                alert(`${name.charAt(0).toUpperCase() + name.slice(1)} parameter cannot be less than 0.`);
                return;
            }
        }
        setPond({
            ...pond,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPicture(file);

        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setIsImageUploaded(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let token = localStorage.getItem('token');
            if (!token) {
                token = sessionStorage.getItem('token');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            const formData = new FormData();
            formData.append('pondName', pond.pondName);
            formData.append('depth', pond.depth);
            formData.append('drain', pond.drain);
            formData.append('location', pond.location);
            formData.append('numberOfFish', pond.numberOfFish);
            formData.append('pumpingCapacity', pond.pumpingCapacity);
            formData.append('skimmers', pond.skimmers);
            formData.append('volume', pond.volume);
            formData.append('waterSource', pond.waterSource);
            if (picture) {
                formData.append('picture', picture);
            }

            await axios.put(`http://localhost:8080/user/pond/${pondId}/update`, formData, config);
            navigate('/list-ponds');
        } catch (error) {
            setError("Error updating pond. Please try again.");
        }
    };

    return (
        <div className="edit-pond-container">
            <h1>Edit Pond</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Picture:</label>
                <div className="image-upload-container">
                    {isImageUploaded ? (
                        <>
                            <img src={`data:image/png;base64, ${previewUrl}`} alt="Preview" className="image-preview" />
                            <button
                                type="button"
                                className="change-image-button"
                                onClick={() => document.querySelector('input[type="file"]').click()}
                            >
                                Change Image
                            </button>
                        </>
                    ) : (
                        <div
                            className="image-upload"
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        >
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

                <label>Pond Name:</label>
                <input
                    type="text"
                    name="pondName"
                    value={pond.pondName}
                    onChange={handleInputChange}
                    required
                />

                <label>Depth (m):</label>
                <input
                    type="number"
                    name="depth"
                    value={pond.depth}
                    onChange={handleInputChange}
                    required
                />

                <label>Volume (L):</label>
                <input
                    type="number"
                    name="volume"
                    value={pond.volume}
                    onChange={handleInputChange}
                    required
                />

                <label>Drain:</label>
                <input
                    type="number"
                    name="drain"
                    value={pond.drain}
                    onChange={handleInputChange}
                    required
                />

                <label>Location:</label>
                <input
                    type="text"
                    name="location"
                    value={pond.location}
                    onChange={handleInputChange}
                    required
                />

                <label>Skimmers:</label>
                <input
                    type="text"
                    name="skimmers"
                    value={pond.skimmers}
                    onChange={handleInputChange}
                    required
                />

                <label>Pumping Capacity (L/min):</label>
                <input
                    type="number"
                    name="pumpingCapacity"
                    value={pond.pumpingCapacity}
                    onChange={handleInputChange}
                    required
                />

                <label>Water Source:</label>
                <input
                    type="text"
                    name="waterSource"
                    value={pond.waterSource}
                    onChange={handleInputChange}
                    required
                />

                <button type="submit">Update Pond</button>
            </form>
        </div>
    );
};

export default EditPondPage;
