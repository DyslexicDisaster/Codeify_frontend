import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const HomePage = ({ loggedInUser }) => {
    return (
        <Layout loggedInUser={loggedInUser}>
            <section className="hero-section">
                <div className="container text-center">
                    <h1 className="display-4 fw-bold mb-4 hero-text">Master Coding Through Practice</h1>
                    <p className="lead mb-5">Improve your programming skills with hands-on exercises in Java, MySQL, and JavaScript</p>
                    <Link to="/questions" className="btn btn-accent btn-lg">
                        <i className="fas fa-code me-2"></i>Start Learning
                    </Link>
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="feature-card h-100">
                                <h3 className="mb-3">Interactive Challenges</h3>
                                <p>Solve real-world coding problems with instant feedback and AI-powered solutions.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card h-100">
                                <h3 className="mb-3">Progress Tracking</h3>
                                <p>Monitor your learning journey with detailed statistics and achievement badges.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="feature-card h-100">
                                <h3 className="mb-3">Leaderboards</h3>
                                <p>Compete with other learners and climb the ranks through consistent practice.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 stat-item">
                            <div className="stat-number">10+</div>
                            <div>Coding Challenges</div>
                        </div>
                        <div className="col-md-4 stat-item">
                            <div className="stat-number">3+</div>
                            <div>Active Users</div>
                        </div>
                        <div className="col-md-4 stat-item">
                            <div className="stat-number">TBA</div>
                            <div>Solutions Submitted</div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default HomePage;