import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './EnterOtp.css';

const EnterOtp = () => {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/auth/verify-otp', { email, otp });
            setMessage('OTP verified successfully.');

            navigate('/reset-password', { state: { email } });
        } catch (error) {
            setMessage('Invalid OTP. Please try again.');
        }
    };

    return (
        <div className='bodyLogin'>
            <div className="otp-wrapper">
                <div className="form-box otp-input">
                    <h1>Enter OTP</h1>
                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button type="submit">Verify OTP</button>
                    </form>
                    {message && <p>{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default EnterOtp;
