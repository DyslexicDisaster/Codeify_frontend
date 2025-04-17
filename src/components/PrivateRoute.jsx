import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { user } = useAuth();
    const location = useLocation();
    // if not logged in, send to /login and carry a message
    return user
        ? children
        : <Navigate to="/login" state={{ message: 'Please login first' }} replace />;
}