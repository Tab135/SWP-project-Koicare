import './statitic.scss';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import PondDropdown from './PondDropdown';
import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js'
import KoiDropdown from './KoiDropdown';
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";
import DateRangePicker from './datedropdown';
const Statitic = () => {
    const [PondId, setPondId] = useState(null); 
    const [start_date, setStartDate] = useState(new Date()); 
    const [end_date, setEndDate] = useState(new Date());  
    const handleStartDateChange = (date) => setStartDate(date);
    const handleEndDateChange = (date) => setEndDate(date);
    const [waterData, setWaterData] = useState([]);
    const [selectedKoiIds, setSelectedKoiIds] = useState([]);
    const [showSecondGraph, setShowSecondGraph] = useState(false);
    const [showFirstGraph, setShowFirstGraph] = useState(true);
    const [error, setError] = useState(null);
    const toggleGraphView = () => {
        setShowFirstGraph(prev => !prev);
        setShowSecondGraph(prev => !prev);
    };
    const fetchWaterData = async () => {
        try {
            let token = localStorage.getItem('token');
            if (!token) {
                token = sessionStorage.getItem('token');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const formattedStartDate = start_date.toISOString().split('.')[0];
            const formattedEndDate = end_date.toISOString().split('.')[0];

            const response = await axios.get(
                `http://170.64.198.85:8080/user/WaterMonitor/${PondId}/${formattedStartDate}/${formattedEndDate}`,
                config
            );
            setWaterData(response.data.waterModelList);
            setError(null); 
        } catch (error) {
            console.error("Error fetching water data", error);
            setError("Could not fetch water data.");
        }
    };
    const LineGraph = ({ pondId, waterData, error }) => {
        const formatDisplayDate = (isoDate) => {
            return new Date(isoDate).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        };
        const sortedWaterData = waterData?.sort((a, b) => new Date(a.date) - new Date(b.date)) || [];
        const labels = sortedWaterData.map(water => formatDisplayDate(water.date));
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Nitrite',
                    data: waterData?.map(water => water.nitrite)|| [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Nitrate',
                    data: waterData?.map(water => water.nitrate)|| [],
                    backgroundColor: 'rgba(192, 75, 192, 0.2)',
                    borderColor: 'rgba(192, 75, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Phosphate',
                    data: waterData?.map(water => water.phosphate)|| [],
                    backgroundColor: 'rgba(192, 192, 75, 0.2)',
                    borderColor: 'rgba(192, 192, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Ammonium',
                    data: waterData?.map(water => water.ammonium)|| [],
                    backgroundColor: 'rgba(75, 75, 192, 0.2)',
                    borderColor: 'rgba(75, 75, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Oxygen',
                    data: waterData?.map(water => water.oxygen)|| [],
                    backgroundColor: 'rgba(75, 192, 75, 0.2)',
                    borderColor: 'rgba(75, 192, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'HardnessGH',
                    data: waterData?.map(water => water.hardnessGH)|| [],
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'CO2',
                    data: waterData?.map(water => water.co2)|| [],
                    backgroundColor: 'rgba(75, 75, 150, 0.2)',
                    borderColor: 'rgba(75, 75, 150, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Temperature',
                    data: waterData?.map(water => water.temperature)|| [],
                    backgroundColor: 'rgba(150, 75, 75, 0.2)',
                    borderColor: 'rgba(150, 75, 75, 0.75)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'pH',
                    data: waterData?.map(water => water.pH)|| [],
                    backgroundColor: 'rgba(75, 150, 75, 0.2)',
                    borderColor: 'rgba(75, 150, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'carbonHardnessKH',
                    data: waterData?.map(water => water.carbonHardnessKH)|| [],
                    backgroundColor: 'rgba(150, 150, 75, 0.2)',
                    borderColor: 'rgba(150, 150, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Salt',
                    data: waterData?.map(water => water.salt)|| [],
                    backgroundColor: 'rgba(75, 150, 192, 0.2)',
                    borderColor: 'rgba(75, 150, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Total Chlorine',
                    data: waterData?.map(water => water.totalChlorine)|| [],
                    backgroundColor: 'rgba(192, 150, 75, 0.2)',
                    borderColor: 'rgba(192, 150, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                
            ],
        };
    
        const options = {
            scales: {
                y: { beginAtZero: true },
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'black', 
                        font: {
                            size: 14,
                            weight: 'bold',
                        },
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20,
                        generateLabels: (chart) => {
                            const original = Chart.defaults.plugins.legend.labels.generateLabels;
                            const labelsOriginal = original.call(this, chart);
                            labelsOriginal.forEach(label => {
                                if (label.hidden) {
                                    label.fontColor = 'gray';
                                   
                                }
                            });
                            return labelsOriginal;
                        
                    },
                }}}}
    
        return (
            <div  className='lineGraph'>
            <div >
                {error ? <p>{error}</p> : <Line data={data} options={options} />}
            </div>
        </div>
        );
    };
    const SecondLineGraph = ({ koiId }) => {
        const [growthRecord, setGrowthRecord] = useState([]);
        const [error, setError] = useState(null);
        useEffect(() => {
            const fetchGrowthRecords = async () => {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (!token) return;
    
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };
                    const response = await axios.get(`http://170.64.198.85:8080/user/${koiId}/records`, config);
                    const sortedRecords = response.data.growthRecordList.sort((a, b) => 
                        new Date(a.koiId.date) - new Date(b.koiId.date)
                    );
                    
                    setGrowthRecord(sortedRecords);
                } catch (error) {
                    console.error('Error fetching growth records', error);
                    setError('Failed to fetch growth records.');
                }
            };
    
            fetchGrowthRecords();
        }, [koiId]);
    
        const labels = growthRecord.map(growthRecordList => growthRecordList.koiId.date); 
    
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'weight',
                    data: growthRecord.map(growthRecordList => growthRecordList.weight),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'length',
                    data: growthRecord.map(growthRecordList => growthRecordList.length),
                    backgroundColor: 'rgba(75, 75, 150, 0.2)',
                    borderColor: 'rgba(75, 75, 150, 1)',
                    borderWidth: 1,
                    fill: false,
                },
            ],
        };
    
        const options = {
            scales: {
                y: { beginAtZero: true },
            },
        };
    
        return (
            <div className="chart-container">
                  <span>Growth Record of {growthRecord[0]?.koiFish.koiName} </span>
            <Line data={data} options={options} />
        </div>
        );
    };
    const toggleGraph = () => {
        if (showSecondGraph) {
            setShowSecondGraph(false);
            setShowFirstGraph(true);
        } else {
            setShowSecondGraph(true);
            setShowFirstGraph(false);
        }
    };
    return (
        <div className='statiticpage'>
            <h1>Statistics</h1>
        <div className='container'>
            <div className='row'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'revert-layer' }}>
                <span onClick={toggleGraphView} style={{ margin: '0 10px', color: 'white', fontWeight: 'bold'}}>
                    {showSecondGraph ? <SlArrowLeft size={30}/> : <SlArrowLeft size={30}/>}
                </span>
                <span style={{ margin: '0 10px', fontWeight: 'bold'  }}>
                {showSecondGraph ? 'Growth Record' : 'Water Parameter'}
            </span>
                <span onClick={toggleGraphView} style={{ margin: '0 10px', color: 'white'}}>
                    {showSecondGraph ? <SlArrowRight  size={30}/> : <SlArrowRight size={30} />}
                </span>
            </div>

            <div className='statiticpage_container'>
                        {showFirstGraph && (
                            <div className="date-range-and-dropdown">
                                <DateRangePicker
                                    startDate={start_date}
                                    endDate={end_date}
                                    onStartDateChange={handleStartDateChange}
                                    onEndDateChange={handleEndDateChange}
                                    className="date-range-picker" 
                                />
                                <PondDropdown setPondId={setPondId} className="pond-dropdown" /> 
                                <button className="load-data-button" onClick={fetchWaterData}>Load Data</button>
                            </div>
                        )}
                    {showSecondGraph && <KoiDropdown setSelectedKoiIds={setSelectedKoiIds} />}
                    {showFirstGraph && PondId &&  <LineGraph
                                                        pondId={PondId}
                                                        start_date={start_date}
                                                        end_date={end_date}
                                                        waterData={waterData}
                                                        error={error}
                                                    />}
                    {showSecondGraph && selectedKoiIds.map(koiId => (
                        <SecondLineGraph key={koiId} koiId={koiId} />
                    ))}
            </div>                    
        </div>
        </div>
        </div>
    )
}
export default Statitic;