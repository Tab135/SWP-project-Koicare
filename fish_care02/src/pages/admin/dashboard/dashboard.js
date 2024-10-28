import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.scss';
import UserList from './User/userlist';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
const Sidebar = ({ onMenuClick }) => {
    return (
        <div className="sidebar">
            <h2>DashBoard</h2>
            <ul>
            <button onClick={() => onMenuClick('listUser')} className="menu-button">
                        List User
                    </button>
            </ul>
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
                {activeContent === '' && <h1>Welcome to the Dashboard</h1>}
            </div>
            </div>
    );
};

export default Dashboard;
