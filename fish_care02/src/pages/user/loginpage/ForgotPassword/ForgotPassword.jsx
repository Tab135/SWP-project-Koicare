import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/auth/send-otp', { email });
            setMessage('OTP has been sent to your email.');
        } catch (error) {
            setMessage('Error sending OTP. Please try again.');
        }
    };

    return (
        <body className='bodyLogin'>
            <div className="forgot-password-wrapper">
                <div className="form-box forgot-password">
                    <h1>Forgot Password</h1>
                    <form onSubmit={handleSendOtp}>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit">Send OTP</button>
                    </form>
                    {message && <p>{message}</p>}
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </body>
    );
};

export default ForgotPassword;