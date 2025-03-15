import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const GradePage = ({ loggedInUser }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // The evaluation result is passed as state from the previous page.
    const { grade, feedback, message } = location.state || {};

    return (
        <Layout loggedInUser={loggedInUser}>
            <div className="container mt-5 text-center">
                <h1>Grade Received</h1>
                <p><strong>Grade:</strong> {grade}</p>
                <p><strong>Feedback:</strong> {feedback}</p>
                <p>{message}</p>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/questions')}>
                    Try Another Question
                </button>
            </div>
        </Layout>
    );
};

export default GradePage;
