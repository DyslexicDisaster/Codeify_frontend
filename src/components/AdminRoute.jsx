import React from 'react';
import { Navigate } from 'react-router-dom';


const AdminRoute = ({ element, loggedInUser }) => {
    const isAdmin = loggedInUser && loggedInUser.role === 'admin';

    if (!loggedInUser) {
        return <Navigate to="/login" state={{ message: 'Please login to access the admin panel.' }} replace />;
    } else if (!isAdmin) {
        return <Navigate to="/" state={{ message: 'You do not have permission to access the admin panel.' }} replace />;
    }

    return element;
};

export default AdminRoute;