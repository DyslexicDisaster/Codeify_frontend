import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_AUTH_URL, MICROSOFT_AUTH_URL } from '../constants';
import { loginUser } from '../services/userService';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const { login }    = useAuth();
    const navigate     = useNavigate();
    const location     = useLocation();
    const infoMessage  = location.state?.message;
    const [form, setForm]       = useState({ username: '', password: '' });
    const [error, setError]     = useState('');
    const [isLoading, setLoading] = useState(false);

    console.log('[LoginPage] render, user form=', form, 'infoMessage=', infoMessage);

    useEffect(() => {
        if (infoMessage) {
            console.log('[LoginPage] clearing location.state.message');
            window.history.replaceState({}, document.title);
        }
    }, [infoMessage]);

    const handleChange = e => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        console.log('[LoginPage] handleSubmit, form=', form);
        setLoading(true);

        try {
            const { message, token } = await loginUser(form.username, form.password);
            console.log('[LoginPage] loginUser response=', { message, token });

            if (message === 'Login successful' && token) {
                console.log('[LoginPage] setting JWT cookie');
                Cookies.set('jwtToken', token, { expires: 1, sameSite: 'Lax' });

                console.log('[LoginPage] calling context.login(token) and awaiting it');
                await login(token);

                console.log('[LoginPage] navigate to home');
                navigate('/', { replace: true });
            } else {
                console.warn('[LoginPage] login failed:', message);
                setError(message || 'Login failed');
            }
        } catch (err) {
            console.error('[LoginPage] error during login:', err);
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mt-5" style={{ maxWidth: 400 }}>
                {infoMessage && <div className="alert alert-info">{infoMessage}</div>}
                {error       && <div className="alert alert-danger">{error}</div>}

                <div className="card shadow">
                    <div className="card-body">
                        <h4 className="text-center mb-4">Login to Codeify</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Username</label>
                                <input
                                    name="username"
                                    className="form-control"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="mb-4">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <button
                                className="btn btn-accent w-100"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in…' : 'Login'}
                            </button>
                        </form>
                        <hr />
                        <div className="text-center">
                            <a
                                className="btn btn-outline-danger"
                                href={GOOGLE_AUTH_URL}
                            >
                                Sign in with Google
                            </a>
                            <a className="btn btn-outline-primary" href={MICROSOFT_AUTH_URL}>
                                Sign in with Microsoft
                            </a>
                        </div>
                    </div>
                    <div className="card-footer text-center">
                        Don’t have an account? <Link to="/register">Register here</Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}