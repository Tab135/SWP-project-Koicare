import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { memo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import Axios for API calls

const LoginRegister = () => {

    const [action, setAction] = useState('');
    const [userDetails, setUserDetails] = useState({ email: '', password: '', username: '' });

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                password: userDetails.password
            });
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Login error:', error.response.data);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/signup', {
                username: userDetails.username,
                password: userDetails.password,
                email: userDetails.email
            });
            console.log('Registration successful:', response.data);
            // Handle successful registration
        } catch (error) {
            console.error('Registration error:', error.response.data);
        }
    };

    return (
        <body className='bodyLogin'>
            <div className={`wrapper${action}`}>
                <div className="form-box login">
                    <form onSubmit={handleLoginSubmit}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder='Email'
                                value={userDetails.email}
                                onChange={handleInputChange}
                                required
                            />
                            <FaEnvelope className='icon' />  {/* Changed to FaEnvelope */}
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={userDetails.password}
                                onChange={handleInputChange}
                                required
                            />
                            <FaLock className='icon' />
                        </div>

                        <div className="remember-forgot">
                            <label><input type='checkbox' />Remember</label>
                            <Link to="/forgot-password">Forgot Password?</Link>
                        </div>

                        <button type="submit">Login</button>

                        <div className="register-link">
                            <p>Don't have an account?
                                <a href="#" onClick={registerLink}>Register</a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="form-box register">
                    <form onSubmit={handleRegisterSubmit}>
                        <h1>Registration</h1>
                        <div className="input-box">
                            <input
                                type="text"
                                name="username"
                                placeholder='Username'
                                value={userDetails.username}
                                onChange={handleInputChange}
                                required
                            />
                            <FaUser className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="email"
                                name="email"
                                placeholder='Email'
                                value={userDetails.email}
                                onChange={handleInputChange}
                                required
                            />
                            <FaEnvelope className='icon' />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                name="password"
                                placeholder='Password'
                                value={userDetails.password}
                                onChange={handleInputChange}
                                required
                            />
                            <FaLock className='icon' />
                        </div>

                        <div className="remember-forgot">
                            <label><input type='checkbox' />I agree to the terms & conditions</label>
                        </div>

                        <button type="submit">Register</button>

                        <div className="register-link">
                            <p>Already have an account?
                                <a href="#" onClick={loginLink}>Login</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </body>
    );
};

export default memo(LoginRegister);
