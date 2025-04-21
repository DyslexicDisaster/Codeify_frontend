// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosClient from '../services/axiosClient';

const ProfilePage = ({ loggedInUser }) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axiosClient.get('/api/profile');
                setProfile(data);
            } catch (e) {
                setError(e.message || 'Failed to load profile');
            }
        };
        fetchProfile();
    }, []);

    if (error) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="alert alert-danger mt-5 text-center">{error}</div>
            </Layout>
        );
    }

    if (!profile) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="text-center mt-5">
                    <div className="spinner-border" role="status" />
                    <p>Loading profile…</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout loggedInUser={loggedInUser}>
            <div className="container mt-5">
                <h2>Your Profile</h2>
                <table className="table table-striped mt-3">
                    <tbody>
                    <tr>
                        <th>Username</th>
                        <td>{profile.username}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{profile.email}</td>
                    </tr>
                    <tr>
                        <th>Registered</th>
                        <td>{new Date(profile.registrationDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                        <th>Role</th>
                        <td>{profile.role}</td>
                    </tr>
                    <tr>
                        <th>Total Score</th>
                        <td>{profile.totalScore}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default ProfilePage;
