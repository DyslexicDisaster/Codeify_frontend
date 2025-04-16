import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants'; // Now properly imported

const OAuth2Success = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        if (token) {
            localStorage.setItem(ACCESS_TOKEN, token);
            navigate('/', {
                state: { from: location },
                replace: true
            });
        } else {
            navigate('/login', {
                state: {
                    error: error || 'Authentication failed'
                },
                replace: true
            });
        }
    }, [navigate, location]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Completing authentication...</p>
            </div>
        </div>
    );
};

export default OAuth2Success;