import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const KoiDropdown = ({ setKoiId }) => {
    const [kois, setKois] = useState([]);
    const [error, setError] = useState(null);
    const [selectedKoi, setSelectedKoi] = useState({ id: '', name: '' });
    const [isKoiSelected, setIsKoiSelected] = useState(false);

    useEffect(() => {
        const fetchKois = async () => {
            try {
                let token = localStorage.getItem('token');
                if (!token) {
                    token = sessionStorage.getItem('token');
                }
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axios.get('http://localhost:8080/user/koi', config);
                setKois(response.data.koiList);

                const storedKoiId = sessionStorage.getItem('selectedKoiId');
                if (storedKoiId) {
                    const selectedKoiName = response.data.koiList.find(koi => koi.id === parseInt(storedKoiId))?.koiName || '';
                    setSelectedKoi({ id: storedKoiId, name: selectedKoiName });
                    setIsKoiSelected(true);
                    setKoiId(storedKoiId);
                }
            } catch (error) {
                console.error('Error fetching kois', error);
                setError('Could not fetch kois.');
            }
        };

        fetchKois();
    }, []);

    const handleChange = (e) => {
        const koi_id = e.target.value;
        const selectedKoiName = kois.find(koi => koi.id === parseInt(koi_id))?.koiName || '';
        setSelectedKoi({ id: koi_id, name: selectedKoiName });
        setIsKoiSelected(true);
        setKoiId(koi_id);

        localStorage.setItem('selectedKoiId', koi_id);
    };

    return (
        <div className='koi-name-dropdown'>
            {error && <p>{error}</p>}
            <select
                id="koi-select"
                onChange={handleChange}
                value={selectedKoi.id || ''}
            >
                {!isKoiSelected && <option value="">Select a koi</option>}
                {Array.isArray(kois) && kois.length > 0 ? (
                    kois.map((koi) => (
                        <option key={koi.id} value={koi.id}>
                            {koi.koiName}
                        </option>
                    ))
                ) : (
                    <option value="">Loading kois...</option>
                )}
            </select>
        </div>
    );
};

export default KoiDropdown;