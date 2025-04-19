import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/userService';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [repeat, setRepeat] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/forgot-password', { replace: true });
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== repeat) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, password);
            setSuccess('Password has been reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5 main-content">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow fade-in">
                        <div className="card-header bg-transparent">
                            <h3 className="text-center mb-0">Reset Your Password</h3>
                        </div>
                        <div className="card-body p-4">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            {token && (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">New Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-lock" /></span>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                placeholder="Enter new password"
                                                required
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="repeat" className="form-label">Confirm Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-lock" /></span>
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="repeat"
                                                placeholder="Confirm new password"
                                                required
                                                value={repeat}
                                                onChange={e => setRepeat(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-accent"
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? <><span className="spinner-border spinner-border-sm me-2" role="status" />Resetting...</>
                                                : 'Reset Password'
                                            }
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="text-center mt-4">
                                <p className="mb-0">
                                    Didn't receive a link? <Link to="/forgot-password">Resend</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;