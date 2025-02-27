import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Menu';
import { logoutUser } from '../services/userService';

const LogoutPage = ({ loggedInUser, setLoggedInUser }) => {
    const [message, setMessage] = useState('Logging out...');
    const navigate = useNavigate();

    useEffect(() => {
        const performLogout = async () => {
            try {
                // Call the backend logout endpoint
                await logoutUser();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // Clear stored user information and update global state
                localStorage.removeItem('user');
                setLoggedInUser(null);
                // Set the updated message
                setMessage("You have successfully logged out have a great day");
            }
        };

        performLogout();
    }, [setLoggedInUser]);

    return (
        <>
            <Menu loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header">
                                <h3 className="text-center mb-0">Logout</h3>
                            </div>
                            <div className="card-body text-center">
                                <p>{message}</p>
                                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                                    Go to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogoutPage;
