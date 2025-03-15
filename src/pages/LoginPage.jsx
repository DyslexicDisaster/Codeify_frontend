import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { loginUser } from '../services/userService';

const LoginPage = ({ loggedInUser, setLoggedInUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Check for any message passed through navigation state
    useEffect(() => {
        if (location.state?.message) {
            setInfoMessage(location.state.message);
            // Clear the location state to prevent message from persisting on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

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
        setIsLoading(true);

        try {
            const response = await loginUser(formData.username, formData.password);
            if (response.message === "Login successful") {
                setLoggedInUser({
                    username: response.username,
                    role: response.role
                });
                navigate('/questions');
            } else {
                setErrorMessage(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage(error.response?.data || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout loggedInUser={loggedInUser}>
            <div className="container mt-5 main-content">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        {infoMessage && (
                            <div className="alert alert-info fade-in-up mb-4" role="alert">
                                <i className="fas fa-info-circle me-2"></i>
                                {infoMessage}
                            </div>
                        )}

                        <div className="card shadow fade-in">
                            <div className="card-header bg-transparent">
                                <h3 className="text-center mb-0">Login to Codeify</h3>
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
                                            <span className="input-group-text bg-transparent">
                                                <i className="fas fa-user"></i>
                                            </span>
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
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-transparent">
                                                <i className="fas fa-lock"></i>
                                            </span>
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
                                                    Logging in...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-sign-in-alt me-2"></i>
                                                    Login
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer bg-transparent text-center p-3">
                                <p className="mb-0">
                                    Don't have an account? <Link to="/register">Register here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .fade-in {
                    animation: fadeIn 0.5s ease-in-out forwards;
                }

                .fade-in-up {
                    animation: fadeInUp 0.5s ease-in-out forwards;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
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

                .alert-info {
                    background-color: rgba(0, 255, 136, 0.1);
                    border-color: rgba(0, 255, 136, 0.2);
                    color: var(--accent);
                }

                .main-content {
                    min-height: calc(100vh - 250px); /* Adjust the value based on your header/footer height */
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                }
            `}</style>
        </Layout>
    );
};

export default LoginPage;