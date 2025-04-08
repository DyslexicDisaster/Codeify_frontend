import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { getProgrammingLanguages, getQuestionsByLanguage, getUserProgress } from '../services/questionService';
/**References:
 * https://www.youtube.com/watch?v=znbCa4Rr054 **/

const QuestionsPage = ({ loggedInUser }) => {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [progressData, setProgressData] = useState({
        progressPercentage: 0,
        completedQuestions: 0,
        totalQuestions: 0,
        progressDetails: []
    });

    const navigate = useNavigate();
    const location = useLocation();

    // Parse query parameters from URL
    const getQueryParams = () => {
        const searchParams = new URLSearchParams(location.search);
        const languageId = searchParams.get('languageId');
        return { languageId: languageId ? parseInt(languageId) : null };
    };

    useEffect(() => {
        // Redirect if not logged in
        if (!loggedInUser) {
            navigate('/login', {
                state: { message: 'Please login to access the coding challenges.' }
            });
            return;
        }

        const fetchLanguages = async () => {
            try {
                setLoading(true);
                const data = await getProgrammingLanguages();
                setLanguages(data);

                const { languageId } = getQueryParams();

                if (languageId && data.some(lang => lang.id === languageId)) {
                    setSelectedLanguage(data.find(lang => lang.id === languageId));
                } else if (data.length > 0) {
                    setSelectedLanguage(data[0]);
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching languages:', err);
                setError('Failed to load programming languages. Please try again later.');
                setLoading(false);
            }
        };

        fetchLanguages();
    }, [loggedInUser, navigate, location.search]);

    useEffect(() => {
        const fetchQuestionsAndProgress = async () => {
            if (!selectedLanguage) return;

            try {
                setLoading(true);
                setError(null);

                const questionsData = await getQuestionsByLanguage(selectedLanguage.id);

                try {
                    const progressData = await getUserProgress(selectedLanguage.id);
                    setProgressData(progressData);

                    const progressMap = {};
                    if (progressData && progressData.progressDetails) {
                        progressData.progressDetails.forEach(progress => {
                            if (progress && progress.question && progress.question.id) {
                                progressMap[progress.question.id] = {
                                    status: progress.status,
                                    score: progress.score
                                };
                            }
                        });
                    }

                    const enhancedQuestions = questionsData.map(question => ({
                        ...question,
                        progress: progressMap[question.id] || { status: 'NOT_STARTED', score: 0 }
                    }));

                    setQuestions(enhancedQuestions);
                } catch (progressErr) {
                    console.error('Error fetching progress data:', progressErr);
                    setQuestions(questionsData.map(question => ({
                        ...question,
                        progress: { status: 'NOT_STARTED', score: 0 }
                    })));
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Failed to load questions. Please try again later.');
                setLoading(false);
            }
        };

        fetchQuestionsAndProgress();
    }, [selectedLanguage]);

    const handleLanguageChange = (e) => {
        const langId = parseInt(e.target.value);
        const lang = languages.find(l => l.id === langId);
        setSelectedLanguage(lang);
        setActiveIndex(null);

        navigate(`/questions?languageId=${langId}`);
    };

    const getDifficultyClass = (difficulty) => {
        switch(difficulty) {
            case 'EASY':
                return 'bg-success';
            case 'MEDIUM':
                return 'bg-warning text-dark';
            case 'HARD':
                return 'bg-danger';
            default:
                return '';
        }
    };

    const getDifficultyIcon = (difficulty) => {
        switch(difficulty) {
            case 'EASY':
                return 'fas fa-smile';
            case 'MEDIUM':
                return 'fas fa-meh';
            case 'HARD':
                return 'fas fa-frown';
            default:
                return 'fas fa-question';
        }
    };

    const getStatusClass = (status) => {
        switch(status) {
            case 'COMPLETED':
                return 'status-completed';
            case 'IN_PROGRESS':
                return 'status-in-progress';
            case 'NOT_STARTED':
            default:
                return 'status-not-started';
        }
    };

    const getStatusLabel = (status) => {
        switch(status) {
            case 'COMPLETED':
                return 'Completed';
            case 'IN_PROGRESS':
                return 'In Progress';
            case 'NOT_STARTED':
            default:
                return 'Not Started';
        }
    };

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (loading && !selectedLanguage) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5 text-center main-content">
                    <div className="loading-container">
                        <div className="spinner-border text-accent" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 loading-text">Loading programming languages...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error && !selectedLanguage) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5 main-content">
                    <div className="alert alert-danger fade-in" role="alert">
                        <i className="fas fa-exclamation-circle me-2"></i>
                        {error}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout loggedInUser={loggedInUser}>
            <section className="practice-section fade-in">
                <div className="container">
                    <h1 className="display-5 fw-bold mb-4 glowing-text">Practice Coding</h1>
                    <p className="lead mb-5">Choose your preferred programming language and start solving challenges</p>

                    {languages.length > 0 && (
                        <div className="language-selector slide-in-left">
                            <div className="d-flex align-items-center justify-content-between">
                                <label htmlFor="languageSelect" className="fs-5 mb-0">
                                    <i className="fas fa-code me-2"></i>Programming Language
                                </label>
                                <div className="select-wrapper">
                                    <select
                                        id="languageSelect"
                                        className="custom-select"
                                        value={selectedLanguage?.id || ''}
                                        onChange={handleLanguageChange}
                                    >
                                        {languages.map(lang => (
                                            <option key={lang.id} value={lang.id}>
                                                {lang.name}
                                            </option>
                                        ))}
                                    </select>
                                    <i className="fas fa-chevron-down select-arrow"></i>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedLanguage && (
                        <div className="language-selector slide-in-right">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">
                                    <i className="fas fa-chart-line me-2"></i>
                                    Overall Progress
                                </h5>
                                <span className="badge status-completed">{progressData.progressPercentage || 0}%</span>
                            </div>
                            <div className="progress-container">
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: `${progressData.progressPercentage || 0}%` }}
                                        aria-valuenow={progressData.progressPercentage || 0}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    ></div>
                                </div>
                            </div>
                            <div className="mt-2 text-muted">
                                <small>
                                    <i className="fas fa-check-circle me-1"></i>
                                    {progressData.completedQuestions || 0} of {progressData.totalQuestions || 0} completed
                                </small>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-5">
                <div className="container main-content">
                    {loading && selectedLanguage ? (
                        <div className="text-center">
                            <div className="spinner-border text-accent" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 loading-text">Loading questions...</p>
                        </div>
                    ) : error && selectedLanguage ? (
                        <div className="alert alert-danger fade-in" role="alert">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {error}
                            <div className="mt-3">
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => window.location.reload()}
                                >
                                    <i className="fas fa-sync-alt me-2"></i>Retry
                                </button>
                            </div>
                        </div>
                    ) : questions.length > 0 ? (
                        <div className="custom-accordion fade-in">
                            {questions.map((question, index) => (
                                <div
                                    key={question.id}
                                    className={`accordion-item ${activeIndex === index ? 'active' : ''} ${question.progress?.status === 'COMPLETED' ? 'completed-question' : ''}`}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div
                                        className="accordion-header"
                                        onClick={() => toggleAccordion(index)}
                                    >
                                        <div className="question-title d-flex w-100 align-items-center">
                                            <span className="fs-5">
                                                {question.progress?.status === 'COMPLETED' &&
                                                    <i className="fas fa-check-circle text-success me-2"></i>
                                                }
                                                {question.title}
                                            </span>
                                            <div className="ms-auto d-flex gap-2">
                                                <span className={`badge ${getDifficultyClass(question.difficulty)}`}>
                                                    <i className={`${getDifficultyIcon(question.difficulty)} me-1`}></i>
                                                    {question.difficulty}
                                                </span>
                                                <span className="badge bg-info">
                                                    <i className="fas fa-star me-1"></i>
                                                    {question.difficulty === 'EASY' ? '100' :
                                                        question.difficulty === 'MEDIUM' ? '200' : '300'} pts
                                                </span>
                                                <span className={`badge ${getStatusClass(question.progress?.status || 'NOT_STARTED')}`}>
                                                    {getStatusLabel(question.progress?.status || 'NOT_STARTED')}
                                                    {question.progress?.status === 'COMPLETED' && question.progress?.score !== undefined &&
                                                        <span className="ms-1">({question.progress.score}%)</span>
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                        <i className={`accordion-icon fas fa-chevron-${activeIndex === index ? 'up' : 'down'}`}></i>
                                    </div>
                                    <div className={`accordion-content ${activeIndex === index ? 'show' : ''}`}>
                                        <div className="accordion-body">
                                            <p className="mb-4">{question.description}</p>
                                            <div className="d-flex justify-content-end">
                                                <Link
                                                    to={`/questions/${question.id}/attempt`}
                                                    className="attempt-btn btn"
                                                >
                                                    <i className="fas fa-code me-2"></i>
                                                    {question.progress?.status === 'COMPLETED' ? 'Revisit Challenge' :
                                                        question.progress?.status === 'IN_PROGRESS' ? 'Continue Challenge' :
                                                            'Start Challenge'}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        languages.length > 0 && selectedLanguage && (
                            <div className="language-selector text-center fade-in">
                                <div className="empty-state">
                                    <i className="fas fa-code-branch fa-3x mb-3 text-muted"></i>
                                    <h4 className="mb-3">No Questions Available</h4>
                                    <p className="mb-0">
                                        There are currently no questions available for the selected programming language.
                                        Please try selecting a different language or check back later.
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
            </section>

            <style jsx>{`
                .main-content {
                    min-height: calc(100vh - 450px);
                }

                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 50vh;
                }

                .loading-text {
                    font-size: 1.2rem;
                    color: var(--accent);
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-in-out forwards;
                }

                .slide-in-left {
                    animation: slideInLeft 0.6s ease-in-out forwards;
                }

                .slide-in-right {
                    animation: slideInRight 0.6s ease-in-out forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
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

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .practice-section {
                    padding: 5rem 0 2rem;
                    background: linear-gradient(45deg, var(--dark-secondary), var(--dark-bg));
                    border-bottom: 1px solid #333;
                    position: relative;
                    overflow: hidden;
                }

                .practice-section:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: radial-gradient(circle at center, rgba(0, 255, 136, 0.1) 0%, transparent 70%);
                    pointer-events: none;
                }

                .glowing-text {
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                }

                .language-selector {
                    background: var(--dark-secondary);
                    border-radius: 15px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    box-shadow: var(--card-shadow);
                    border: 1px solid #333;
                    transition: all 0.3s ease;
                }

                .language-selector:hover {
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
                    border-color: #444;
                }

                .select-wrapper {
                    position: relative;
                    display: inline-block;
                }

                .select-arrow {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--accent);
                    pointer-events: none;
                }

                .custom-select {
                    background-color: var(--dark-bg);
                    color: var(--text-light);
                    border: 1px solid #444;
                    border-radius: 8px;
                    padding: 0.5rem 2.5rem 0.5rem 1rem;
                    min-width: 200px;
                    appearance: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .custom-select:hover {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 1px rgba(0, 255, 136, 0.2);
                }

                .custom-select:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 2px rgba(0, 255, 136, 0.2);
                }

                .progress-container {
                    position: relative;
                }

                .progress {
                    height: 10px;
                    background-color: var(--dark-bg);
                    border-radius: 50px;
                    overflow: hidden;
                    margin-top: 0.5rem;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
                }

                .progress-bar {
                    background: linear-gradient(90deg, var(--accent), #00cc6a);
                    border-radius: 50px;
                    position: relative;
                    overflow: hidden;
                    animation: progressFill 1.5s ease-in-out;
                }

                @keyframes progressFill {
                    from { width: 0; }
                }

                .progress-bar:after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.2) 50%,
                            rgba(255, 255, 255, 0) 100%
                    );
                    animation: progressGlow 2s infinite;
                }

                @keyframes progressGlow {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                .custom-accordion {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .accordion-item {
                    background-color: var(--dark-secondary);
                    border: 1px solid #333;
                    border-radius: 10px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    animation: fadeIn 0.5s ease-in-out forwards;
                    opacity: 0;
                }

                .accordion-item:hover {
                    border-color: #444;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }

                .accordion-item.active {
                    border-color: var(--accent);
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 255, 136, 0.3);
                }

                .accordion-item.completed-question {
                    border-left: 4px solid var(--accent);
                }

                .accordion-header {
                    padding: 1rem 1.5rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background-color: var(--dark-secondary);
                    transition: all 0.3s ease;
                    position: relative;
                }

                .accordion-header:hover {
                    background-color: #3a3a3a;
                }

                .accordion-icon {
                    color: var(--accent);
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .accordion-item.active .accordion-icon {
                    transform: rotate(180deg);
                }

                .accordion-content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.4s ease-in-out;
                }

                .accordion-content.show {
                    max-height: 500px;
                }

                .accordion-body {
                    padding: 1.5rem;
                    border-top: 1px solid #444;
                    background-color: #2a2a2a;
                }

                .badge {
                    display: inline-flex;
                    align-items: center;
                    font-weight: 600;
                    padding: 0.35rem 0.75rem;
                    border-radius: 50px;
                    font-size: 0.75rem;
                    transition: all 0.3s ease;
                }

                .badge:hover {
                    transform: translateY(-1px);
                }

                .status-completed {
                    background: linear-gradient(45deg, var(--accent), #00cc6a);
                    color: var(--dark-bg);
                    box-shadow: 0 2px 4px rgba(0, 255, 136, 0.3);
                }

                .status-in-progress {
                    background: linear-gradient(45deg, #f9a825, #ffb74d);
                    color: #333;
                    box-shadow: 0 2px 4px rgba(249, 168, 37, 0.3);
                }

                .status-not-started {
                    background-color: #6c757d;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }

                .attempt-btn {
                    background-color: var(--accent);
                    color: var(--dark-bg);
                    border-radius: 50px;
                    padding: 0.5rem 1.5rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    border: none;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                .attempt-btn:hover {
                    background-color: #00cc6a;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15), 0 0 0 5px rgba(0, 255, 136, 0.1);
                }

                .empty-state {
                    padding: 3rem 1rem;
                    border-radius: 10px;
                    color: var(--text-light);
                }

                .empty-state i {
                    color: var(--accent);
                    opacity: 0.6;
                }
            `}</style>
        </Layout>
    );
};

export default QuestionsPage;