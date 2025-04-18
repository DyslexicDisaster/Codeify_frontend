import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = useState({
        hero: false,
        features: false,
        slideshow: false,
        stats: false
    });
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = 3;

    useEffect(() => {
        setIsVisible(v => ({ ...v, hero: true, features: true }));
        const slideInterval = setInterval(() => {
            setCurrentSlide(i => (i + 1) % totalSlides);
        }, 5000);

        const handleScroll = () => {
            const scrollPos = window.scrollY + window.innerHeight;
            const featuresEl  = document.querySelector('.features-section');
            const slideshowEl = document.querySelector('.slideshow-section');
            const statsEl     = document.querySelector('.stats-section');

            if (featuresEl && scrollPos > featuresEl.offsetTop + 100)
                setIsVisible(v => ({ ...v, features: true }));
            if (slideshowEl && scrollPos > slideshowEl.offsetTop + 100)
                setIsVisible(v => ({ ...v, slideshow: true }));
            if (statsEl && scrollPos > statsEl.offsetTop + 100)
                setIsVisible(v => ({ ...v, stats: true }));
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            clearInterval(slideInterval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <Layout>
            <section className="hero-section">
                <div className="code-background" />
                <div className={`container text-center ${isVisible.hero ? 'fade-in-up' : ''}`}>
                    <h1 className="display-4 fw-bold mb-4 hero-text glowing-text">
                        Master Coding Through Practice
                    </h1>
                    <p className="lead mb-5 typing-animation">
                        Improve your programming skills with hands-on exercises in Java, MySQL, and JavaScript
                    </p>
                    <button
                        onClick={() => {
                            if (user) {
                                navigate('/questions');
                            } else {
                                navigate('/login', {
                                    state: { message: 'Please login or register first to access coding challenges.' }
                                });
                            }
                        }}
                        className="btn btn-accent btn-lg pulse-animation"
                    >
                        <i className="fas fa-code me-2" />Start Learning
                    </button>
                </div>
            </section>

            <style>{`
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

                /* New Slideshow Styles */
                .slideshow-section {
                    background-color: var(--dark-secondary);
                    position: relative;
                    overflow: hidden;
                    padding: 4rem 0;
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 1s ease, transform 1s ease;
                    margin: 2rem 0;
                    border-top: 1px solid rgba(0, 255, 136, 0.2);
                    border-bottom: 1px solid rgba(0, 255, 136, 0.2);
                }

                .slideshow-section.active {
                    opacity: 1;
                    transform: translateY(0);
                }

                .slideshow-section::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23026d38' stroke-width='1'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3C/g%3E%3C/svg%3E") center/cover;
                    opacity: 0.1;
                    z-index: 0;
                }

                .slideshow-section h2 {
                    color: var(--accent);
                    position: relative;
                    z-index: 1;
                    font-weight: bold;
                    font-size: 2.2rem;
                    margin-bottom: 2rem;
                    text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                }

                .slideshow-container {
                    position: relative;
                    max-width: 1000px;
                    margin: 0 auto;
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
                    z-index: 2;
                }

                .slideshow {
                    position: relative;
                    height: 450px;
                }

                .slide {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    transform: scale(1.05);
                    transition: opacity 0.8s ease, transform 0.8s ease;
                }

                .slide.active {
                    opacity: 1;
                    transform: scale(1);
                }

                .slide-image-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(0, 0, 0, 0.8);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .slide-image {
                    max-width: 95%;
                    max-height: 95%;
                    object-fit: contain;
                    border-radius: 8px;
                    border: 2px solid rgba(0, 255, 136, 0.3);
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
                }

                .slide-caption {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 2rem;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
                    color: white;
                    transform: translateY(30px);
                    opacity: 0;
                    transition: transform 0.6s ease 0.2s, opacity 0.6s ease 0.2s;
                }

                .slide.active .slide-caption {
                    transform: translateY(0);
                    opacity: 1;
                }

                .slide-caption h3 {
                    color: var(--accent);
                    margin-bottom: 0.5rem;
                    font-size: 1.5rem;
                }

                .slideshow-controls {
                    position: absolute;
                    bottom: 20px;
                    left: 0;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10;
                }

                .control-btn {
                    background-color: rgba(0, 0, 0, 0.5);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .control-btn:hover {
                    background-color: var(--accent);
                    color: var(--dark-bg);
                    transform: scale(1.1);
                }

                .slideshow-indicators {
                    display: flex;
                    gap: 10px;
                }

                .indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.5);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .indicator.active {
                    background-color: var(--accent);
                    transform: scale(1.2);
                }

                /* Add animations for slide transitions */
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }

                @keyframes slideOutLeft {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-100%);
                        opacity: 0;
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