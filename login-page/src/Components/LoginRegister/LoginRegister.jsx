import React, { useState } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock, FaEnvelope  } from "react-icons/fa";
import axios from 'axios';

const LoginRegister = () => {

    const [action, setAction] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const registerLink = () => {
        setAction(' active');
    };

    const loginLink = () => {
        setAction('');
    };

    // Hàm gọi API đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email,
                password
            });
            console.log("thanh cong", response.data);
            // Xử lý logic sau khi đăng nhập thành công
        } catch (error) {
            console.error("Login error", error);
        }
    };

    // Hàm gọi API đăng ký
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/auth/signup', {
                email,
                password,
                username
            });
            console.log(response.data);
            // Xử lý logic sau khi đăng ký thành công
        } catch (error) {
            console.error("Signup error", error);
        }
    };

    return(
        <div className={`wrapper${action}`}>
            <div className="form-box login">
                <form onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder='Email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FaEnvelope className='icon' />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder='Password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FaLock className='icon' />
                    </div>

                    <div className="remember-forgot">
                        <label><input type='checkbox' />Remember</label>
                        <a href="#">Forgot password?</a>
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
                <form onSubmit={handleRegister}>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder='Username'
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <FaUser className='icon' />
                    </div>
                    <div className="input-box">
                        <input
                            type="email"
                            placeholder='Email'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <FaEnvelope className='icon' />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder='Password'
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
    );
};

export default LoginRegister;
