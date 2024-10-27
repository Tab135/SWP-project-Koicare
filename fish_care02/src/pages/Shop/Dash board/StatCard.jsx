import React from 'react';

const StatCard = ({ icon, title, value, color }) => (
  <div className="stat-card">
    <div style={{ color }} className="d-flex align-items-center mb-3">
      {icon}
    </div>
    <div className="value">{value}</div>
    <div className="title">{title}</div>
  </div>
);

export default StatCard;