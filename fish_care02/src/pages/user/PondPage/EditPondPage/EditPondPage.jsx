import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPondPage.css';

const EditPondPage = () => {
    const { pondId } = useParams();
    const [pond, setPond] = useState({});
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPond = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get(`http://localhost:8080/user/pond/${pondId}`, config);
                setPond(response.data.pond);
            } catch (error) {
                setError("Error fetching pond data.");
            }
        };

        fetchPond();
    }, [pondId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPond({
            ...pond,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await axios.put(`http://localhost:8080/user/pond/${pondId}/update`, pond, config);
            navigate('/list-ponds');
        } catch (error) {
            setError("Error updating pond. Please try again.");
        }
    };

    return (
        <div className="edit-pond-container">
            <h1>Edit Pond</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Pond Name:
                    <input
                        type="text"
                        name="pondName"
                        value={pond.pondName || ''}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Depth (m):
                    <input
                        type="number"
                        name="depth"
                        value={pond.depth || ''}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Volume (L):
                    <input
                        type="number"
                        name="volume"
                        value={pond.volume || ''}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Depth (m):
                    <input
                        type="number"
                        name="depth"
                        value={pond.drain || ''}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Depth (m):
                    <input
                        type="text"
                        name="depth"
                        value={pond.location || ''}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Depth (m):
                    <input
                        type="text"
                        name="depth"
                        value={pond.skimmers || ''}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Depth (m):
                    <input
                        type="number"
                        name="depth"
                        value={pond.pumpingCapacity || ''}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <label>
                    Depth (m):
                    <input
                        type="text"
                        name="depth"
                        value={pond.waterSource || ''}
                        onChange={handleInputChange}
                        required
                    />
                </label>
                <button type="submit">Update Pond</button>
            </form>
        </div>
    );
};

export default EditPondPage;
