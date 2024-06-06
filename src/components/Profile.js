import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/Profile.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const ProfileView = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/User/');
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data?.message || error.message);
            }
        };

        fetchData();
    }, []);

    const handleLogout = async (event) => {
        event.preventDefault();
        const csrftoken = Cookies.get('csrftoken');
        console.log(csrftoken);
        try {
            const response = await axios.post('http://127.0.0.1:8000/Logout/', {}, {
                headers: {
                    'X-CSRFToken': 'TuEbdYN14qcOlPRMNFKv6YZZCT1ad0ep'
                }
            });
            console.log('Response:', response.data);
            navigate('/');
        } catch (error) {
            console.error('Error:', error.response?.data?.message || error.message);
        }
    }

    return (
        <div className="profile-container">
            <h1 className="profile-header">Welcome, {userData?.username}</h1>
            <div className="profile-info">
                <h3 className="profile-info-item">Username: {userData?.username}</h3>
                <h3 className="profile-info-item">Email: {userData?.email}</h3>
                <h3 className="profile-info-item">Bankroll: {userData?.bankroll}</h3>
            </div>
            <button className="profile-logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
}

function Profile() {
    return (
        <div className="profile-page-container">
            <div className="profile">
                <ProfileView />
            </div>
        </div>
    );
}

export default Profile;
