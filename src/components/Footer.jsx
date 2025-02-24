import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container text-center">
                <div className="social-links">
                    <a href="#"><i className="fab fa-github"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-linkedin"></i></a>
                    <a href="#"><i className="fab fa-discord"></i></a>
                </div>
                <p className="mb-0">&copy; {new Date().getFullYear()} Codeify. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;