import React from 'react';
import { Link } from 'react-router-dom';

const Menu = ({ loggedInUser }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Codeify</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        {!loggedInUser && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>
                            </>
                        )}
                        {loggedInUser && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/logout">Logout</Link>
                            </li>
                        )}
                        {!loggedInUser && (
                            <li className="nav-item">
                                <Link className="nav-link" to="/codeEditor">Code</Link>
                            </li>
                        )}
                    </ul>

                    {loggedInUser && (
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Button 4</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Button 5</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Button 6</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Button 7</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="#">Button 8</Link>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Menu;