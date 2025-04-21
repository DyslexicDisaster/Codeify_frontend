import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { registerUser } from '../services/userService';

/**
 * RESOURCES
 * https://www.w3schools.com/js/js_validation.asp
 * https://getbootstrap.com/docs/5.3/forms/validation/
 * https://legacy.reactjs.org/docs/forms.html
 *
 */

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let msg = '';
        switch (name) {
            case 'username':
                if (!value.trim()) {
                    msg = 'Username is required.';
                } else if (value.length < 3 || value.length > 20) {
                    msg = 'Username needs 3–20 chars.';
                } else if (!/^[A-Za-z0-9_]+$/.test(value)) {
                    msg = 'Only letters, numbers, and underscores.';
                }
                break;
            case 'email':
                if (!value.trim()) {
                    msg = 'Email is required.';
                } else if (!/^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value)) {
                    msg = 'Invalid email format.';
                }
                break;
            case 'password':
                if (!value) {
                    msg = 'Password is required.';
                } else if (
                    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$#!%*?&]).{8,}$/.test(value)
                ) {
                    msg = 'Password must be ≥8 chars, mixed case, number & symbol.';
                }
                break;
            case 'repeatPassword':
                if (!value) {
                    msg = 'Please confirm your password.';
                } else if (value !== formData.password) {
                    msg = 'Passwords must match.';
                }
                break;
            default:
        }
        setErrors(e => ({ ...e, [name]: msg }));
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(f => ({ ...f, [name]: value }));
        validateField(name, value);
        setSubmitError('');
    };

    const canSubmit =
        Object.values(errors).every(x => !x) &&
        formData.username &&
        formData.email &&
        formData.password &&
        formData.repeatPassword;

    const handleSubmit = async e => {
        e.preventDefault();
        if (!canSubmit) return;
        setIsLoading(true);
        try {
            const resp = await registerUser(
                formData.username,
                formData.password,
                formData.email
            );
            if (resp === 'User registered successfully') {
                navigate('/login', {
                    state: { message: 'Registration successful! Please log in.' }
                });
            } else {
                setSubmitError(resp);
            }
        } catch (err) {
            setSubmitError(err.message || 'Registration failed');
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
                                <h3 className="text-center mb-0">Register for Codeify</h3>
                            </div>
                            <div className="card-body p-4">
                                {submitError && (
                                    <div className="alert alert-danger">{submitError}</div>
                                )}
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-user"></i></span>
                                            <input
                                                type="text"
                                                className={`form-control ${
                                                    errors.username ? 'is-invalid' : ''
                                                }`}
                                                id="username"
                                                name="username"
                                                placeholder="Choose a username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                onBlur={e =>
                                                    validateField('username', e.target.value)
                                                }
                                            />
                                            {errors.username && (
                                                <div className="invalid-feedback">
                                                    {errors.username}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                            <input
                                                type="email"
                                                className={`form-control ${
                                                    errors.email ? 'is-invalid' : ''
                                                }`}
                                                id="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                onBlur={e => validateField('email', e.target.value)}
                                            />
                                            {errors.email && (
                                                <div className="invalid-feedback">{errors.email}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                            <input
                                                type="password"
                                                className={`form-control ${
                                                    errors.password ? 'is-invalid' : ''
                                                }`}
                                                id="password"
                                                name="password"
                                                placeholder="Enter a password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                onBlur={e =>
                                                    validateField('password', e.target.value)
                                                }
                                            />
                                            {errors.password && (
                                                <div className="invalid-feedback">
                                                    {errors.password}
                                                </div>
                                            )}
                                        </div>
                                        <small className="text-success">
                                            Password must contain at least 8 characters, one uppercase letter,
                                            one lowercase letter, one number, and one special character.
                                        </small>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="repeatPassword" className="form-label">Repeat Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text"><i className="fas fa-lock"></i></span>
                                            <input
                                                type="password"
                                                className={`form-control ${
                                                    errors.repeatPassword ? 'is-invalid' : ''
                                                }`}
                                                id="repeatPassword"
                                                name="repeatPassword"
                                                placeholder="Repeat your password"
                                                value={formData.repeatPassword}
                                                onChange={handleChange}
                                                onBlur={e =>
                                                    validateField('repeatPassword', e.target.value)
                                                }
                                            />
                                            {errors.repeatPassword && (
                                                <div className="invalid-feedback">
                                                    {errors.repeatPassword}
                                                </div>
                                            )}
                                        </div>
                                        <small className="text-success">Must be the same as the password above.</small>
                                    </div>

                                    <div className="d-grid mb-3">
                                        <button
                                            type="submit"
                                            className="btn btn-accent"
                                            disabled={!canSubmit || isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                          <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                          />
                                                    Registering…
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-user-plus me-2"></i>Register
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                <div className="text-center mt-4">
                                    <p className="mb-1">
                                        Already have an account? <Link to="/login">Login here</Link>
                                    </p>
                                    <p className="mb-0">
                                        <Link to="/forgot-password" className="text-accent">Forgot your password?</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .fade-in { 
            animation: fadeIn 0.5s ease-in-out forwards; 
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .main-content { 
            min-height: calc(100vh - 250px); 
            margin-bottom: 4rem; 
        }
            
        .card { 
            border-radius: 15px; 
            overflow: hidden; 
            box-shadow: 0 10px 20px rgba(0,0,0,0.2); 
            border: 1px solid #333; 
        }
        
        .input-group-text, .form-control { 
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
            box-shadow: 0 5px 15px rgba(0,255,136,0.3); 
            background-color: #00cc6a; 
        }
        
        small { 
            display: block; 
            margin-top: 5px; 
            font-size: 0.8rem; 
        }
      `}</style>
        </Layout>
    );
};

export default RegisterPage;