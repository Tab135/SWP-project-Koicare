import './statitic.scss';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import PondDropdown from './PondDropdown';
import React, { useEffect, useState } from 'react';
import { Chart } from 'chart.js'
const Statitic = () => {
    const [PondId, setPondId] = useState(null); 
    const [showSecondGraph, setShowSecondGraph] = useState(false);
    const [showFirstGraph, setShowFirstGraph] = useState(true);
    const LineGraph = ({ pondId }) => {
        const [waterData, setWaterData] = useState([]);
        const [error, setError] = useState(null);
    
        useEffect(() => {
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
                    const response = await axios.get(`http://localhost:8080/user/WaterMonitor/getWater/${pondId}`, config);
                    setWaterData(response.data.waterModelList);  
                } catch (error) {
                    console.error("Error fetching water data", error);
                    setError("Could not fetch water data.");
                }
            };
    
            fetchWaterData();
        }, [pondId]);
        const labels = waterData.map(water => water.date_time); // Use the date as labels
        
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Nitrite',
                    data: waterData.map(water => water.nitrite),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Nitrate',
                    data: waterData.map(water => water.nitrate),
                    backgroundColor: 'rgba(192, 75, 192, 0.2)',
                    borderColor: 'rgba(192, 75, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Phosphate',
                    data: waterData.map(water => water.phosphate),
                    backgroundColor: 'rgba(192, 192, 75, 0.2)',
                    borderColor: 'rgba(192, 192, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Ammonium',
                    data: waterData.map(water => water.ammonium),
                    backgroundColor: 'rgba(75, 75, 192, 0.2)',
                    borderColor: 'rgba(75, 75, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Oxygen',
                    data: waterData.map(water => water.oxygen),
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'HardnessGH',
                    data: waterData.map(water => water.hardnessGH),
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'CO2',
                    data: waterData.map(water => water.co2),
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Temperature',
                    data: waterData.map(water => water.temperature),
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'pH',
                    data: waterData.map(water => water.pH),
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'carbonHardnessKH',
                    data: waterData.map(water => water.carbonHardnessKH),
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Salt',
                    data: waterData.map(water => water.salt),
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
                    borderWidth: 1,
                    fill: false,
                    hidden: true,
                },
                {
                    label: 'Total Chlorine',
                    data: waterData.map(water => water.totalChlorine),
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    borderColor: 'rgba(192, 75, 75, 1)',
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
            <div className='lineGraph'>
                {error ? <p>{error}</p> : <Line data={data} options={options} />}
            </div>
        );
    };

    const SecondLineGraph = () => {
        const data = {
            labels: ['April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [
                {
                    label: 'Mobile Apps',
                    data: [150, 200, 250, 300, 350, 400, 450, 230, 500],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'Mobile Apps',
                    data: [170, 220, 280, 300, 320, 400, 440, 100, 150],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                },
                {
                    label: 'Mobile Apps',
                    data: [170, 220, 280, 100, 120, 500, 600, 240, 150],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
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
            <div className="chart-container" style={{ width: '80%', margin: 'auto' }}>
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
        <PondDropdown setPondId={setPondId} /> 
                <span onClick={toggleGraph}>
                    {showSecondGraph ? 'Water Parameter' : 'Growth record'}
                </span>
                {showFirstGraph && <LineGraph pondId={PondId} title="First Line Graph" />}
                {showSecondGraph && <SecondLineGraph pondId={PondId} title="Second Line Graph" />}           
        </div>
        </div>
        </div>
    )
}
export default Statitic;