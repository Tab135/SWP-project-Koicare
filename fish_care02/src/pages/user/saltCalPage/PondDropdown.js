import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const PondDropdown = ({ setPondId, setPondVolume }) => {
    const [ponds, setPonds] = useState([]);
    const [error, setError] = useState(null);
    const [selectedPond, setSelectedPond] = useState({ id: '', name: '', volume: 0 });
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
                const response = await axios.get('http://170.64.198.85:8080/user/pond', config);
                setPonds(response.data.pondList);

                const storedPondId = localStorage.getItem('selectedPondId');
                if (storedPondId) {
                    const selectedPondData = response.data.pondList.find(pond => pond.id === parseInt(storedPondId));
                    if (selectedPondData) {
                        setSelectedPond({ id: storedPondId, name: selectedPondData.pondName, volume: selectedPondData.volume });
                        setIsPondSelected(true);
                        setPondId(storedPondId);
                        setPondVolume(selectedPondData.volume);
                    }
                }
            } catch (error) {
                console.error('Error fetching ponds', error);
                setError('not pond found.');
            }
        };

        fetchPonds();
    }, [setPondId, setPondVolume]);

    const handleChange = useCallback((e) => {
        const pond_id = e.target.value;
        const selectedPondData = ponds.find(pond => pond.id === parseInt(pond_id));
        if (selectedPondData) {
            setSelectedPond({ id: pond_id, name: selectedPondData.pondName, volume: selectedPondData.volume });
            setIsPondSelected(true);
            setPondId(pond_id);
            setPondVolume(selectedPondData.volume);
            localStorage.setItem('selectedPondId', pond_id);
        }
    }, [ponds, setPondId, setPondVolume]);

    return (
        <div>
            {error && <p>{error}</p>}
            <select id="pond-select" onChange={handleChange} value={selectedPond.id || ''}>
                {!isPondSelected && <option value="">select pond</option>}
                {Array.isArray(ponds) && ponds.length > 0 ? (
                    ponds.map((pond) => (
                        <option key={pond.id} value={pond.id}>
                            {pond.pondName}
                        </option>
                    ))
                ) : (
                    <option value="">Loading pond</option>
                )}
            </select>
            {isPondSelected && <p>Volume: {selectedPond.volume} m³</p>}
        </div>
    );
};

export default PondDropdown;