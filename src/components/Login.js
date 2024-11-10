import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance, { setCSRFToken } from './axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Login.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

const LoginScreen = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        remember: false
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        const { name, value, type, checked } = event.target;
        const inputValue = type === 'checkbox' ? checked : value;
        setValues(prevValues => ({ ...prevValues, [name]: inputValue }));
    };

    const togglePassword = () => {
        const password = document.getElementById('password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        const eyeIcon = document.getElementById('togglePassword');
        eyeIcon.classList.toggle('bi-eye');
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const loginData = {
            email: values.email,
            password: values.password,
            long_session: values.remember
        };

        axiosInstance.post('Login/', loginData)
            .then(response => {
				const csrf_token = response.data.csrftoken;
				localStorage.setItem('csrftoken', csrf_token);
				localStorage.setItem('loggedIn', 'true');
                navigate('/profile');
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setErrors({ error: 'Invalid email or password. Please try again.' });
            });
    };

    return (
        <div className="login-container">
            <h2>Sign In</h2>
            <div className='underline'></div>
            <form onSubmit={handleSubmit}>
                <div className='input-container'>
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                    <Form.Control 
                        type="email" 
                        placeholder="name@example.com" 
                        name="email" 
                        onChange={handleInput} 
                        value={values.email} 
                    />
                </FloatingLabel>

                <FloatingLabel controlId="floatingPassword" label="Password">
                    <Form.Control 
                        type="password" 
                        placeholder="Password" 
                        name="password" 
                        onChange={handleInput} 
                        value={values.password} 
                    />
                </FloatingLabel>
                </div>
                <button type="submit">Sign in</button>
                <br></br>
                <div id="remember">
                    <input 
                        type="checkbox" 
                        name="remember"
                        onChange={handleInput} 
                        checked={values.remember} 
                    />
                    <label htmlFor="remember">Remember me</label>
                </div>
                <div><Link to="/forgotPassword" id="forgot-password">Forgot Password?</Link></div>
                <span id="no-account">No account? <Link to="/register" id="sign-up">Sign up now</Link></span>
            </form>
            {errors.error && <span className="text-danger">{errors.error}</span>}
        </div>
    );
};

function Login() {
    return (
        <div className="Login">
            <LoginScreen />
        </div>
    );
}

export default Login;
