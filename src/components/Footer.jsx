import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section brand">
                    <Link to="/" className="footer-logo">
                        <i className="fas fa-code logo-icon"></i>
                        <span>Codeify</span>
                    </Link>
                    <p className="footer-tagline">
                        Empowering developers to learn, practice, and excel in programming.
                    </p>
                    <div className="social-links">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <i className="fab fa-github"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i className="fab fa-linkedin"></i>
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord">
                            <i className="fab fa-discord"></i>
                        </a>
                    </div>
                </div>

                <div className="footer-sections">
                    <div className="footer-section links">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/questions">Practice</Link></li>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/login">Login</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section contact">
                        <h3>Stay Updated</h3>
                        <p>Subscribe to our newsletter for the latest updates.</p>
                        <div className="newsletter-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="newsletter-input"
                            />
                            <button className="newsletter-btn">
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {currentYear} Codeify. All rights reserved.</p>
            </div>

            <style>{`
                .footer {
                    background: linear-gradient(180deg, var(--dark-bg) 0%, #1a1a1a 100%);
                    color: #f8f8f8;
                    padding: 0;
                    position: relative;
                    overflow: hidden;
                    border-top: 1px solid #333;
                }

                .footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--accent), #00cc6a, var(--accent));
                    z-index: 10;
                }

                .footer-content {
                    padding: 3rem 2rem 2rem;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                }

                .footer-section {
                    margin-bottom: 2rem;
                }

                .footer-sections {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 3rem;
                }

                .brand {
                    flex: 1 1 300px;
                    margin-right: 3rem;
                }

                .footer-logo {
                    display: flex;
                    align-items: center;
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--accent);
                    margin-bottom: 1rem;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .footer-logo:hover {
                    transform: scale(1.05);
                    text-decoration: none;
                    color: #00cc6a;
                }

                .logo-icon {
                    margin-right: 0.5rem;
                    font-size: 2rem;
                }

                .footer-tagline {
                    color: #ccc;
                    line-height: 1.6;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                }

                .social-links {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .social-links a {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background-color: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    color: #f8f8f8;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                }

                .social-links a:hover {
                    background-color: var(--accent);
                    color: #000;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
                }

                .footer-section h3 {
                    position: relative;
                    font-size: 1.2rem;
                    margin-bottom: 1.5rem;
                    color: #fff;
                    font-weight: 600;
                    padding-bottom: 0.5rem;
                }

                .footer-section h3::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 40px;
                    height: 2px;
                    background-color: var(--accent);
                }

                .footer-section.links ul {
                    list-style: none;
                    padding: 0;
                }

                .footer-section.links ul li {
                    margin-bottom: 0.8rem;
                }

                .footer-section.links ul li a {
                    color: #ccc;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;
                    padding-left: 15px;
                }

                .footer-section.links ul li a::before {
                    content: '→';
                    position: absolute;
                    left: 0;
                    color: var(--accent);
                    transition: transform 0.3s ease;
                }

                .footer-section.links ul li a:hover {
                    color: var(--accent);
                    padding-left: 20px;
                }

                .footer-section.links ul li a:hover::before {
                    transform: translateX(3px);
                }

                .newsletter-form {
                    display: flex;
                    margin-top: 1rem;
                }

                .newsletter-input {
                    flex: 1;
                    padding: 0.7rem 1rem;
                    border: none;
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #fff;
                    border-radius: 4px 0 0 4px;
                }

                .newsletter-input:focus {
                    outline: none;
                    background-color: rgba(255, 255, 255, 0.15);
                }

                .newsletter-btn {
                    padding: 0 1rem;
                    background-color: var(--accent);
                    color: #000;
                    border: none;
                    border-radius: 0 4px 4px 0;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .newsletter-btn:hover {
                    background-color: #00cc6a;
                }

                .footer-bottom {
                    background-color: rgba(0, 0, 0, 0.2);
                    padding: 1.5rem 2rem;
                    text-align: center;
                }

                .footer-bottom p {
                    margin: 0;
                    color: #999;
                    font-size: 0.9rem;
                }

                @media (max-width: 992px) {
                    .footer-content {
                        flex-direction: column;
                    }

                    .brand {
                        margin-right: 0;
                        margin-bottom: 2rem;
                    }

                    .footer-sections {
                        width: 100%;
                    }
                }

                @media (max-width: 768px) {
                    .footer-sections {
                        flex-direction: column;
                        gap: 2rem;
                    }
                }
            `}</style>
        </footer>
    );
};

export default Footer;