import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./ListKoiFishPage.scss";

const ListKoiFishPage = () => {
    const [koiFishList, setKoiFishList] = useState([]);
    const [selectedPond, setSelectedPond] = useState('');
    const [ponds, setPonds] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedKoi, setSelectedKoi] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPond, setNewPond] = useState('');


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
                const response = await axios.get('http://170.64.198.85:8080/user/pond', config);
                setPonds(response.data.pondList || []);
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
            const response = await axios.get('http://170.64.198.85:8080/user/koi', config);
            const koiList = response.data.koiList || [];

            if (koiList.length === 0) {
                setMessage('No koi fish found.');
            } else {
                setMessage('');
            }
            setKoiFishList(koiList);
        } catch (error) {
            console.error('Error fetching koi fish', error);
            setMessage('No koi fish in this pond.');
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
            const response = await axios.get(`http://170.64.198.85:8080/user/koi/${pondId}`, config);
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
        }else{
            fetchAllKoiFish();
        }
    };

    const handleDeleteKoi = async (koiId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this Koi fish?');
        if (!confirmDelete) {
            return;
        }

        let pondId = selectedPond;
        if (!pondId) {
            const deleteWithoutKoiId = koiFishList.find(koi => koi.koiId === koiId);
            if(!deleteWithoutKoiId){
                alert("Koi fish not found");
                return;
            }
            pondId = deleteWithoutKoiId.pondId?.id;
            if (!pondId) {
                alert("Pond ID not found for the selected koi.");
                return;
            }
        }

        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            if (selectedPond) {
                await axios.delete(`http://170.64.198.85:8080/user/${selectedPond}/${koiId}/delete`, config);
            } else {
                await axios.delete(`http://170.64.198.85:8080/user/delete/${koiId}`, config);
            }

            alert('Koi fish deleted successfully!');
            setKoiFishList((prevList) => prevList.filter((koi) => koi.koiId !== koiId));
            if (koiFishList.length === 0) {
                setMessage('No koi fish found.');
            }
        } catch (error) {
            console.error('Error deleting koi fish', error);
            alert('Failed to delete koi fish.');
        }
    };

    const handleKoiSelection = (koiId) => {
        setSelectedKoi((prevState) =>
            prevState.includes(koiId) ? prevState.filter((id) => id !== koiId) : [...prevState, koiId]
        );
    };

    const handleMoveFish = async () => {
        if (!selectedPond) {
            alert('Please select a pond before moving the fish.');
            return;
        }

        if (!newPond) {
            alert('Please select a new pond to move the fish.');
            return;
        }

        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };

            const params = new URLSearchParams();
            params.append('oldPond', selectedPond);
            params.append('newPond', newPond);
            selectedKoi.forEach(id => params.append('koiList', id));

            await axios.post('http://170.64.198.85:8080/user/pond/moveManyFish', null,
                {
                    params,
                    headers: config.headers,
                }
            );

            alert('Fish moved successfully!');
            setIsModalOpen(false);
            setSelectedKoi('');
            fetchAllKoiFish();
            window.location.reload();
        } catch (error) {
            console.error('Error moving koi fish', error);
            alert('Failed to move koi fish.');
        }
    };

    const handleMoveFishButtonClick = () => {
        if (!selectedPond) {
            alert('Please select a pond first before moving the fish.');
            return;
        }

        setIsModalOpen(true);
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

            {!message ? (
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

                                <div className={`koi-action`}>
                                    <Link to={`/list-koi/${koi.koiId}`}>
                                        <button className="details-koi-button">Detail</button>
                                    </Link>
                                    <button className="delete-koi-button"
                                            onClick={() => handleDeleteKoi(koi.koiId)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
            <button onClick={handleMoveFishButtonClick} className="move-fish-button">
                Move Koi Fish
            </button>
            <Link to="/add-koi">
                <button className="add-koi-button">Add New Koi Fish</button>
            </Link>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Select Pond and Fish to Move</h2>
                        <label>Select New Pond:</label>
                        <select value={newPond} onChange={(e) => setNewPond(e.target.value)}>
                            <option value="">-- Select a Pond --</option>
                            {ponds.map((pond) => (
                                <option key={pond.id} value={pond.id}>
                                    Pond {pond.pondName}
                                </option>
                            ))}
                        </select>
                        <div className="koi-list-to-move">
                            {koiFishList.map((koi) => (
                                <div key={koi.koiId} className="koi-fish-item">
                                    <input
                                        type="checkbox"
                                        checked={selectedKoi.includes(koi.koiId)}
                                        onChange={() => handleKoiSelection(koi.koiId)}
                                    />
                                    <label>{koi.koiName} (Pond: {koi.pondId?.pondName || 'Unknown'})</label>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleMoveFish}>Move Selected Fish</button>
                        <button onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListKoiFishPage;
