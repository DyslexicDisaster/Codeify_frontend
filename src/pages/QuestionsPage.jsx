import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { getProgrammingLanguages, getQuestionsByLanguage } from '../services/questionService';

const QuestionsPage = ({ loggedInUser }) => {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch languages when component mounts
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                setLoading(true);
                const data = await getProgrammingLanguages();
                console.log('Languages response:', data); // Debug
                setLanguages(data);

                // Set the first language as selected if available
                if (data.length > 0) {
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
    }, []);


    useEffect(() => {
        const fetchQuestions = async () => {
            if (!selectedLanguage) return;

            try {
                setLoading(true);
                const data = await getQuestionsByLanguage(selectedLanguage.id);
                console.log('Questions response:', data);
                setQuestions(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching questions:', err);
                setError('Failed to load questions. Please try again later.');
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [selectedLanguage]);

    const handleLanguageChange = (e) => {
        const langId = parseInt(e.target.value);
        const lang = languages.find(l => l.id === langId);
        setSelectedLanguage(lang);
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

    if (loading && !selectedLanguage) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-accent" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading programming languages...</p>
                </div>
            </Layout>
        );
    }

    if (error && !selectedLanguage) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5">
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout loggedInUser={loggedInUser}>
            <section className="practice-section">
                <div className="container">
                    <h1 className="display-5 fw-bold mb-4">Practice Coding</h1>
                    <p className="lead mb-5">Choose your preferred programming language and start solving challenges</p>

                    {languages.length > 0 && (
                        <div className="language-selector">
                            <div className="d-flex align-items-center justify-content-between">
                                <label htmlFor="languageSelect" className="fs-5 mb-0">
                                    <i className="fas fa-code me-2"></i>Programming Language
                                </label>
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
                            </div>
                        </div>
                    )}

                    {selectedLanguage && (
                        <div className="language-selector">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="mb-0">Overall Progress</h5>
                                <span className="badge status-completed">65%</span>
                            </div>
                            <div className="progress">
                                <div className="progress-bar" role="progressbar" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="py-5">
                <div className="container">
                    {loading && selectedLanguage ? (
                        <div className="text-center">
                            <div className="spinner-border text-accent" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3">Loading questions...</p>
                        </div>
                    ) : error && selectedLanguage ? (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    ) : questions.length > 0 ? (
                        <div className="accordion" id="questionsAccordion">
                            {questions.map((question, index) => (
                                <div className="accordion-item" key={question.id}>
                                    <h2 className="accordion-header">
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${index}`}
                                        >
                                            <div className="question-title d-flex w-100 align-items-center">
                                                <span className="fs-5">{question.title}</span>
                                                <div className="ms-auto d-flex gap-2">
                          <span className={`badge ${getDifficultyClass(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                                                    <span className="badge bg-info">
                            <i className="fas fa-star me-1"></i>
                                                        {question.difficulty === 'EASY' ? '100' :
                                                            question.difficulty === 'MEDIUM' ? '200' : '300'} pts
                          </span>
                                                    <span className="badge status-not-started">Not Started</span>
                                                </div>
                                            </div>
                                        </button>
                                    </h2>
                                    <div id={`collapse${index}`} className="accordion-collapse collapse">
                                        <div className="accordion-body">
                                            <p className="mb-4">{question.description}</p>
                                            <div className="d-flex justify-content-end">
                                                <Link
                                                    to={`/questions/${question.id}/attempt`}
                                                    className="attempt-btn btn"
                                                >
                                                    <i className="fas fa-code me-2"></i>Start Challenge
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        languages.length > 0 && selectedLanguage && (
                            <div className="language-selector text-center">
                                <h4 className="mb-3">No Questions Available</h4>
                                <p className="mb-0">
                                    There are currently no questions available for the selected programming language.
                                    Please try selecting a different language or check back later.
                                </p>
                            </div>
                        )
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default QuestionsPage;