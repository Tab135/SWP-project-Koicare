import './foodcal.scss';
import React, { useEffect,useState } from 'react';
import axios from 'axios';
const Foodcal = () =>{
    const [growth, setGrowth] = useState('');
    const [waterParameter, setWaterParameter] = useState('');
    const [pond_id, setPondId] = useState(null);
    const [error, setError] = useState(null);

    const [feedingTime, setFeedingTime] = useState('');
    const [foodAmount, setFoodAmount] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchRecommendation = async () => {
            if (growth && waterParameter && pond_id) {
                try {
                    const token = localStorage.getItem('token');
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    };
                    const growthMapping = {
                        'Low': 1,
                        'Medium': 2,
                        'High': 3,
                    };
                    const temperatureMapping= {
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
                    
                    setFeedingTime(response.data.feeding_time);
                    setFoodAmount(response.data.food_amount);
                    setMessage(response.data.message);
                } catch (error) {
                    console.error('Error calculating food', error);
                    setError('Failed to get food recommendation.');
                }
            }
        };

        fetchRecommendation();
    }, [growth, waterParameter, pond_id]);

    const PondDropdown = ({ setPondId }) => {
        const [ponds, setPonds] = useState([]);
        const [error, setError] = useState(null);
        const [selectedPond, setSelectedPond] = useState({ id: '', name: '' });
        const [isPondSelected, setIsPondSelected] = useState(false);

        useEffect(() => {
            const fetchPonds = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    };
                    const response = await axios.get('http://localhost:8080/user/pond', config);
                    setPonds(response.data.pondList);

                    const storedPondId = localStorage.getItem('selectedPondId');
                    if (storedPondId) {
                        const selectedPondName = response.data.pondList.find(pond => pond.id === parseInt(storedPondId))?.pondName || '';
                        setSelectedPond({ id: storedPondId, name: selectedPondName });
                        setIsPondSelected(true);
                        setPondId(storedPondId);
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

    return (
        <div className='food-cal-page'>
            <h1>Food calculator</h1>
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
                        <div className='food-cal-page-info'>
                            <h2>Information</h2>
                            <p>Feeding Time: {feedingTime || 'N/A'}</p>
                            <p>Food Amount: {foodAmount || 0}g/day</p>
                            <p>Message: {message || 'No message'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='recommend-amount'>
                    <h1 className='recommend-amount-h1'>Recommended amount:</h1>
                    <h1 className='recommend-amount-h1'>{foodAmount || 0}g/day</h1>
                {error && <div className="error">{error}</div>}
            </div>
        </div>
    );
}
export default Foodcal;