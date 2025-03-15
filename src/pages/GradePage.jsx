import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const GradePage = ({ loggedInUser }) => {
    // Retrieve evaluation results passed via navigation state from the CodeEditorPage.
    const location = useLocation();
    const navigate = useNavigate();
    const { grade, feedback, message } = location.state || {};

    return (
        <Layout loggedInUser={loggedInUser}>
            {/* Header section styled similar to CodeEditorPage */}
            <header className="question-header fade-in">
                <div className="container">
                    <h1 className="h3 mb-0">Grade Received</h1>
                </div>
            </header>

            {/* Main content container */}
            <main className="main-content">
                <div className="container">
                    {/* The evaluation is displayed inside a question-card styled container */}
                    <div className="question-card slide-in-left">
                        <h5 className="mb-3">Your Evaluation</h5>
                        <p><strong>Grade:</strong> {grade}</p>
                        <p><strong>Feedback:</strong> {feedback}</p>
                        <p>{message}</p>
                        {/* Button to let the user try another question */}
                        <button className="btn btn-accent" onClick={() => navigate('/questions')}>
                            Try Another Question
                        </button>
                    </div>
                </div>
            </main>

            <style jsx>{`
        .main-content {
          min-height: calc(100vh - 150px);
          padding: 2rem 0;
        }
        .question-header {
          background: var(--dark-secondary);
          border-bottom: 1px solid #333;
          padding: 1.5rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        /* Fade-in animation for the header */
        .fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        /* Slide-in-left animation for the evaluation card */
        .slide-in-left {
          animation: slideInLeft 0.5s ease forwards;
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        /* Styling for the question card to match CodeEditorPage */
        .question-card {
          background: var(--dark-secondary);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--card-shadow);
          border: 1px solid #333;
          transition: all 0.3s ease;
        }
        .question-card:hover {
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
          border-color: #444;
        }
        /* Accent button styling */
        .btn-accent {
          background-color: var(--accent);
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .btn-accent:hover {
          background-color: #00cc6a;
        }
      `}</style>
        </Layout>
    );
};

export default GradePage;
