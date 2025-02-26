import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';
import { registerUser } from '../services/userService';

const RegisterPage = ({ loggedInUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
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

    const validateForm = () => {
        const { username, email, password, repeatPassword } = formData;
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!username.trim() || !email.trim() || !password || !repeatPassword) {
            setErrorMessage("Please fill in all required fields.");
            return false;
        }

        if (!passwordPattern.test(password)) {
            setErrorMessage('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');
            return false;
        }

        if (password !== repeatPassword) {
            setErrorMessage('Passwords do not match.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            const response = await registerUser(formData.username, formData.password, formData.email);
            if (response.message === "User registered successfully") {
                navigate('/login');
            } else {
                setErrorMessage(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(error.response?.data || 'An error occurred during registration');
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
                                <h3 className="text-center mb-0">Register for Codeify</h3>
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
                                            placeholder="Choose a username"
                                            required
                                            autoFocus
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            required
                                            value={formData.email}
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
                                            placeholder="Enter a password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <small className="mb-3">
                                            Password must contain at least 8 characters, one uppercase letter,
                                            one lowercase letter, one number, and one special character.
                                        </small>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="repeatPassword" className="form-label">Repeat Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="repeatPassword"
                                            name="repeatPassword"
                                            placeholder="Repeat your password"
                                            required
                                            value={formData.repeatPassword}
                                            onChange={handleChange}
                                        />
                                        <small className="mb-3">
                                            Must be the same as the password above.
                                        </small>
                                    </div>
                                    <div className="d-grid gap-2">
                                        <button type="submit" className="btn btn-primary">Register</button>
                                    </div>
                                </form>
                                <div className="text-center mt-3">
                                    <p>
                                        Already have an account? <Link to="/login">Login here</Link>
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

export default RegisterPage;
