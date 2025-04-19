import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { GOOGLE_AUTH_URL, MICROSOFT_AUTH_URL } from '../constants';
import { loginUser } from '../services/userService';
import Cookies from 'js-cookie';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const infoMessage = location.state?.message;
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        if (infoMessage) {
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
            <div className="container mt-5 main-content" style={{ maxWidth: 400 }}>
                {infoMessage && <div className="alert alert-info">{infoMessage}</div>}
                {error       && <div className="alert alert-danger">{error}</div>}

                <div className="card shadow fade-in">
                    <div className="card-header bg-transparent text-center">
                        <h4 className="mb-0">Login to Codeify</h4>
                    </div>
                    <div className="card-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-user"></i></span>
                                    <input
                                        id="username"
                                        name="username"
                                        className="form-control"
                                        placeholder="Enter username"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="d-grid mb-3">
                                <button
                                    className="btn btn-accent w-100"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Logging in…</>
                                        : <><i className="fas fa-sign-in-alt me-2"></i>Login</>
                                    }
                                </button>
                            </div>

                            {/* Forgotten Password Button */}
                            <div className="d-grid mb-3">
                                <Link to="/forgot-password" className="btn btn-outline-accent w-100">
                                    Forgot Password
                                </Link>
                            </div>
                        </form>

                        <div className="d-flex justify-content-center gap-2 mb-3">
                            <a className="btn btn-outline-danger flex-fill" href={GOOGLE_AUTH_URL}>
                                <i className="fab fa-google me-2"></i>Google
                            </a>
                            <a className="btn btn-outline-primary flex-fill" href={MICROSOFT_AUTH_URL}>
                                <i className="fab fa-microsoft me-2"></i>Microsoft
                            </a>
                        </div>
                    </div>
                    <div className="card-footer text-center">
                        Don’t have an account? <Link to="/register" className="text-accent">Register here</Link>
                    </div>
                </div>

                <style>{`
                    .fade-in { animation: fadeIn 0.5s ease-in-out forwards; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    .main-content { min-height: calc(100vh - 250px); }
                    .card { border-radius: 15px; overflow: hidden; border:1px solid #333; }
                    .form-control, .input-group-text { border-radius:8px; padding:10px 15px; }
                    .input-group .form-control { border-top-left-radius:0; border-bottom-left-radius:0; }
                    .input-group-text { background-color: var(--dark-secondary); border-color:#444; color: var(--accent); border-top-right-radius:0; border-bottom-right-radius:0; min-width:45px; display:flex; justify-content:center; }
                    .btn-accent { background-color: var(--accent); color: var(--dark-bg); font-weight:600; padding:10px; border-radius:8px; text-transform:uppercase; letter-spacing:1px; }
                    .btn-accent:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,255,136,0.3); background-color:#00cc6a; }
                    .btn-outline-accent { border: 1px solid var(--accent); color: var(--accent); background: transparent; }
                    .btn-outline-accent:hover { background: var(--accent); color: var(--dark-bg); }
                    .text-accent { color: var(--accent) !important; font-weight:500; text-decoration:none; }
                    .btn-outline-danger, .btn-outline-primary { border-radius:8px; padding:10px; text-transform:uppercase; }
                `}</style>
            </div>
        </Layout>
    );
}