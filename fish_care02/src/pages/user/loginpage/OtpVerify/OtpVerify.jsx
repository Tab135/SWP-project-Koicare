import React, { useState, useEffect } from 'react';
import './OtpVerify.scss';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OtpVerify = () => {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('userEmail');
        const storedName = localStorage.getItem('userName');
        const storedPassword = localStorage.getItem('userPassword');

        if (storedEmail && storedName && storedPassword) {
            setEmail(storedEmail);
            setName(storedName);
            setPassword(storedPassword);
        } else {
            setErrorMessage('Registration details not found. Please try registering again.');
        }
    }, []);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://170.64.198.85:8080/auth/otp-verify/${otp}`, null, {
                params: {
                    email: email,
                    name: name,
                    password: password
                }
            });

            if (response.data.statusCode === 200) {
                console.log('OTP verified successfully:', response.data);
                setErrorMessage('');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('userPassword');
                navigate('/login');
            } else {
                setErrorMessage('Invalid OTP. Please try again.');
                console.error('Otp verification failed:', response.data);
            }
        } catch (error) {
            if (error.response) {
                console.error('OTP verification error:', error.response.data);
                setErrorMessage('Invalid OTP. Please try again.');
            } else {
                console.error('Error during OTP verification:', error.message);
                setErrorMessage('An error has occurred. Please try again later.');
            }
        }
    };

    return (
        <div className='bodyLogin'>
            <div className="otp-body">
                <div className="otp-container">
                    <form onSubmit={handleOtpSubmit}>
                        <h2>OTP Verification</h2>
                        <div className="input-box">
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        <button type="submit">Verify OTP</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OtpVerify;
