import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
/**References:
 * https://www.youtube.com/watch?v=znbCa4Rr054 **/

const HomePage = ({ loggedInUser }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState({
        hero: false,
        features: false,
        stats: false
    });

    useEffect(() => {
        setIsVisible({
            hero: true,
            features: true,
            stats: true
        });

        const handleScroll = () => {
            const scrollPosition = window.scrollY + window.innerHeight;
            const featuresSection = document.querySelector('.features-section');
            const statsSection = document.querySelector('.stats-section');

            if (featuresSection && scrollPosition > featuresSection.offsetTop + 100) {
                setIsVisible(prev => ({ ...prev, features: true }));
            }

            if (statsSection && scrollPosition > statsSection.offsetTop + 100) {
                setIsVisible(prev => ({ ...prev, stats: true }));
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Layout loggedInUser={loggedInUser}>
            <section className="hero-section">
                <div className="code-background"></div>
                <div className={`container text-center ${isVisible.hero ? 'fade-in-up' : ''}`}>
                    <h1 className="display-4 fw-bold mb-4 hero-text glowing-text">
                        Master Coding Through Practice
                    </h1>
                    <p className="lead mb-5 typing-animation">
                        Improve your programming skills with hands-on exercises in Java, MySQL, and JavaScript
                    </p>
                    <button
                        onClick={() => {
                            if (loggedInUser) {
                                navigate('/questions');
                            } else {
                                navigate('/login', {
                                    state: { message: 'Please login or register first to access coding challenges.' }
                                });
                            }
                        }}
                        className="btn btn-accent btn-lg pulse-animation">
                        <i className="fas fa-code me-2"></i>Start Learning
                    </button>
                </div>
            </section>

            <section className="py-5 features-section">
                <div className="container">
                    <div className="row g-4">
                        <div className={`col-md-4 ${isVisible.features ? 'fade-in-left' : ''}`}>
                            <div className="feature-card h-100">
                                <div className="feature-icon">
                                    <i className="fas fa-laptop-code"></i>
                                </div>
                                <h3 className="mb-3">Interactive Challenges</h3>
                                <p>Solve real-world coding problems with instant feedback and AI-powered solutions.</p>
                            </div>
                        </div>
                        <div className={`col-md-4 ${isVisible.features ? 'fade-in-up' : ''}`} style={{ transitionDelay: '0.2s' }}>
                            <div className="feature-card h-100">
                                <div className="feature-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <h3 className="mb-3">Progress Tracking</h3>
                                <p>Monitor your learning journey with detailed statistics and achievement badges.</p>
                            </div>
                        </div>
                        <div className={`col-md-4 ${isVisible.features ? 'fade-in-right' : ''}`} style={{ transitionDelay: '0.4s' }}>
                            <div className="feature-card h-100">
                                <div className="feature-icon">
                                    <i className="fas fa-trophy"></i>
                                </div>
                                <h3 className="mb-3">Leaderboards</h3>
                                <p>Compete with other learners and climb the ranks through consistent practice.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`stats-section ${isVisible.stats ? 'fade-in' : ''}`}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 stat-item">
                            <div className="stat-number counter" data-target="10">0</div>
                            <div>Coding Challenges</div>
                        </div>
                        <div className="col-md-4 stat-item">
                            <div className="stat-number counter" data-target="3">0</div>
                            <div>Active Users</div>
                        </div>
                        <div className="col-md-4 stat-item">
                            <div className="stat-number">TBA</div>
                            <div>Solutions Submitted</div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .code-background {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, var(--dark-secondary), var(--dark-bg));
                    opacity: 0.8;
                    z-index: -1;
                    overflow: hidden;
                }

                .code-background::before {
                    content: "";
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23026d38' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3C/svg%3E") center/cover;
                    opacity: 0.15;
                }

                .glowing-text {
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.7), 0 0 20px rgba(0, 255, 136, 0.5), 0 0 30px rgba(0, 255, 136, 0.3);
                    animation: glow 2s ease-in-out infinite alternate;
                }

                @keyframes glow {
                    from {
                        text-shadow: 0 0 10px rgba(0, 255, 136, 0.7), 0 0 20px rgba(0, 255, 136, 0.5), 0 0 30px rgba(0, 255, 136, 0.3);
                    }
                    to {
                        text-shadow: 0 0 15px rgba(0, 255, 136, 0.8), 0 0 25px rgba(0, 255, 136, 0.6), 0 0 35px rgba(0, 255, 136, 0.4);
                    }
                }

                .typing-animation {
                    position: relative;
                    white-space: nowrap;
                    margin: 0 auto 2rem;
                }

                .typing-animation::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    background-color: var(--dark-bg);
                    border-left: 3px solid var(--accent);
                    animation: typing 3.5s steps(40, end) forwards, blink-caret 0.75s step-end infinite;
                }

                @keyframes typing {
                    from { width: 100% }
                    to { width: 0 }
                }

                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: var(--accent) }
                }

                .pulse-animation {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.7);
                    }
                    70% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 10px rgba(0, 255, 136, 0);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(0, 255, 136, 0);
                    }
                }

                .fade-in-up {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: fadeInUp 1s ease forwards;
                }

                .fade-in-left {
                    opacity: 0;
                    transform: translateX(-30px);
                    animation: fadeInLeft 1s ease forwards;
                }

                .fade-in-right {
                    opacity: 0;
                    transform: translateX(30px);
                    animation: fadeInRight 1s ease forwards;
                }

                .fade-in {
                    opacity: 0;
                    animation: fadeIn 1s ease forwards;
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInLeft {
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeInRight {
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fadeIn {
                    to {
                        opacity: 1;
                    }
                }

                .feature-icon {
                    font-size: 2.5rem;
                    color: var(--accent);
                    margin-bottom: 1.5rem;
                    transition: transform 0.3s ease;
                }

                .feature-card:hover .feature-icon {
                    transform: scale(1.05);
                    color: #00cc6a;
                }

                .counter {
                    display: inline-block;
                }

                @keyframes countUp {
                    from {
                        content: "0";
                    }
                    to {
                        content: attr(data-target);
                    }
                }
            `}</style>

            <script dangerouslySetInnerHTML={{
                __html: `
                    document.addEventListener('DOMContentLoaded', () => {
                        const counters = document.querySelectorAll('.counter');
                        const speed = 200;
                        
                        counters.forEach(counter => {
                            const target = +counter.getAttribute('data-target');
                            let count = 0;
                            
                            const updateCount = () => {
                                if (count < target) {
                                    count++;
                                    counter.innerText = count;
                                    setTimeout(updateCount, speed);
                                } else {
                                    counter.innerText = target;
                                }
                            };
                            
                            updateCount();
                        });
                    });
                `
            }} />
        </Layout>
    );
};

export default HomePage;