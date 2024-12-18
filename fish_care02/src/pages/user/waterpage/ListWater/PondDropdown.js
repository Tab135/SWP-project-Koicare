import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const PondDropdown = ({ setPondId }) => {
    const [ponds, setPonds] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPond, setSelectedPond] = useState({ id: '', name: '' });
    const [isPondSelected, setIsPondSelected] = useState(false);

    useEffect(() => {
        const fetchPonds = async () => {
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
                const response = await axios.get('http://localhost:8080/user/pond', config);
                const pondList = response.data.pondList;
                setPonds(pondList);
    
                const storedPondId = sessionStorage.getItem('selectedPondId');
                if (storedPondId) {
                    const selectedPondName = pondList.find(pond => pond.id === parseInt(storedPondId))?.pondName || '';
                    setSelectedPond({ id: storedPondId, name: selectedPondName });
                    setIsPondSelected(true);
                    setPondId(storedPondId);
                } else if (pondList.length > 0) {
                    // Select the first pond in the list if no pond is stored
                    const firstPond = pondList[0];
                    setSelectedPond({ id: firstPond.id, name: firstPond.pondName });
                    setIsPondSelected(true);
                    setPondId(firstPond.id);
    
                    sessionStorage.setItem('selectedPondId', firstPond.id); // Store the first pond ID
                }
            } catch (error) {
                console.error('Error fetching ponds', error);
                setError('Could not fetch ponds.');
            }
        };
    
        fetchPonds();
    }, []);
    const handleChange = (e) => {
        const pond_id = e.target.value;
        const selectedPondName = ponds.find(pond => pond.id === parseInt(pond_id))?.pondName || '';
        setSelectedPond({ id: pond_id, name: selectedPondName });
        setIsPondSelected(true);
        setPondId(pond_id);

        localStorage.setItem('selectedPondId', pond_id);
    };

    return (
        <div className='pond-name-dropdown'>
            {error && <p>{error}</p>}
            <select
                id="pond-select"
                onChange={handleChange}
                value={selectedPond.id || ''}
            >
                {!isPondSelected && <option value="">Select a pond</option>}
                {Array.isArray(ponds) && ponds.length > 0 ? (
                    ponds.map((pond) => (
                        <option  key={pond.id} value={pond.id}>
                            {pond.pondName}
                        </option>
                    ))
                ) : (
                    <option value="">Loading ponds...</option>
                )}
            </select>
        </div>
    );
};
export default PondDropdown;