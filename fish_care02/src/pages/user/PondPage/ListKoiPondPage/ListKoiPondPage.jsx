import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListKoiPondPage.css';

const PondListPage = () => {
    const [ponds, setPonds] = useState([]);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchPonds = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:8080/user/pond', config);
                setPonds(response.data.pondList);
            } catch (error) {
                console.error("Error fetching ponds", error);
                setError("Could not fetch ponds.");
            }
        };

        fetchPonds();
    }, []);

    const handleAddPond = () => {
        window.location.href = "/add-pond";
    };

    const handleDeletePond = async (pondId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this pond?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const response = await axios.delete(`http://localhost:8080/user/pond/${pondId}`, config);

            if (response.status === 200) {
                setPonds(prevPonds => prevPonds.filter(pond => pond.id !== pondId));
                setSuccessMessage("Pond deleted successfully!");
            } else {
                setError("Could not delete pond.");
            }
        } catch (error) {
            console.error("Error deleting pond", error);
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="pond-list-container">
            <h1>My Koi Ponds</h1>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <div className="pond-grid">
                {Array.isArray(ponds) && ponds.length > 0 ? (
                    ponds.map((pond) => (
                        <div key={pond.id} className="pond-card">
                            <img
                                src={pond.picture || ''}
                                alt={pond.pondName}
                                className="pond-image"
                            />
                            <div className="pond-details">
                                <p><strong>Pond Name:</strong> {pond.pondName}</p>
                                <p><strong>Depth:</strong> {pond.depth} m</p>
                                <p><strong>Volume:</strong> {pond.volume} L</p>
                                <p><strong>Drain:</strong> {pond.drain}</p>
                                <p><strong>Location:</strong> {pond.location}</p>
                                <p><strong>Number of Fish:</strong> {pond.numberOfFish}</p>
                                <p><strong>Skimmers:</strong> {pond.skimmers}</p>
                                <p><strong>Pumping Capacity:</strong> {pond.pumpingCapacity} W</p>
                                <p><strong>Water Source:</strong> {pond.waterSource}</p>
                                <button
                                    className="delete-pond-button"
                                    onClick={() => handleDeletePond(pond.id)}>
                                    Delete Pond
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No ponds available.</p>
                )}
                <div className="pond-card add-new-pond" onClick={handleAddPond}>
                    <div className="add-icon">+</div>
                    <p>Add new pond</p>
                </div>
            </div>
        </div>
    );
};

export default PondListPage;
