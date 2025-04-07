import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { registerUser } from '../services/userService';

const RegisterPage = ({ loggedInUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input changes and clear any previous error messages.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrorMessage('');
    };

    // Validate form data before submission.
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

    // Handle form submission.
    // After a successful registration, navigate to the login page with a success message.
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            console.log("Validation failed", formData);
            return;
        }

        setIsLoading(true);

        try {
            const response = await registerUser(formData.username, formData.password, formData.email);
            console.log("Register response:", response);
            if (response.message === "User registered successfully") {
                navigate('/login', {
                    state: { message: 'Registration successful! Please login with your new account.' }
                });
            } else {
                setErrorMessage(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(error.response?.data || 'An error occurred during registration');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout loggedInUser={loggedInUser}>
            <div className="container mt-5 main-content">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow fade-in">
                            <div className="card-header bg-transparent">
                                <h3 className="text-center mb-0">Register for Codeify</h3>
                            </div>
                            <div className="card-body p-4">
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-user"></i>
                                            </span>
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
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-envelope"></i>
                                            </span>
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
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-lock"></i>
                                            </span>
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
                                        </div>
                                        <small className="text-muted">
                                            Password must contain at least 8 characters, one uppercase letter,
                                            one lowercase letter, one number, and one special character.
                                        </small>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="repeatPassword" className="form-label">Repeat Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="fas fa-lock"></i>
                                            </span>
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
                                        </div>
                                        <small className="text-muted">
                                            Must be the same as the password above.
                                        </small>
                                    </div>
                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-accent"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Registering...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-user-plus me-2"></i>
                                                    Register
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                <div className="text-center mt-4">
                                    <p className="mb-0">
                                        Already have an account? <Link to="/login">Login here</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .fade-in {
                    animation: fadeIn 0.5s ease-in-out forwards;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .main-content {
                    min-height: calc(100vh - 250px);
                }
                
                .card {
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                    border: 1px solid #333;
                }
                
                .form-control, .input-group-text {
                    border-radius: 8px;
                    padding: 10px 15px;
                }
                
                .input-group .form-control {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                }
                
                .input-group-text {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                    background-color: var(--dark-secondary);
                    border-color: #444;
                    color: var(--accent);
                    min-width: 45px;
                    display: flex;
                    justify-content: center;
                }
                
                .btn-accent {
                    background-color: var(--accent);
                    color: var(--dark-bg);
                    font-weight: 600;
                    padding: 10px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .btn-accent:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
                    background-color: #00cc6a;
                }
                
                small {
                    display: block;
                    margin-top: 5px;
                    font-size: 0.8rem;
                }
                
                .text-muted {
                    color: #aaa !important;
                }
            `}</style>
        </Layout>
    );
};

export default RegisterPage;
