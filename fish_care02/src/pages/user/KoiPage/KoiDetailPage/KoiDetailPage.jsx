import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const KoiDetailPage = () => {
    const { koiId } = useParams();
    const [koiDetails, setKoiDetails] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchKoiDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to view Koi details.');
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get(`http://localhost:8080/user/koi/${koiId}`, config);
                setKoiDetails(response.data);
            } catch (error) {
                console.error('Error fetching Koi details', error);
                setMessage('Error fetching Koi details.');
            }
        };

        fetchKoiDetails();
    }, [koiId]);

    if (message) return <p>{message}</p>;

    if (!koiDetails) return <p>Loading...</p>;

    return (
        <div className="koi-detail-container">
            <h1>{koiDetails.koiName}</h1>
            <img src={`data:image/jpeg;base64,${koiDetails.image}`} alt={koiDetails.koiName} />
            <p>Age: {koiDetails.age}</p>
            <p>Weight: {koiDetails.weight} kg</p>
            <p>Variety: {koiDetails.variety}</p>
            <p>Sex: {koiDetails.sex}</p>
            <p>Price: ${koiDetails.price}</p>
            <p>Feeding Schedule: {koiDetails.feedingSchedule}</p>
            <p>Physique: {koiDetails.physique}</p>
            <p>Breeder: {koiDetails.breeder}</p>
            <p>Origin: {koiDetails.origin}</p>
        </div>
    );
};

export default KoiDetailPage;
