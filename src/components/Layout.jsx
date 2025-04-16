// src/components/Layout.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import Menu from './Menu';
import Footer from './Footer';

const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <>
            <Menu user={user} />
            <main>{children}</main>
            <Footer />
        </>
    );
};

export default Layout;