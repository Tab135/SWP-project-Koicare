import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ForgotPassword.scss';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1);  // Track current step
    const [message, setMessage] = useState('');

    const handleSendOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/forgotpassword/verifyMail/${email}`);
            setMessage('OTP has been sent to your email.');
            setStep(2); // Move to OTP verification step
        } catch (error) {
            setMessage('Error sending OTP. Please try again.');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/forgotpassword/verifyOTP/${otp}/${email}`);
            setMessage('OTP verified. You can now reset your password.');
            setStep(3); // Move to password reset step
        } catch (error) {
            setMessage('Invalid OTP. Please try again.');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/forgotpassword/changePassword/${email}`, { password });
            setMessage('Password changed successfully. You can now log in.');
        } catch (error) {
            setMessage('Error changing password. Please try again.');
        }
    };

    return (
        <body className='bodyLogin'>
        <div className="forgot-password-wrapper">
            <div className="form-box forgot-password">
                <h1>Forgot Password</h1>
                {step === 1 && (
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
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="input-box">
                            <input
                                type="text"
                                placeholder="Enter the OTP"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button type="submit">Verify OTP</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleChangePassword}>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Enter your new password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit">Change Password</button>
                    </form>
                )}

                {message && <p>{message}</p>}
                <Link to="/login">Back to Login</Link>
            </div>
        </div>
        </body>
    );
};

export default ForgotPassword;
