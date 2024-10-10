import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './AddKoiFishPage.css';

const AddKoiFishPage = () => {
    const [koiFish, setKoiFish] = useState({
        koiName: '',
        age: '',
        weight: '',
        length: '',
        variety: '',
        sex: '',
        feedingSchedule: '',
        lastMedicalCheck: '',
        price: '',
        physique: '',
        inPondSince: '',
        breeder: '',
        origin: ''
    });

    const [ponds, setPonds] = useState([]);
    const [selectedPond, setSelectedPond] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isImageUploaded, setIsImageUploaded] = useState(false);

    useEffect(() => {
        const fetchPonds = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to add a fish.');
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:8080/user/pond', config);
                setPonds(response.data.pondList);
            } catch (error) {
                console.error("Error fetching ponds", error);
            }
        };

        fetchPonds();
    }, []);

    const handleChange = (e) => {
        setKoiFish({
            ...koiFish,
            [e.target.name]: e.target.value
        });
    };

    const handlePondChange = (e) => {
        setSelectedPond(e.target.value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
        setIsImageUploaded(true);
    };

    const handleDeleteImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsImageUploaded(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedPond) {
            alert('Please select a pond.');
            return;
        }

        const formData = new FormData();
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        Object.keys(koiFish).forEach(key => {
            formData.append(key, koiFish[key]);
        });
        formData.append('pondId', selectedPond);

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to add a fish.');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const userId = decodedToken.userId;

            const config = {
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                },
            };

            const response = await axios.post(`http://localhost:8080/user/${selectedPond}/addKoi`, formData, config);

            if (response.status === 200) {
                alert('Koi fish added successfully!');
            } else {
                alert('Failed to add koi fish.');
            }
        } catch (error) {
            console.error('Error adding koi fish: ', error);
            alert('Failed to add koi fish.');
        }
    };

    return (
        <div className="fish-form-container">
            <h1>Create New Koi Fish</h1>
            <div className="image-upload-container">
                {isImageUploaded ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="image-preview" />
                        <button
                            type="button"
                            className="change-image-button"
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                            Change Image
                        </button>
                        <button
                            type="button"
                            className="delete-image-button"
                            onClick={handleDeleteImage}
                        >
                            Delete Image
                        </button>
                    </>
                ) : (
                    <div className="image-upload" onClick={() => document.querySelector('input[type="file"]').click()}>
                        Select Image
                    </div>
                )}
                <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                />
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div>
                    <label>Koi Name:</label>
                    <input type="text" name="koiName" value={koiFish.koiName} onChange={handleChange} required />
                </div>
                <div>
                    <label>Age:</label>
                    <input type="number" name="age" value={koiFish.age} onChange={handleChange} required />
                </div>
                <div>
                    <label>Weight:</label>
                    <input type="number" name="weight" value={koiFish.weight} onChange={handleChange} required />
                </div>
                <div>
                    <label>Length:</label> {/* Added length input */}
                    <input type="number" name="length" value={koiFish.length} onChange={handleChange} required />
                </div>
                <div>
                    <label>Variety:</label>
                    <input type="text" name="variety" value={koiFish.variety} onChange={handleChange} required />
                </div>
                <div>
                    <label>Sex:</label>
                    <select name="sex" value={koiFish.sex} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div>
                    <label>Feeding Schedule:</label>
                    <input type="text" name="feedingSchedule" value={koiFish.feedingSchedule} onChange={handleChange} required />
                </div>
                <div>
                    <label>Price:</label>
                    <input type="number" name="price" value={koiFish.price} onChange={handleChange} required />
                </div>
                {/* Additional fields */}
                <div>
                    <label>Physique:</label>
                    <input type="text" name="physique" value={koiFish.physique} onChange={handleChange} required />
                </div>
                <div>
                    <label>In Pond Since:</label>
                    <input type="date" name="inPondSince" value={koiFish.inPondSince} onChange={handleChange} required />
                </div>
                <div>
                    <label>Breeder:</label>
                    <input type="text" name="breeder" value={koiFish.breeder} onChange={handleChange} required />
                </div>
                <div>
                    <label>Origin:</label>
                    <input type="text" name="origin" value={koiFish.origin} onChange={handleChange} required />
                </div>

                <div>
                    <label>Select Pond:</label>
                    <select name="pondId" value={selectedPond} onChange={handlePondChange} required>
                        <option value="">-- Select a Pond --</option>
                        {ponds.map((pond) => (
                            <option key={pond.id} value={pond.id}>
                                {pond.pondName}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit">Add Koi Fish</button>
            </form>
        </div>
    );
};

export default AddKoiFishPage;
