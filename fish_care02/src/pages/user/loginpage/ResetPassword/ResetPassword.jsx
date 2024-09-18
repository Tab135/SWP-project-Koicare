import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/auth/reset-password', { email, password });
            setMessage('Password reset successfully.');

            navigate('/login');
        } catch (error) {
            setMessage('Error resetting password. Please try again.');
        }
    };

    return (
        <div className='bodyLogin'>
            <div className="reset-password-wrapper">
                <div className="form-box reset-password">
                    <h1>Reset Password</h1>
                    <form onSubmit={handleResetPassword}>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Enter new password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit">Reset Password</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
