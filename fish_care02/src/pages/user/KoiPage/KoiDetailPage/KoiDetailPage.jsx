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
    const [koiEditData, setKoiEditData] = useState({
        koiName: '',
        variety: '',
        age: '',
        sex: '',
        price: '',
        origin: '',
        image: '',
        pondId: '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [ponds, setPond] = useState([]);
    const [canAddGrowthRecord, setCanAddGrowthRecord] = useState(true);

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
                console.log(response.data.koi);
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
                    headers: {Authorization: `Bearer ${token}`}
                };
                const response = await axios.get(`http://localhost:8080/user/${koiId}/records`, config);
                setGrowthRecords(response.data.growthRecordList);
            } catch (error) {
                console.error('Error fetching growth records', error);
                setErrorMessage('Failed to fetch growth records.');
            }
        }
            const fetchPonds = async () => {
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
                    const response = await axios.get(`http://localhost:8080/user/pond`, config)
                    setPond(response.data.pondList);
                    console.log(response.data.pondList);
                } catch (error) {
                    console.error('Error fetching ponds', error);
                    setErrorMessage('Failed to fetch ponds.');
                }

        };

        fetchKoiDetails();
        fetchGrowthRecords();
        fetchPonds();
    }, [koiId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['length', 'weight'].includes(name)) {
            if (value < 0) {
                alert(`${name.charAt(0).toUpperCase() + name.slice(1)} parameter cannot be less than 0.`);
                return;
            }
        }
        setGrowthRecord({
            ...growthRecord,
            [name]: value
        });
    };

    const handleKoiInputChange = (e) => {
        const { name, value } = e.target;
        if (['age', 'price'].includes(name)) {
            if (value < 0) {
                alert(`${name.charAt(0).toUpperCase() + name.slice(1)} parameter cannot be less than 0.`);
                return;
            }
        }
        setKoiEditData({
            ...koiEditData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            handleKoiInputChange(e);
        }
    };

    const resetImage = () => {
        setSelectedImage(null);
    };

    const handleKoiSubmit = async (e) => {
        e.preventDefault();

        let token = localStorage.getItem('token');
        if (!token) {
            token = sessionStorage.getItem('token');
        }

        const formData = new FormData();
        formData.append('koiName', koiEditData.koiName);
        formData.append('variety', koiEditData.variety);
        formData.append('age', koiEditData.age);
        formData.append('sex', koiEditData.sex);
        formData.append('price', koiEditData.price);
        formData.append('origin', koiEditData.origin);
        formData.append('pondId', koiEditData.pondId);

        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        };

        const pondId = koiDetails.pondId.id;

        try {
            await axios.put(`http://localhost:8080/user/${pondId}/${koiId}`, formData, config);
            alert('Koi details updated successfully');
            setShowKoiModal(false);
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

        const dateExists = growthRecords.some(record =>
            new Date(record.koiId.date).toDateString() === new Date(growthRecord.date).toDateString()
        )

        if (dateExists && !editMode) {
            alert("This date has already been added. Please select a different date.");
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
            resetGrowthRecordForm();
            setEditMode(false);
            setCurrentRecordId(null);
            setCurrentRecordDate(null);
            window.location.reload();
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

    const handleSelectPond = (e) => {
        const selectedPondId = e.target.value;
        setKoiEditData({ ...koiEditData, pondId: selectedPondId });
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

        console.log(growthRecords, "koi")
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
                            <p><strong>Koi Name:</strong> {koiDetails.koiName}</p>
                            <p><strong>Variety:</strong> {koiDetails.variety}</p>
                            <p><strong>Length:</strong> {koiDetails.length} cm</p>
                            <p><strong>Age:</strong> {koiDetails.age} years</p>
                            <p><strong>Weight:</strong> {koiDetails.weight} g</p>
                            <p><strong>Sex:</strong> {koiDetails.sex}</p>
                        </div>
                        <div className="koi-info-column">
                            <p><strong>Pond:</strong> {koiDetails.pondId.pondName}</p>
                            <p><strong>Price:</strong> {koiDetails.price} VND</p>
                            <p><strong>Physique:</strong> {koiDetails.physique}</p>
                            <p><strong>In Pond Since:</strong> {new Date(koiDetails.inPondSince).toLocaleDateString()}
                            </p>
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
                                {growthRecords.slice().reverse().map((record, index) => {
                                    const isNegativeRate = record.weightRate < 0 || record.lengthRate < 0;

                                    return (
                                        <li
                                            key={record.koiId.date}
                                            className={isNegativeRate ? "record-negative" : "record-positive"}>
                                            <div>
                                                <strong>Date:</strong> {new Date(record.koiId.date).toLocaleDateString()}
                                            </div>

                                            <div className="record-details">
                                                <div>
                                                    <strong>Pond:</strong> {record.pondId.pondName}
                                                </div>
                                                <div>
                                                    <strong>Length:</strong> {record.length} cm
                                                </div>
                                                <div>
                                                    <strong>Weight:</strong> {record.weight} g
                                                </div>
                                            </div>
                                            <div className="record-details">
                                                <div>
                                                    <strong>Physique:</strong> {record.physique}
                                                </div>
                                                <div>
                                                    <strong>Weight
                                                        Rate:</strong> {record.weightRate ? record.weightRate.toFixed(2) + '%' : '0'}
                                                </div>
                                                <div>
                                                    <strong>Length
                                                        Rate:</strong> {record.lengthRate ? record.lengthRate.toFixed(2) + '%' : '0'}
                                                </div>
                                            </div>

                                            {isNegativeRate && (
                                                <p className="warning-message">Your fish is unstable and needs checking.</p>
                                            )}

                                            <div className="button-container">
                                                <button className="edit-koi-button"
                                                        onClick={() => handleEdit(record)}>Edit
                                                </button>
                                                {index !== 0 && (
                                                    <button className="delete-button"
                                                            onClick={() => handleDelete(record)}>Delete
                                                    </button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p>No growth records available.</p>
                        )}
                    </div>
                    <div className="Add-Growth">
                        <button onClick={handleAddGrowthRecord}>Add Growth Record</button>
                    </div>
                    <div className="Back-to-list">
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
                                {!editMode && (
                                    <>
                                        <label>Date:</label>
                                        <input type="date" name="date" value={growthRecord.date}
                                               onChange={handleInputChange} required
                                               min={new Date(koiDetails.inPondSince).toISOString().split("T")[0]}
                                               max={new Date().toISOString().split("T")[0]} />
                                    </>
                                )}
                                <label>
                                    Length (cm):
                                    <input type="number" name="length" value={growthRecord.length}
                                           onChange={handleInputChange} required/>
                                </label>
                                <label>
                                    Weight (g):
                                    <input type="number" name="weight" value={growthRecord.weight}
                                           onChange={handleInputChange} required/>
                                </label>
                                <label>
                                    Physique:
                                    <select name="physique" value={growthRecord.physique} onChange={handleInputChange}
                                            required>
                                        <option value="" disabled>Select a physique</option>
                                        <option value="Slim">Slim</option>
                                        <option value="Normal">Normal</option>
                                        <option value="Corpulent">Corpulent</option>
                                    </select>
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
                                    <img
                                        src={selectedImage || `data:image/jpeg;base64,${koiDetails.image}`}
                                        alt={koiDetails.koiName}
                                        className="koi-edit-image-preview"
                                    />
                                </label>
                                <div className="change-image-container">
                                    <label htmlFor="image-upload" className="change-image-button">
                                        Change Image
                                    </label>
                                    <input type="file" id="image-upload" name="image" accept="image/*"
                                           onChange={handleImageChange}
                                        style={{display: 'none'}}
                                    />
                                    {selectedImage && (
                                        <button type="button" onClick={resetImage} className="reset-image-button">
                                            Reset Image
                                        </button>
                                    )}
                                </div>
                                <label>
                                    Koi Name:
                                    <input type="text" name="koiName" value={koiEditData.koiName || ''}
                                           onChange={handleKoiInputChange} required/>
                                </label>
                                <label>
                                    Variety:
                                    <input type="text" name="variety" value={koiEditData.variety || ''}
                                           onChange={handleKoiInputChange} required/>
                                </label>
                                <label>
                                    Age (years):
                                    <input type="number" name="age" value={koiEditData.age || ''}
                                           onChange={handleKoiInputChange} required/>
                                </label>
                                <label>
                                    Sex:
                                    <input type="text" name="sex" value={koiEditData.sex || ''}
                                           onChange={handleKoiInputChange} required/>
                                </label>
                                <label>
                                    Price (VND):
                                    <input type="number" name="price" value={koiEditData.price || ''}
                                           onChange={handleKoiInputChange} required/>
                                </label>
                                <label>
                                    Origin:
                                    <input type="text" name="origin" value={koiEditData.origin || ''}
                                           onChange={handleKoiInputChange} required/>
                                </label>
                                <label>
                                    Pond:
                                    <select value={koiEditData.pondId} onChange={handleSelectPond} required>
                                        <option value="" disabled>Select a pond</option>
                                        {ponds.map((pond) => (
                                            <option key={pond.id} value={pond.id}>
                                                {pond.pondName}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <button type="submit">Save Changes</button>
                                <button type="button" onClick={() => setShowKoiModal(false)}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
};

export default KoiDetailPage;
