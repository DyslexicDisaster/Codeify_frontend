import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Menu from '../components/Menu';

const LoginFailedPage = ({ loggedInUser }) => {
    const location = useLocation();
    const errorMessage = location.state?.message || 'Invalid credentials.';

    return (
        <>
            <Menu loggedInUser={loggedInUser} />
            <div className="container mt-5">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Login Failed</h4>
                    <p>{errorMessage}</p>
                    <hr />
                    <p className="mb-0">
                        Please <Link to="/login">try again</Link> or{' '}
                        <Link to="/register">register</Link> if you don't have an account.
                    </p>
                </div>
            </div>
        </>
    );
};

export default LoginFailedPage;