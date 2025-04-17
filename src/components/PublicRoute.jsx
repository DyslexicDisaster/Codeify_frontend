import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children }) {
    const { user } = useAuth();
    // if already logged in, go home
    return user ? <Navigate to="/" replace /> : children;
}