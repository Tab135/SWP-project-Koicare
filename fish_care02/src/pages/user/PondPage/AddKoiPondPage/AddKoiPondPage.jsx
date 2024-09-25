import React, { useState } from 'react';
import axios from 'axios';
import './AddKoiPondPage.css';

const AddKoiPondPage = ({ userId }) => {
    const [pond, setPond] = useState({
        name: '',
        depth: '',
        drain: '',
        location: '',
        number_of_fish: '',
        picture: '',
        pumping_capacity: '',
        skimmers: '',
        volume: '',
        water_source: ''
    });

    const handleChange = (e) => {
        setPond({
            ...pond,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/user/createPond/${userId}`, pond);
            alert('Pond added successfully!');
        } catch (error) {
            console.error('Error adding pond', error);
            alert('Failed to add pond.');
        }
    };

    return (
        <div className="pond-form-container">
            <h1>Create New Pond</h1>
            <div className="image-upload">select image</div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={pond.name} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Depth:</label>
                    <input type="number" name="depth" value={pond.depth} onChange={handleChange} required/>
                    <label>Volume:</label>
                    <input type="number" name="volume" value={pond.volume} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Drain:</label>
                    <input type="number" name="drain" value={pond.drain} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Pumping Capacity:</label>
                    <input type="number" name="pumping_capacity" value={pond.pumping_capacity} onChange={handleChange}
                           required/>
                </div>
                <div>
                    <label>Select Image:</label>
                    <input type="text" name="picture" value={pond.picture} onChange={handleChange}/>
                </div>
                <button type="submit">Add Pond</button>
            </form>
        </div>
    );
};

export default AddKoiPondPage;
