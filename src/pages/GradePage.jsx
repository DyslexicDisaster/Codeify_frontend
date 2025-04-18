import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

const GradePage = ({ loggedInUser }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { grade, feedback, message, status, passed, questionId, languageId } = location.state || {};

    useEffect(() => {
        if (!grade && !feedback) {
            navigate('/questions');
        }
    }, [grade, feedback, navigate]);

    const getFeedbackClass = (grade) => {
        if (grade >= 90) return 'text-success';
        if (grade >= 70) return 'text-primary';
        if (grade >= 50) return 'text-warning';
        return 'text-danger';
    };

    const getStatusBadgeClass = (status) => {
        if (status === 'COMPLETED') return 'status-completed';
        if (status === 'IN_PROGRESS') return 'status-in-progress';
        return 'status-not-started';
    };

    return (
        <Layout loggedInUser={loggedInUser}>
            <header className="question-header fade-in">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h3 mb-0">Your Submission Results</h1>
                        <div>
                            <button
                                className="btn btn-outline-accent"
                                onClick={() => navigate('/questions')}
                            >
                                <i className="fas fa-list me-2"></i>
                                Return to Questions
                            </button>
                        </div>
                    </div>
                </div>
            </header>


            <main className="main-content">
                <div className="container">
                    <div className="question-card slide-in-left">
                        <div className="row">
                            <div className="col-md-4">
                                <div className={`score-display ${passed ? 'score-passed' : 'score-failed'}`}>
                                    <h2 className={getFeedbackClass(grade)}>
                                        {grade}<span className="small">%</span>
                                    </h2>
                                    <div className="progress">
                                        <div
                                            className={`progress-bar ${getFeedbackClass(grade).replace('text', 'bg')}`}
                                            role="progressbar"
                                            style={{ width: `${grade}%` }}
                                            aria-valuenow={grade}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                    <div className="mt-3">
                                        <span className={`status-badge ${getStatusBadgeClass(status)}`}>
                                            <i className={`fas ${passed ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                                            {status === 'COMPLETED' ? 'Completed' :
                                                status === 'IN_PROGRESS' ? 'In Progress' : 'Not Passed'}
                                        </span>
                                    </div>
                                    <p className="mt-3 mb-0">
                                        {passed ?
                                            'Congratulations! You\'ve successfully completed this challenge.' :
                                            'You need to score at least 70% to complete this challenge.'}
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <div className="feedback-section">
                                    <h4 className="mb-3">
                                        <i className="fas fa-comment-alt me-2"></i>
                                        Feedback
                                    </h4>
                                    <div className="feedback-content">
                                        {feedback ? feedback : 'No specific feedback provided.'}
                                    </div>

                                    {message && (
                                        <div className="system-message mt-4">
                                            <p><i className="fas fa-info-circle me-2"></i>{message}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="action-buttons mt-4">
                            <button
                                className="btn btn-outline-accent me-3"
                                onClick={() => {
                                    if (languageId) {
                                        navigate(`/questions?languageId=${languageId}`);
                                    } else {
                                        navigate('/questions');
                                    }
                                }}
                            >
                                <i className="fas fa-list me-2"></i>
                                Back to Questions List
                            </button>

                            {!passed && (
                                <button
                                    className="btn btn-accent"
                                    onClick={() => navigate(`/questions/${location.state?.questionId || ''}/attempt`)}
                                >
                                    <i className="fas fa-redo me-2"></i>
                                    Try Again
                                </button>
                            )}

                            {passed && (
                                <button
                                    className="btn btn-accent"
                                    onClick={() => {
                                        const langId = location.state?.languageId || '';
                                        navigate(`/questions?languageId=${langId}`);
                                    }}
                                >
                                    <i className="fas fa-arrow-right me-2"></i>
                                    Next Challenge
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
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

                .fade-in {
                    animation: fadeIn 0.5s ease forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

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

                .btn-accent {
                    background-color: var(--accent);
                    color: var(--dark-bg);
                    border: none;
                    transition: all 0.3s ease;
                }

                .btn-accent:hover {
                    background-color: #00cc6a;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 255, 136, 0.3);
                }

                .btn-outline-accent {
                    color: var(--accent);
                    border-color: var(--accent);
                    background-color: transparent;
                    transition: all 0.3s ease;
                }

                .btn-outline-accent:hover {
                    color: var(--dark-bg);
                    background-color: var(--accent);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0, 255, 136, 0.2);
                }

                .score-display {
                    text-align: center;
                    border-radius: 12px;
                    padding: 1.5rem;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    border: 1px solid #444;
                    transition: all 0.3s ease;
                }

                .score-display:hover {
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                }

                .score-passed {
                    background-color: rgba(40, 167, 69, 0.1);
                    border-color: rgba(40, 167, 69, 0.3);
                }

                .score-failed {
                    background-color: rgba(220, 53, 69, 0.1);
                    border-color: rgba(220, 53, 69, 0.3);
                }

                .score-display h2 {
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 0.5rem;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .score-display .small {
                    font-size: 1.5rem;
                    opacity: 0.8;
                }

                .progress {
                    height: 8px;
                    width: 100%;
                    background-color: var(--dark-bg);
                    border-radius: 50px;
                    overflow: hidden;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
                }

                .text-success {
                    color: #28a745 !important;
                }

                .text-primary {
                    color: #007bff !important;
                }

                .text-warning {
                    color: #ffc107 !important;
                }

                .text-danger {
                    color: #dc3545 !important;
                }

                .bg-success {
                    background-color: #28a745 !important;
                }

                .bg-primary {
                    background-color: #007bff !important;
                }

                .bg-warning {
                    background-color: #ffc107 !important;
                }

                .bg-danger {
                    background-color: #dc3545 !important;
                }

                .status-badge {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .status-completed {
                    background: linear-gradient(45deg, var(--accent), #00cc6a);
                    color: var(--dark-bg);
                }

                .status-in-progress {
                    background: linear-gradient(45deg, #f9a825, #ffb74d);
                    color: #333;
                }

                .status-not-started {
                    background-color: #dc3545;
                    color: white;
                }

                .feedback-section {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .feedback-content {
                    background-color: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    padding: 1.5rem;
                    min-height: 150px;
                    max-height: 250px;
                    overflow-y: auto;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    border: 1px solid #444;
                    white-space: pre-wrap;
                }

                .system-message {
                    font-style: italic;
                    opacity: 0.8;
                }

                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                }

                @media (max-width: 767.98px) {
                    .score-display {
                        margin-bottom: 1.5rem;
                    }

                    .action-buttons {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .action-buttons .btn {
                        width: 100%;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default GradePage;