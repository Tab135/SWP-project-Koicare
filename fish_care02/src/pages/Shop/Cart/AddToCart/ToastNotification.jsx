// Toast.jsx
import React from 'react';
import { Toast } from 'react-bootstrap';
import './Toast.css'; // Create this file for styles

const ToastNotification = ({ message, onClose }) => {
  return (
    <Toast onClose={onClose} className="toast-notification">
      <Toast.Body>{message}</Toast.Body>
    </Toast>
  );
};

export default ToastNotification;
