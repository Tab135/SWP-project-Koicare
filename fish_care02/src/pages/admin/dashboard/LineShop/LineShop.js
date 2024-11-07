import React, { useState, useEffect } from 'react';
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
    const [products, setProducts] = useState([]);

  const fetchRevenueData = async () => {
    try {
      let token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const revenueResponse = await axios.get(
        `http://localhost:8080/admin/revenue/${startDate.toISOString().split('T')[0]}/${endDate.toISOString().split('T')[0]}`,
        config
      );
      setRevenueData(revenueResponse.data.revenueModelList);

      const totalsByDate = revenueResponse.data.revenueModelList.reduce((acc, item) => {
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

  const fetchProductData = async () => {
    try {
      let token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const productResponse = await axios.get(`http://localhost:8080/public/product`, config);
      setProducts(productResponse.data);
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  useEffect(() => {
    fetchProductData(); // Automatically fetch product data on component mount
  }, []);

  useEffect(() => {
    fetchRevenueData(); // Fetch revenue data when start or end date changes
  }, [startDate, endDate]);

  const data = {
    labels: dailyTotals.map((item) => item.date),
    datasets: [
      {
        label: 'Revenue',
        data: dailyTotals.map((item) => item.amount),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
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

  const renderStars = (rating) => {
    if (!rating) return 'Not yet rated';

    const fullStars = Math.floor(rating);
    const halfStar = rating - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div>
        {[...Array(fullStars)].map((_, i) => (
          <span key={i} style={{ color: '#FFD700' }}>★</span>
        ))}
        {halfStar && <span style={{ color: '#FFD700' }}>★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={i} style={{ color: '#ccc' }}>☆</span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Revenue dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
        <div>
          <label style={{ color: '#555' }}>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label style={{ color: '#555' }}>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
      </div>
      <div style={{ marginBottom: '40px' }}>
        <Line data={data} options={options} />
      </div>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333' }}>Product Ratings</h2>
        <div style={{ height: '150px', overflowY: 'auto', padding: '10px', marginBottom: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'left' }}>Product Name</th>
                <th style={{ borderBottom: '2px solid #ccc', padding: '10px', textAlign: 'left' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{product.productName}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{renderStars(product.productRating)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LineShop;
