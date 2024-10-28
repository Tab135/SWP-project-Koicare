import React, { useEffect, useState } from 'react';
import './Dashboard.scss';
import UserList from './User/userlist';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import LineShop from './LineShop/LineShop';

const Sidebar = ({ onMenuClick }) => {
  const navigate = useNavigate();
    return (
        <div className="sidebar">
            <h2>DashBoard</h2>
            <ul>
            <button onClick={() => onMenuClick('listUser')} className="menu-button">
                        List User
                    </button>
            </ul>
            <ul>
            <button onClick={() => onMenuClick('Total Revenue')} className="menu-button">
                  Total Revenue
                    </button>
            </ul>
            <div className="home-button-container">
        <button onClick={() =>  navigate('/')} className="home-button">
            Back to Home
        </button>
    </div>
        </div>
    );
};
const Dashboard = () => {
    const [activeContent, setActiveContent] = useState(''); 
  const navigate = useNavigate();
useEffect(() => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    const role = decodedToken.role;
    if (role !== 'ADMIN') {
      navigate('/koicare');
    }
  } else {
    navigate('/');
  }
}, [navigate]);
    const handleMenuClick = (content) => {
        setActiveContent(content);
    };
    return (
        <div className="dashboard">
              <Sidebar  onMenuClick={handleMenuClick}/>
              <div className="content">
                {activeContent === 'listUser' && <UserList />} 
                {activeContent === 'Total Revenue' && <LineShop />} 
                {activeContent === '' && <h1>Welcome to the Dashboard</h1>}
                {activeContent === 'home' && <h1>Welcome to the Dashboard</h1>}
            </div>
            </div>
    );
};

export default Dashboard;
