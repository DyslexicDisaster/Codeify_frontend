import React from 'react';
import { Link } from 'react-router-dom';

const Menu = ({ loggedInUser }) => {
    const isAdmin = loggedInUser && loggedInUser.role === 'admin';

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <i className="fas fa-code me-2"></i>
                    Codeify
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="fas fa-home me-1"></i> Home
                            </Link>
                        </li>

                        {loggedInUser && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/questions">
                                        <i className="fas fa-question-circle me-1"></i> Practice
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                        <i className="fas fa-user-circle me-1"></i> Profile
                                    </Link>
                                </li>
                            </>
                        )}

                        {isAdmin && (
                            <li className="nav-item">
                                <Link className="nav-link admin-link" to="/admin">
                                    <i className="fas fa-cogs me-1"></i> Admin Panel
                                </Link>
                            </li>
                        )}
                    </ul>

                    <ul className="navbar-nav">
                        {!loggedInUser ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">
                                        <i className="fas fa-user-plus me-1"></i> Register
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">
                                        <i className="fas fa-sign-in-alt me-1"></i> Login
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <span className="nav-link user-welcome">
                                        <i className="fas fa-user me-1"></i> Welcome, {loggedInUser.username}
                                    </span>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link logout-link" to="/logout">
                                        <i className="fas fa-sign-out-alt me-1"></i> Logout
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .navbar {
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    padding: 0.75rem 1rem;
                }

                .navbar-brand {
                    font-weight: 700;
                    color: var(--accent) !important;
                    transition: all 0.3s ease;
                }

                .navbar-brand:hover {
                    transform: scale(1.05);
                }

                .nav-link {
                    padding: 0.5rem 1rem;
                    transition: all 0.3s ease;
                    border-radius: 5px;
                    margin: 0 0.1rem;
                }

                .nav-link:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }

                .admin-link {
                    background-color: rgba(0, 255, 136, 0.1);
                    color: var(--accent);
                    font-weight: 500;
                }

                .admin-link:hover {
                    background-color: rgba(0, 255, 136, 0.2);
                }

                .dropdown-menu {
                    border: 1px solid #444;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                    padding: 0.5rem;
                }

                .dropdown-item {
                    padding: 0.5rem 1rem;
                    border-radius: 5px;
                    transition: all 0.3s ease;
                }

                .dropdown-item:hover {
                    background-color: rgba(0, 255, 136, 0.1);
                }

                .dropdown-divider {
                    border-top: 1px solid #444;
                }

                .user-welcome {
                    color: var(--accent);
                    font-weight: 500;
                    cursor: default;
                }

                .logout-link {
                    color: #ff6b6b;
                }

                .logout-link:hover {
                    background-color: rgba(255, 107, 107, 0.1);
                }

                @media (max-width: 992px) {
                    .navbar-nav {
                        padding: 0.5rem 0;
                    }

                    .nav-link {
                        padding: 0.75rem 1rem;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Menu;