import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container text-center">
                <div className="social-links">
                    /* Add your social media links here */
                </div>
                <p className="mb-0">&copy; {new Date().getFullYear()} Codeify. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;