import React from 'react';
import Menu from './Menu';
import Footer from './Footer';

const Layout = ({ children, loggedInUser }) => {
    return (
        <>
            <Menu loggedInUser={loggedInUser} />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;