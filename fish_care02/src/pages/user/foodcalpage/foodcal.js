import './foodcal.scss';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PondDropdown from './PondDropdown';

const Foodcal = () => {
    const [growth, setGrowth] = useState('');
    const [waterParameter, setWaterParameter] = useState('');
    const [pond_id, setPondId] = useState(null);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchTemperature = async () => {
            if (pond_id) {
                try {
                    let token = localStorage.getItem('token');
                    if (!token) {
                        token = sessionStorage.getItem('token');
                    }
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const response = await axios.get(`http://localhost:8080/public/WaterMonitor/temperature/${pond_id}`, config);
                    const temperature = response.data.temperature;

                    // Map temperature to waterParameter
                    if (temperature <= 6 && temperature <= 8) setWaterParameter('6-8');
                    else if (temperature >= 9 && temperature <= 12) setWaterParameter('9-12');
                    else if (temperature >= 13 && temperature <= 16) setWaterParameter('13-16');
                    else if (temperature >= 17 && temperature <= 20) setWaterParameter('17-20');
                    else if (temperature >= 21 && temperature >= 28) setWaterParameter('21-28');
                } catch (error) {
                    console.error('Error fetching temperature', error);
                    setError('Failed to fetch pond temperature.');
                }
            }
        };

        fetchTemperature();
    }, [pond_id]);

    // Fetch food calculation recommendation
    useEffect(() => {
        const fetchRecommendation = async () => {
            if (growth && waterParameter && pond_id) {
                try {
                    let token = localStorage.getItem('token');
                    if (!token) {
                        token = sessionStorage.getItem('token');
                    }
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const growthMapping = {
                        'Low': 0.02,
                        'Medium': 0.03,
                        'High': 0.04,
                    };
                    const temperatureMapping = {
                        '6-8': 1,
                        '9-12': 2,
                        '13-16': 3,
                        '17-20': 4,
                        '21-28': 5,
                    };

                    const payload = {
                        desireGrowth: growthMapping[growth],
                        temperature: temperatureMapping[waterParameter],
                    };

                    const response = await axios.post(`http://localhost:8080/public/foodManange/${pond_id}`, payload, config);
                    setResult(response.data)
                    console.log(response.data)
                } catch (error) {
                    console.error('Error calculating food', error);
                    setError('Failed to get food recommendation.');
                }
            }
        };

        fetchRecommendation();
    }, [growth, waterParameter, pond_id]);

    return (
        <div className='food-cal-page'>
            <h1 className='food-cal-page-h1'>Food calculator</h1>
            <div className='container'>
                <div className='row'>
                    <div className='col-xl-6 col-lg-6 col-md-6 food-cal'>
                        <div className='pond-name'><PondDropdown setPondId={setPondId} /></div>
                        <div className='desired-growth'>
                            <span>desired growth</span>
                            <div className='desired-growth-menu'>
                                <ul>
                                    <li><button onClick={() => setGrowth('Low')} className={growth === 'Low' ? 'active' : ''}><span>Low</span><p>.</p></button></li>
                                    <li><button onClick={() => setGrowth('Medium')} className={growth === 'Medium' ? 'active' : ''}><span>Medium</span><p>..</p></button></li>
                                    <li><button onClick={() => setGrowth('High')} className={growth === 'High' ? 'active' : ''}><span>High</span><p>...</p></button></li>
                                </ul>
                            </div>
                        </div>
                        <div className='water-parameter'>
                            <span>water parameter</span>
                            <div className='water-parameter-menu'>
                                <ul>
                                    <li><button onClick={() => setWaterParameter('6-8')} className={waterParameter === '6-8' ? 'active' : ''}><span>6-8°</span><p>.</p></button></li>
                                    <li><button onClick={() => setWaterParameter('9-12')} className={waterParameter === '9-12' ? 'active' : ''}><span>9-12°</span><p>.</p></button></li>
                                    <li><button onClick={() => setWaterParameter('13-16')} className={waterParameter === '13-16' ? 'active' : ''}><span>13-16°</span><p>..</p></button></li>
                                    <li><button onClick={() => setWaterParameter('17-20')} className={waterParameter === '17-20' ? 'active' : ''}><span>17-20°</span><p>..</p></button></li>
                                    <li><button onClick={() => setWaterParameter('21-28')} className={waterParameter === '21-28' ? 'active' : ''}><span>21-28°</span><p>...</p></button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='col-xl-6 col-lg-6 col-md-6'>
                        {result && (
                            <div className="result">
                                <h2>Information</h2>
                                <p>Feeding Time : {result.feeding_time} </p>
                                <p>Food Amount: {result.food_amount} g/day</p>
                                <p>Message: {result.message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='recommend-amount'>
                <h1 className='recommend-amount-h1'>Recommended amount:</h1>
                {result && ( <h1 className='recommend-amount-h1'>{result.food_amount}g/day</h1> )}
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
}

export default Foodcal;
