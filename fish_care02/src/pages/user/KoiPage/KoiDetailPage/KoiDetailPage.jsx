import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './KoiDetailPage.scss';

const KoiDetailPage = () => {
    const { koiId } = useParams();
    const navigate = useNavigate();
    const [koiDetails, setKoiDetails] = useState(null);
    const [growthRecords, setGrowthRecords] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showGrowthModal, setShowGrowthModal] = useState(false);
    const [showKoiModal, setShowKoiModal] = useState(false);
    const [growthRecord, setGrowthRecord] = useState({
        length: '',
        weight: '',
        physique: '',
        date: new Date().toISOString().split('T')[0],
    });
    const [editMode, setEditMode] = useState(false);
    const [currentRecordId, setCurrentRecordId] = useState(null);
    const [currentRecordDate, setCurrentRecordDate] = useState(null);
    const [koiEditData, setKoiEditData] = useState({});

    useEffect(() => {
        const fetchKoiDetails = async () => {
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
                    headers: { Authorization: `Bearer ${token}` }
                };
                const response = await axios.get(`http://localhost:8080/user/koi/detail/${koiId}`, config);
                setKoiDetails(response.data.koi);
                setKoiEditData(response.data.koi);
            } catch (error) {
                console.error('Error fetching koi details', error);
                setErrorMessage('Failed to fetch koi details.');
            }
        };

        const fetchGrowthRecords = async () => {
            let token = localStorage.getItem('token');
            if (!token) {
                token = sessionStorage.getItem('token');
            }
            if (!token) {
                return;
            }

            try {
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const response = await axios.get(`http://localhost:8080/user/${koiId}/records`, config);
                setGrowthRecords(response.data.growthRecordList);
            } catch (error) {
                console.error('Error fetching growth records', error);
                setErrorMessage('Failed to fetch growth records.');
            }
        };

        fetchKoiDetails();
        fetchGrowthRecords();
    }, [koiId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGrowthRecord({
            ...growthRecord,
            [name]: value
        });
    };

    const handleKoiInputChange = (e) => {
        const { name, value } = e.target;
        setKoiEditData({
            ...koiEditData,
            [name]: value
        });
    };

    const handleKoiSubmit = async (e) => {
        e.preventDefault();

        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            await axios.put(`http://localhost:8080/user/koi/update/${koiId}`, koiEditData, config);
            alert('Koi details updated successfully');
            setShowKoiModal(false);
            const response = await axios.get(`http://localhost:8080/user/koi/detail/${koiId}`, config);
            setKoiDetails(response.data.koi);
        } catch (error) {
            console.error('Error updating koi details', error);
            alert('Failed to update koi details');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!growthRecord.date) {
            alert('Please enter a valid date.');
            return;
        }

        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            if (editMode) {
                await axios.put(`http://localhost:8080/user/${koiId}/record/update/${currentRecordDate}`, growthRecord, config);
                alert('Growth record updated successfully');
            } else {
                await axios.post(`http://localhost:8080/user/${koiId}/addRecord`, growthRecord, config);
                alert('Growth record added successfully');
            }
            setShowGrowthModal(false);
            setGrowthRecord({
                length: '',
                weight: '',
                physique: '',
                date: new Date().toISOString().split('T')[0],
            });
            setEditMode(false);
            setCurrentRecordId(null);
            setCurrentRecordDate(null);
            const response = await axios.get(`http://localhost:8080/user/${koiId}/records`, config);
            setGrowthRecords(response.data.growthRecordList);
        } catch (error) {
            console.error('Error saving growth record', error);
            alert('Failed to save growth record');
        }
    };

    const handleEdit = (record) => {
        const parsedDate = new Date(record.koiId.date);
        if (isNaN(parsedDate.getTime())) {
            console.error("Invalid date:", record.koiId.date);
            alert('Invalid date format');
            return;
        }

        setGrowthRecord({
            length: record.length,
            weight: record.weight,
            physique: record.physique,
            date: parsedDate.toISOString().split('T')[0],
        });
        setCurrentRecordId(record.koiId.date);
        setCurrentRecordDate(record.koiId.date);
        setEditMode(true);
        setShowGrowthModal(true);
    };

    const handleDelete = async (record) => {
        if (!window.confirm('Are you sure you want to delete this record?')) {
            return;
        }

        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };

        try {
            await axios.delete(`http://localhost:8080/user/${koiId}/record/delete/${record.koiId.date}`, config);
            alert('Growth record deleted successfully');
            const response = await axios.get(`http://localhost:8080/user/${koiId}/records`, config);
            setGrowthRecords(response.data.growthRecordList);
        } catch (error) {
            console.error('Error deleting growth record', error);
            alert('Failed to delete growth record');
        }
    };

    const handleBackToList = () => {
        navigate("/list-koi");
    };

    if (!koiDetails) {
        return (
            <div className="koi-detail-container">
                <h1>Koi Fish Details</h1>
                {errorMessage ? <p>{errorMessage}</p> : <p>Loading Koi details...</p>}
            </div>
        );
    }

    return (
        <div className="koi-detail-container">
            <h1>Koi Fish Details</h1>
            <div className="koi-detail-card">
                <img
                    src={`data:image/jpeg;base64,${koiDetails.image}`}
                    alt={koiDetails.koiName}
                    className="koi-detail-image"
                />
                <div className="koi-info-grid">
                    <div className="koi-info-column">
                        <p><strong>Variety:</strong> {koiDetails.variety}</p>
                        <p><strong>Length:</strong> {koiDetails.length} cm</p>
                        <p><strong>Age:</strong> {koiDetails.age} years</p>
                        <p><strong>Weight:</strong> {koiDetails.weight} kg</p>
                        <p><strong>Sex:</strong> {koiDetails.sex}</p>
                    </div>
                    <div className="koi-info-column">
                        <p><strong>Price:</strong> ${koiDetails.price}</p>
                        <p><strong>Physique:</strong> {koiDetails.physique}</p>
                        <p><strong>In Pond Since:</strong> {new Date(koiDetails.inPondSince).toLocaleDateString()}</p>
                        <p><strong>Breeder:</strong> {koiDetails.breeder}</p>
                        <p><strong>Origin:</strong> {koiDetails.origin}</p>
                    </div>
                </div>
                <div className="edit-koi-button-container">
                    <button className="edit-koidetail-button" onClick={() => setShowKoiModal(true)}>
                        Edit Koi Details
                    </button>
                </div>
                <div className="growth-records">
                    <h2>Growth Records</h2>
                    {growthRecords.length > 0 ? (
                        <ul>
                            {growthRecords.map((record) => (
                                <li key={record.koiId.date}>
                                    <div>
                                        <strong>Date:</strong> {new Date(record.koiId.date).toLocaleDateString()}<br />
                                        <strong>Length:</strong> {record.length} cm<br />
                                        <strong>Weight:</strong> {record.weight} kg<br />
                                        <strong>Physique:</strong> {record.physique}<br />
                                    </div>
                                    <div className="record-actions">
                                        <button onClick={() => handleEdit(record)}>Edit</button>
                                        <button onClick={() => handleDelete(record)}>Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No growth records available.</p>
                    )}
                    <button className="add-record-button" onClick={() => setShowGrowthModal(true)}>
                        Add Growth Record
                    </button>
                </div>
                <button className="back-button" onClick={handleBackToList}>Back to List</button>
            </div>
        </div>
    );
};

export default KoiDetailPage;
