import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import

const UserForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            if (!isLogin) {
                // Registration validation
                if (!formData.name || !formData.username || !formData.email || !formData.password) {
                    setMessage('All fields are required');
                    return;
                }

                if (!validateEmail(formData.email)) {
                    setMessage('Invalid email format');
                    return;
                }

                if (formData.password !== formData.confirmPassword) {
                    setMessage('Passwords do not match');
                    return;
                }

                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.name,
                        username: formData.username,
                        email: formData.email,
                        password: formData.password
                    }),
                });

                const data = await response.json();

                if (response.status === 201) {
                    setMessage('User created successfully');
                    setTimeout(() => setIsLogin(true), 2000);
                } else if (response.status === 409) {
                    setMessage('Username or email already exists');
                } else {
                    setMessage(data.message || 'Error creating user. Please try again.');
                }
            } else {
                // Login validation
                if (!formData.username || !formData.password) {
                    setMessage('Username and password are required');
                    return;
                }

                const response = await fetch('/api/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        password: formData.password
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);

                    // Decode the token
                    const decodedToken = jwtDecode(data.token); // Use jwtDecode here
                    if (decodedToken.role === 'admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/user-dashboard');
                    }

                    setMessage('Login successful');
                } else {
                    setMessage(data.message || 'Invalid credentials');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage(error.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-md bg-base-100 shadow-xl">
            <div className="card-body p-8">
                <div className="flex justify-between items-center mb-6">
                    <div className="tabs tabs-boxed">
                        <button
                            className={`tab ${isLogin ? 'tab-active' : ''}`}
                            onClick={() => {
                                setIsLogin(true);
                                setMessage('');
                                setFormData({
                                    username: '',
                                    email: '',
                                    name: '',
                                    password: '',
                                    confirmPassword: ''
                                });
                            }}
                        >
                            Login
                        </button>
                        <button
                            className={`tab ${!isLogin ? 'tab-active' : ''}`}
                            onClick={() => {
                                setIsLogin(false);
                                setMessage('');
                                setFormData({
                                    username: '',
                                    email: '',
                                    name: '',
                                    password: '',
                                    confirmPassword: ''
                                });
                            }}
                        >
                            Register
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Confirm Password</span>
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="input input-bordered w-full"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {isLogin && (
                        <div className="text-right">
                            <button
                                type="button"
                                className="btn btn-link btn-sm px-0 text-primary"
                                disabled={isLoading}
                                onClick={() => setMessage('Password reset functionality not implemented')}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`btn btn-primary w-full mt-6 ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                {message && (
                    <div className={`alert mt-4 ${
                        message.includes('success') ? 'alert-success' :
                            message.includes('Error') || message.includes('Invalid') ? 'alert-error' :
                                'alert-info'
                    }`}>
                        <span>{message}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserForm;