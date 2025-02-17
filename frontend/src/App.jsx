import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserForm from './components/UserForm';
import { getRoleFromToken } from '../utils/auth'; // Import the Dashboard page

const App = () => {
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('token'); // Remove token first (if necessary)

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const decodedRole = getRoleFromToken(token);
        if (decodedRole) {
            setRole(decodedRole);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            {role && <Navbar role={role} onLogout={handleLogout} />}
            <Routes>
                <Route path="/login" element={<UserForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </div>
    );
};

export default App;
