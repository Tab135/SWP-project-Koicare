import './saltcal.scss';
import React, { useState } from 'react';
import axios from 'axios';
import PondDropdown from './PondDropdown';

const Saltcal = () => {
    const [pond_id, setPondId] = useState(null);
    const [pondVolume, setPondVolume] = useState(0);
    const [concentration, setConcentration] = useState(0); 
    const [waterChange, setWaterChange] = useState(0); 
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
                waterChange: parseFloat(waterChange),
            };

            const response = await axios.post(
                `http://170.64.198.85:8080/user/saltManage/${pond_id}`,
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
                                onChange={(e) => setConcentration(parseFloat(e.target.value))}
                            />
                        </div>

                        <div className="input-group water">
                            <div className="label-value-container">
                                <label>Water Change (Optional):</label>
                                <div className="value-display">{((pondVolume * waterChange) / 100).toFixed(2)} ({waterChange}%)</div>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={waterChange}
                                onChange={(e) => setWaterChange(parseFloat(e.target.value))}
                            />
                        </div>

                        <button onClick={handleCalculate}>Calculate</button>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 salt-result">
                    {result && (
                            <div className="result">
                                <h2>Calculation Result</h2>
                                <p>Salt: {result.salt} kg</p>
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
