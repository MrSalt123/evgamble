import React, { useState, useEffect } from 'react';
import Validation from './RegisterValidation';
import './styles/Register.css';
import axios from 'axios';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';

axios.defaults.withCredentials = true;

const RegisterScreen = () => {
    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        confirm_password: '',
        bankroll: '',
        category: 'poker'
    })
    const [errors, setErrors] = useState({})
    const [showProgressBar, setShowProgressBar] = useState(true);

    const handleInput = (event) => {
        const { name, value, type, checked } = event.target;
        const inputValue = type === 'checkbox' ? checked : value;

        if (name === 'category') {
            setValues(prevValues => ({ ...prevValues, category: inputValue }));
        } else {
            setValues(prevValues => ({ ...prevValues, [name]: inputValue }));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const registrationData = {
            "email": values.email,
            "password": values.password,
            "promotions_opt_in": values.promotions,
            "code": values.reg_code,
            "username": values.username,
            "category": values.category,
            "bankroll": values.bankroll
        };

        try {
            const response = await axios.post('http://127.0.0.1:8000/Register/', registrationData);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };


    const sendEmail = async (event) => {
        event.preventDefault();
        const validationErrors = Validation(values, currentStep);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setCurrentStep(currentStep + 1);
        } else {
            return;
        }
        setShowProgressBar(false);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/Verify/${values.email}`);
        } catch (error) {
            console.error('Error fetching data:', error.response.data.message);
        }
    }

    const [currentStep, setCurrentStep] = useState(1);

    const handleNext = () => {
        const validationErrors = Validation(values, currentStep);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToStep = (step) => {
        const validationErrors = Validation(values, currentStep);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            setCurrentStep(step);
        }
    };

    const togglePassword = () => {
        const password = document.getElementById('password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        const eyeIcon = document.getElementById('togglePassword');
        eyeIcon.classList.toggle('bi-eye');
    }

    const toggleConfirmPassword = () => {
        const password = document.getElementById('confirm-password');
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        const eyeIcon = document.getElementById('toggleConfirmPassword');
        eyeIcon.classList.toggle('bi-eye');
    }

    return (
        <div class="login-container">
            {showProgressBar && (
                <div className="progress-bar">
                    <span className={currentStep === 1 ? "dot active" : "dot"} onClick={() => goToStep(1)}></span>
                    <span className={currentStep === 2 ? "dot active" : "dot"} onClick={() => goToStep(2)}></span>
                    <span className={currentStep === 3 ? "dot active" : "dot"} onClick={() => goToStep(3)}></span>
                </div>
            )}
            <h2>Sign Up</h2>
            <div className='underline'></div>
            <form>
                {currentStep === 1 && (
                    <div className="step step-1 active">
                        <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                name="email"
                                onChange={handleInput}
                                value={values.email}
                            />
                        </FloatingLabel>
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                        <FloatingLabel controlId="floatingInput" label="Username" className="mb-3">
                            <Form.Control
                                type="username"
                                placeholder="gamba"
                                name="username"
                                onChange={handleInput}
                                value={values.username}
                            />
                        </FloatingLabel>
                        {errors.username && <span className="text-danger">{errors.username}</span>}
                        <button type="button" className="next-btn" onClick={handleNext}>Next</button>
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="step step-2 active">
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-container">
                                <input type="password" id="password" name="password" onChange={handleInput} value={values.password} ></input>
                                <i className="eye-icon bi bi-eye-slash" id="togglePassword" onClick={togglePassword}></i>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm-password">Confirm password</label>
                            <div className="password-container">
                                <input type="password" id="confirm-password" name="confirm_password" onChange={handleInput} value={values.confirm_password}></input>
                                <i className="eye-icon bi bi-eye-slash" id="toggleConfirmPassword" onClick={toggleConfirmPassword}></i>
                            </div>
                        </div>
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                        <button type="button" className="next-btn" onClick={handleNext}>Next</button>

                    </div>
                )}
                {currentStep === 3 && (
                    <div className="step step-3 active">
                        <div className="form-group">
                            <label htmlFor="bankroll">Starting bankroll</label>
                            <input type="text" id="bankroll" name="bankroll" placeholder='$1000000000' onChange={handleInput} value={values.bankroll}></input>
                        </div>
                        {errors.bankroll && <span className="text-danger">{errors.bankroll}</span>}
                        <div className="form-group">
                            <label htmlFor="category">What do you play the most?</label>
                            <select type="text" id="category" name="category" value={values.category} onChange={handleInput}>
                                <option value="poker">Poker</option>
                                <option value="sports">Sports betting</option>
                                <option value="casino games">Casino</option>
                            </select>
                        </div>
                        <button type="button" className="next-btn" onClick={sendEmail}>Send Code</button>
                    </div>
                )}
                {currentStep === 4 && (
                    <div className="step step-4 active">
                        <div className="form-group">
                            <label htmlFor="reg_code" className="header">Code</label>
                            <input type="text" id="reg_code" name="reg_code" placeholder="Code" onChange={handleInput} value={values.reg_code} ></input>
                        </div>
                        <div className="form-group promotions">
                            <input type="checkbox" id="promotions" name="promotions" onChange={handleInput} value={values.promotions}></input>
                            <label htmlFor="promotions">Would you like to receive promotions?</label>
                        </div>
                        <button type="submit" className="submit-btn" onClick={handleSubmit}>Verify</button>
                    </div>
                )}
            </form>
        </div>
    );
}

function Register() {
    return (
        <div className="Login">
            <RegisterScreen />
        </div>
    );
}

export default Register;