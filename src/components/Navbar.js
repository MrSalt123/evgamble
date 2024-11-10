// Navbar.js

import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import './styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

const Navbar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

    useEffect(() => {
		if (localStorage.getItem('loggedIn') === 'true') {
			setIsAuthenticated(true);
		}
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get('Authenticated/');
                setIsAuthenticated(response.data);
            } catch (error) {
                console.error('Error checking authentication status', error);
            }
        };

        // checkAuth();
    }, []);

	const handleLogout = async (event) => {
		const csrftoken = localStorage.getItem('csrftoken');
		try {
			const response = await axiosInstance.post('Logout/', {}, {
				headers: {
					'X-CSRFToken' : csrftoken
				}
			});
			console.log(response.data);
			localStorage.removeItem('csrftoken');
			localStorage.setItem('loggedIn', 'false');
			setIsAuthenticated(false);
			navigate('/login');
		} catch (error) {
			console.error('Error: ', error.response?.data);
		}
	}

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
                    <DropdownButton id="dropdown-basic-button" title={<span className="material-symbols-outlined">person</span>}>
						<Dropdown.Item href="/profile">Profile</Dropdown.Item>
						<Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
						<Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
					</DropdownButton>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
