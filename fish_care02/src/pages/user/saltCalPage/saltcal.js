import './saltcal.scss';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PondDropdown from './PondDropdown';
const Saltcal = () => {
    const [pond_id, setPondId] = useState(null);
    const [pondVolume, setPondVolume] = useState(0);
    const [concentration, setConcentration] = useState('');
    const [waterChange, setWaterChange] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const handleCalculate = async () => {
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                token = sessionStorage.getItem('token');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            };
    
            const payload = {
                Concentration: parseFloat(concentration),
                waterChange: waterChange ? parseFloat(waterChange) : 0,
            };
    
            const response = await axios.post(
                `http://localhost:8080/user/saltManage/${pond_id}`,
                payload,
                config
            );
    
            setResult(response.data);
            setError(null);
        } catch (err) {
            console.error('Error calculating salt:', err);
            setError('Failed to calculate salt. Please try again.');
        }
    };

    return (
        <div className="salt-calculator">
            <h1>Salt Concentration Calculator</h1>
            <div className="container">
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 salt-cal">
                        <div className="pond-name">
                            <PondDropdown setPondId={setPondId} setPondVolume={setPondVolume} />
                        </div>        
                        <div className="input-group desired">
                        <div className="label-value-container"> 
                            <label>Desired Concentration:</label>
                            <div className="value-display">({concentration}%)</div>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="0.75"
                                step="0.05"
                                value={concentration}
                                onChange={(e) => setConcentration(e.target.value)}
                            />
                        </div>

                        <div className="input-group water">
                                <div className="label-value-container">
                                    <label>Water Change (Optional):</label>
                                         <div className="value-display">{((pondVolume * waterChange) / 100).toFixed(2)}  ({waterChange}%)</div>
                                    </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={waterChange}
                                onChange={(e) => setWaterChange(e.target.value)}
                            />
                           
                        </div>

                        <button onClick={handleCalculate}>Calculate</button>

                        {result && (
                            <div className="result">
                                <h2>Calculation Result</h2>
                                <p>{JSON.stringify(result)}</p>
                            </div>
                        )}

                        {error && <p className="error">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Saltcal;
