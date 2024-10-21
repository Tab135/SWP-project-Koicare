import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./ListKoiFishPage.scss";

const ListKoiFishPage = () => {
    const [koiFishList, setKoiFishList] = useState([]);
    const [selectedPond, setSelectedPond] = useState('');
    const [ponds, setPonds] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPonds = async () => {
            let token = localStorage.getItem('token');
            if (!token) {
                token = sessionStorage.getItem('token');
            }
            if (!token) {
                alert('Please login to view the Koi details.');
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` },
                };
                const response = await axios.get('http://localhost:8080/user/pond', config);
                setPonds(response.data.pondList);
            } catch (error) {
                console.error('Error fetching ponds', error);
            }
        };

        fetchPonds();

        fetchAllKoiFish();
    }, []);

    const fetchAllKoiFish = async () => {
        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        if (!token) {
            alert('Please login to view the fish.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get('http://localhost:8080/user/koi', config);
            const koiList = response.data.koiList;

            if (koiList.length === 0) {
                setMessage('No koi fish found.');
            } else {
                setMessage('');
            }
            setKoiFishList(koiList);
        } catch (error) {
            console.error('Error fetching koi fish', error);
            setMessage('Error fetching koi fish.');
        }
    };

    const fetchKoiFish = async (pondId) => {
        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        if (!token) {
            alert('Please login to view the fish.');
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const response = await axios.get(`http://localhost:8080/user/koi/${pondId}`, config);
            const koiList = response.data.koiList;

            if (koiList.length === 0) {
                setMessage('No koi fish found for this pond.');
            } else {
                setMessage('');
            }
            setKoiFishList(koiList);
        } catch (error) {
            console.error('Error fetching koi fish', error);
            setMessage('Error fetching koi fish.');
        }
    };

    const handlePondChange = (e) => {
        const pondId = e.target.value;
        setSelectedPond(pondId);
        if (pondId) {
            fetchKoiFish(pondId);
            fetchAllKoiFish();
        }
    };

    const handleDeleteKoi = async (koiId) => {
        if (!selectedPond) {
            alert('Please select a pond before deleting a Koi fish.');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            await axios.delete(`http://localhost:8080/user/${selectedPond}/${koiId}/delete`, config);
            alert('Koi fish deleted successfully!');

            const updatedKoiList = koiFishList.filter(koi => koi.koiId !== koiId);
            setKoiFishList(updatedKoiList);

            if (updatedKoiList.length === 0) {
                setMessage('No koi fish found for this pond.');
            }
        } catch (error) {
            console.error('Error deleting koi fish', error);
            alert('Failed to delete koi fish.');
        }
    };

    return (
        <div className="koi-fish-list-container">
            <h1>Koi Fish List</h1>
            <div className="pond-select">
                <label>Select Pond:</label>
                <select value={selectedPond} onChange={handlePondChange}>
                    <option value="">-- Select a Pond --</option>
                    {ponds.map((pond) => (
                        <option key={pond.id} value={pond.id}>
                            Pond {pond.pondName}
                        </option>
                    ))}
                </select>
            </div>

            {message && <p>{message}</p>}

            {koiFishList.length > 0 && !message ? (
                <div className="koi-fish-list">
                    {koiFishList.map((koi) => (
                        <div key={koi.koiId} className="koi-fish-card">
                            <img
                                src={`data:image/jpeg;base64,${koi.image}`}
                                alt={koi.koiName}
                                className="koi-fish-image"
                            />
                            <div className="koi-fish-info">
                                <h3>{koi.koiName}</h3>
                                <p><strong>Variety:</strong> {koi.variety}</p>
                                <p><strong>Length: </strong> {koi.length} cm</p>
                                <p><strong>Age:</strong> {koi.age} years</p>

                                <div className={`koi-actions ${koiFishList.length === 1 ? 'single-button' : ''}`}>
                                    <Link to={`/list-koi/${koi.koiId}`}>
                                        <button className="details-koi-button">Detail</button>
                                    </Link>

                                    {koiFishList.length > 1 && (
                                        <button className="delete-koi-button"
                                                onClick={() => handleDeleteKoi(koi.koiId)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}

            <Link to="/add-koi">
                <button className="add-koi-button">Add New Koi Fish</button>
            </Link>
        </div>
    );
};

export default ListKoiFishPage;
