import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_AUTH_URL } from '../constants';
import { loginUser } from '../services/userService';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [infoMessage, setInfoMessage] = useState(location.state?.message || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (location.state?.message) {
            setInfoMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await loginUser(formData.username, formData.password);
            if (response.message === 'Login successful' && response.token) {
                Cookies.set('jwtToken', response.token, { expires: 1, sameSite: 'Lax' });
                login(response.token);
                navigate('/questions', { replace: true });
            } else {
                setErrorMessage(response.message || 'Login failed');
            }
        } catch (error) {
            setErrorMessage(error.response?.data || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mt-5 main-content">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        {infoMessage && (
                            <div className="alert alert-info mb-4" role="alert">
                                {infoMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <div className="card shadow">
                            <div className="card-header bg-transparent text-center">
                                <h3 className="mb-0">Login to Codeify</h3>
                            </div>
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            className="form-control"
                                            placeholder="Enter your username"
                                            required
                                            autoFocus
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Enter your password"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
                                            {isLoading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="card-footer bg-transparent text-center p-3">
                                <p className="mb-0">
                                    Or sign in with <a href={GOOGLE_AUTH_URL} className="btn btn-outline-danger btn-sm ms-2">Google</a>
                                </p>
                                <p className="mt-2 mb-0">
                                    Don't have an account? <Link to="/register">Register here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}