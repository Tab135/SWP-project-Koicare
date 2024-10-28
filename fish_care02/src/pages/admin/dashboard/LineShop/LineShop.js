import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LineShop = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [dailyTotals, setDailyTotals] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const fetchRevenueData = async () => {
        try {
            let token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(
                `http://localhost:8080/admin/revenue/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`,
                config
            );
            setRevenueData(response.data.revenueModelList);

            const totalsByDate = response.data.revenueModelList.reduce((acc, item) => {
                acc[item.date] = (acc[item.date] || 0) + item.amount;
                return acc;
            }, {});
            const totalsArray = Object.entries(totalsByDate).map(([date, amount]) => ({
                date,
                amount,
            }));
            setDailyTotals(totalsArray);
        } catch (error) {
            console.error("Error fetching revenue data:", error);
        }
    };

    const data = {
        labels: dailyTotals.map(item => item.date),
        datasets: [
            {
                label: 'Revenue',
                data: dailyTotals.map(item => item.amount),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div>
            <div className="date-picker-container">
                <label>
                    Start Date: 
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker"
                    />
                </label>
                <label>
                    End Date: 
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="date-picker"
                    />
                </label>
                <button onClick={fetchRevenueData} className="load-data-button">Load Data</button>
            </div>
            <div className="chart-container_dashboard">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default LineShop;
