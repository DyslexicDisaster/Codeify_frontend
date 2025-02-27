import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';
import { loginUser } from '../services/userService';

const LoginPage = ({ loggedInUser, setLoggedInUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginUser(formData.username, formData.password);
            if (response.message === "Login successful") {
                // Update the loggedInUser state if your app tracks it
                setLoggedInUser(response.username);
                navigate('/');
            } else {
                setErrorMessage(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.response?.data || 'An error occurred during login');
        }
    };

    return (
        <>
            <Menu loggedInUser={loggedInUser} />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header">
                                <h3 className="text-center mb-0">Login to Codeify</h3>
                            </div>
                            <div className="card-body">
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            placeholder="Enter your username"
                                            required
                                            autoFocus
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            placeholder="Enter your password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">Login</button>
                                    </div>
                                </form>
                                <div className="text-center mt-3">
                                    <p>
                                        Don't have an account? <Link to="/register">Register here</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
