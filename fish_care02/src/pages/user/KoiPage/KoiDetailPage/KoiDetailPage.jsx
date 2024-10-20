    import React, { useEffect, useState } from 'react';
    import axios from 'axios';
    import {useNavigate, useParams} from 'react-router-dom';
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
                const token = localStorage.getItem('token');
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
                    setKoiEditData(response.data.koi); // Initialize Koi edit data
                } catch (error) {
                    console.error('Error fetching koi details', error);
                    setErrorMessage('Failed to fetch koi details.');
                }
            };

            const fetchGrowthRecords = async () => {
                const token = localStorage.getItem('token');
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

            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            try {
                await axios.put(`http://localhost:8080/user/koi/update/${koiId}`, koiEditData, config);
                alert('Koi details updated successfully');
                setShowKoiModal(false);
                // Refetch koi details after updating
                const response = await axios.get(`http://localhost:8080/user/koi/detail/${koiId}`, config);
                setKoiDetails(response.data.koi);
            } catch (error) {
                console.error('Error updating koi details', error);
                alert('Failed to update koi details');
            }
        };

        const resetGrowthRecordForm = () => {
            setGrowthRecord({
                length: '',
                weight: '',
                physique: '',
                date: new Date().toISOString().split('T')[0],
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!growthRecord.date) {
                alert('Please enter a valid date.');
                return;
            }

            const token = localStorage.getItem('token');
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
                resetGrowthRecordForm();
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

        const handleAddGrowthRecord = () => {
            resetGrowthRecordForm();
            setEditMode(false);
            setShowGrowthModal(true);
        };

        const handleDelete = async (record) => {
            if (!window.confirm('Are you sure you want to delete this record?')) {
                return;
            }

            const token = localStorage.getItem('token');
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

        if (!koiDetails) {
            return (
                <div className="koi-detail-container">
                    <h1>Koi Fish Details</h1>
                    {errorMessage ? <p>{errorMessage}</p> : <p>Loading Koi details...</p>}
                </div>
            );
        }

        const handleBackToList = () => {
            navigate("/list-koi");
        };

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
                        <button className="edit-koi-button" onClick={() => setShowKoiModal(true)}>
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
                                            <strong>Date:</strong> {new Date(record.koiId.date).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <strong>Length:</strong> {record.length} cm
                                        </div>
                                        <div>
                                            <strong>Weight:</strong> {record.weight} kg
                                        </div>
                                        <div>
                                            <strong>Physique:</strong> {record.physique}
                                        </div>
                                        <div className="button-container">
                                            <button className="edit-koi-button" onClick={() => handleEdit(record)}>Edit
                                            </button>
                                            <button className="delete-button" onClick={() => handleDelete(record)}>Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No growth records available.</p>
                        )}
                        <button className="Add-Growth" onClick={handleAddGrowthRecord}>
                            Add Growth Record
                        </button>
                        <button className="back-to-list-button" onClick={handleBackToList}>
                            Back to List
                        </button>
                    </div>
                </div>

                {showGrowthModal && (
                    <div className="modal">
                        <div className="modal-content-koi">
                            <h2>{editMode ? 'Edit Growth Record' : 'Add Growth Record'}</h2>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Length (cm):
                                    <input type="number" name="length" value={growthRecord.length}
                                           onChange={handleInputChange} required/>
                                </label>
                                <label>
                                    Weight (kg):
                                    <input type="number" name="weight" value={growthRecord.weight}
                                           onChange={handleInputChange} required/>
                                </label>
                                <label>
                                Physique:
                                    <input type="text" name="physique" value={growthRecord.physique} onChange={handleInputChange} required />
                                </label>
                                <label>
                                    Date:
                                    <input type="date" name="date" value={growthRecord.date} onChange={handleInputChange} required />
                                </label>
                                <button type="submit">{editMode ? 'Update Record' : 'Add Record'}</button>
                                <button type="button" onClick={() => setShowGrowthModal(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}

                {showKoiModal && (
                    <div className="modal">
                        <div className="modal-content-edit-koi">
                            <h2>Edit Koi Details</h2>
                            <form onSubmit={handleKoiSubmit}>
                                <label>
                                    Koi Name:
                                    <input type="text" name="koiName" value={koiEditData.koiName || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <label>
                                    Length (cm):
                                    <input type="number" name="length" value={koiEditData.length || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <label>
                                    Weight (kg):
                                    <input type="number" name="weight" value={koiEditData.weight || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <label>
                                    Variety:
                                    <input type="text" name="variety" value={koiEditData.variety || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <label>
                                    Age (years):
                                    <input type="number" name="age" value={koiEditData.age || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <label>
                                    Sex:
                                    <input type="text" name="sex" value={koiEditData.sex || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <label>
                                    Price ($):
                                    <input type="number" name="price" value={koiEditData.price || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <label>
                                    Physique:
                                    <input type="text" name="physique" value={koiEditData.physique || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <label>
                                    Origin:
                                    <input type="text" name="origin" value={koiEditData.origin || ''} onChange={handleKoiInputChange} required />
                                </label>
                                <button type="submit">Update Koi Details</button>
                                <button type="button" onClick={() => setShowKoiModal(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    export default KoiDetailPage;
