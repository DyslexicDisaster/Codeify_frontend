import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axiosClient from '../services/axiosClient';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ loggedInUser }) => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await axiosClient.get('/api/profile');
                setProfile(data);
            } catch (e) {
                setError(e.response?.data?.message || 'Failed to load profile');
            }
        };
        fetchProfile();
    }, []);

    const handleEditProfile = () => {
        navigate('/profile/edit');
    };

    if (error) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5">
                    <div className="alert alert-danger fade-in">{error}</div>
                </div>
            </Layout>
        );
    }

    if (!profile) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5 text-center fade-in">
                    <div className="spinner-border text-accent" role="status" />
                    <p className="mt-3">Loading profile…</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout loggedInUser={loggedInUser}>
            <div className="container mt-5 main-content">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow fade-in">
                            <div className="card-header bg-transparent">
                                <h3 className="mb-0">Your Profile</h3>
                                <button
                                    className="btn btn-accent btn-sm mt-2"
                                    onClick={handleEditProfile}
                                >
                                    <i className="fas fa-edit me-2"></i>
                                    Edit Profile
                                </button>
                            </div>

                            <div className="card-body">
                                <div className="profile-info">
                                    <div className="info-item">
                                        <span className="info-label">Username:</span>
                                        <span className="info-value">{profile.username}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email:</span>
                                        <span className="info-value">{profile.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Registered:</span>
                                        <span className="info-value">
                                            {new Date(profile.registrationDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Role:</span>
                                        <span className="info-value badge bg-accent">
                                            {profile.role}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Total Score:</span>
                                        <span className="info-value text-accent">
                                            {profile.totalScore}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .main-content {
                    min-height: calc(100vh - 300px);
                }

                .card {
                    border-radius: 15px;
                    border: 1px solid #333;
                    background: var(--dark-secondary);
                }

                .card-header {
                    border-bottom: 1px solid #444;
                    padding: 1.5rem;
                }

                .profile-info {
                    padding: 1.5rem;
                }

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem 0;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .info-item:last-child {
                    border-bottom: none;
                }

                .info-label {
                    color: #aaa;
                    font-weight: 500;
                }

                .info-value {
                    color: var(--light);
                    max-width: 60%;
                    text-align: right;
                }

                .badge.bg-accent {
                    background: var(--accent);
                    color: var(--dark-bg);
                    padding: 0.5em 1em;
                    border-radius: 20px;
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .info-item {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .info-value {
                        text-align: left;
                        max-width: 100%;
                        margin-top: 0.5rem;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default ProfilePage;