import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { forgotPassword } from '../services/userService';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        console.debug('[ForgotPasswordPage] handleSubmit', email);
        setIsLoading(true);
        try {
            const msg = await forgotPassword(email);
            console.debug('[ForgotPasswordPage] success:', msg);
            setFeedback('If that email exists, you’ll receive a reset link shortly.');
        } catch (err) {
            console.error('[ForgotPasswordPage] error:', err);
            setFeedback(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mt-5 main-content mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow fade-in">
                            <div className="card-header bg-transparent">
                                <h3 className="text-center mb-0">Forgot Password?</h3>
                            </div>
                            <div className="card-body p-4">
                                {feedback && (
                                    <div className="alert alert-info" role="alert">
                                        {feedback}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                placeholder="Enter your registered email"
                                                required
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-grid mb-3">
                                        <button
                                            type="submit"
                                            className="btn btn-accent"
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? (<><span className="spinner-border spinner-border-sm me-2" role="status"/></>)
                                                : 'Send Reset Link'}
                                        </button>
                                    </div>
                                </form>
                                <div className="text-center mt-4">
                                    <p className="mb-0">
                                        Remembered? <Link to="/login">Back to Login</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .main-content { min-height: calc(100vh - 250px); margin-bottom: 4rem; }
        .card { border-radius: 15px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.2); border: 1px solid #333; }
        .input-group-text, .form-control { border-radius: 8px; padding: 10px 15px; }
        .input-group .form-control { border-top-left-radius: 0; border-bottom-left-radius: 0; }
        .input-group-text { border-top-right-radius: 0; border-bottom-right-radius: 0; background-color: var(--dark-secondary); border-color: #444; color: var(--accent); min-width: 45px; display: flex; justify-content: center; }
        .btn-accent { background-color: var(--accent); color: var(--dark-bg); font-weight: 600; padding: 10px; border-radius: 8px; transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; }
        .btn-accent:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,255,136,0.3); background-color: #00cc6a; }
        .text-muted { color: #aaa !important; }
      `}</style>
        </Layout>
    );
};

export default ForgotPasswordPage;