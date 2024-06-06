// Navbar.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Navbar.css';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/Authenticated/');
                setIsAuthenticated(response.data);
            } catch (error) {
                console.error('Error checking authentication status', error);
            }
        };

        checkAuth();
    }, []);

    return (
        <nav className="navbar-container">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <a href="/" className="navbar-link"><span className="material-symbols-outlined">home</span></a>
                </li>
                <li className="navbar-item">
                    <a href="/news" className="navbar-link"><span className="material-symbols-outlined">feed</span></a>
                </li>
                <li className="navbar-item">
                    <a href="/bankroll" className="navbar-link"><span className="material-symbols-outlined">local_atm</span></a>
                </li>
                <li className="navbar-item">
                    {isAuthenticated ? (
                        <a href="/profile" className="navbar-link"><span className="material-symbols-outlined">person</span></a>
                    ) : (
                        <a href="/login" className="navbar-link"><span className="material-symbols-outlined">person</span></a>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
