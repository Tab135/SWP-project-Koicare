import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListKoiPondPage.css';

const PondListPage = ({ userId }) => {
    const [ponds, setPonds] = useState([]);

    useEffect(() => {
        // Fetch the ponds when the component loads
        const fetchPonds = async () => {
            try {
                const response = await axios.get(`/user/getPonds/${userId}`);
                setPonds(response.data);
            } catch (error) {
                console.error("Error fetching ponds", error);
            }
        };

        fetchPonds();
    }, [userId]);

    const handleAddPond = () => {
        // Redirect to the add pond page or open a form for adding a new pond
        window.location.href = "/add-pond";
    };

    return (
        <div className="pond-list-container">
            <h1>My Pond</h1>
            <div className="pond-grid">
                {ponds.map((pond) => (
                    <div key={pond.id} className="pond-card">
                        <img src={pond.picture} alt={`${pond.name}`} className="pond-image" />
                        <div className="pond-details">
                            <p><strong>Name:</strong> {pond.name}</p>
                            <p><strong>Number of Fish:</strong> {pond.number_of_fish}</p>
                            <p><strong>Volume:</strong> {pond.volume}l</p>
                            <p><strong>Depth:</strong> {pond.depth}m</p>
                            <p><strong>Pumping Cap:</strong> {pond.pumping_capacity}w</p>
                        </div>
                    </div>
                ))}
                <div className="pond-card add-new-pond" onClick={handleAddPond}>
                    <div className="add-icon">+</div>
                    <p>Add new pond</p>
                </div>
            </div>
        </div>
    );
};

export default PondListPage;
