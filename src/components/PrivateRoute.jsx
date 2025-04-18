import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { user } = useAuth();
    // If not logged in, send to /login
    return user
        ? children
        : <Navigate to="/login" replace state={{ message: 'Please log in first' }} />;
}