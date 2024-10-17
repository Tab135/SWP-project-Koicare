import WaterParameterModal from "./addWater";
import PondDropdown from "./PondDropdown";
import React, { useEffect,useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
const WaterPage = () => {
    const [pond_id, setPondId] = useState(null);
    const LineGraph = () => {
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
    return(
       <div>
        <h1>Water Parameter</h1>
        <div className='pond-name'><PondDropdown setPondId={setPondId} /></div>
        <div>
            <WaterParameterModal/>
            <LineGraph/>
        </div>  
       </div>
    )
}
export default WaterPage;