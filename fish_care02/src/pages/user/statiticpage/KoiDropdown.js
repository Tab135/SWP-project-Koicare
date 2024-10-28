import React, { useEffect, useState } from 'react';
import axios from 'axios';

const KoiDropdown = ({ setSelectedKoiIds }) => {
    const [kois, setKois] = useState([]);
    const [error, setError] = useState(null);
    const [selectedKoiIds, setSelectedKoiIdsInternal] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchKois = async () => {
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const response = await axios.get('http://localhost:8080/user/koi', config);
                setKois(response.data.koiList);
            } catch (error) {
                console.error('Error fetching kois', error);
                setError('Could not fetch kois.');
            }
        };

        fetchKois();
    }, []);

    const handleCheckboxChange = (koiId) => {
        const updatedSelectedKoiIds = selectedKoiIds.includes(koiId)
            ? selectedKoiIds.filter(id => id !== koiId)
            : [...selectedKoiIds, koiId];

        setSelectedKoiIdsInternal(updatedSelectedKoiIds);
        setSelectedKoiIds(updatedSelectedKoiIds);
        sessionStorage.setItem('selectedKoiIds', JSON.stringify(updatedSelectedKoiIds));
    };

    const toggleDropdown = () => setIsDropdownOpen(prevState => !prevState);

    return (
        <div className='koi-dropdown'>
            <button onClick={toggleDropdown} className='koi_dropdown-toggle'>
                Select Koi(s)
            </button>
            {isDropdownOpen && (
                <div className='koi_dropdown-menu'>
                    {error && <p>{error}</p>}
                    {Array.isArray(kois) && kois.length > 0 ? (
                        kois.map((koi) => (
                            <label key={koi.koiId} className='koi_dropdown-item'>
                                <input
                                    type="checkbox"
                                    checked={selectedKoiIds.includes(koi.koiId)}
                                    onChange={() => handleCheckboxChange(koi.koiId)}
                                />
                                {koi.koiName}
                            </label>
                        ))
                    ) : (
                        <p>Loading kois...</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default KoiDropdown;
