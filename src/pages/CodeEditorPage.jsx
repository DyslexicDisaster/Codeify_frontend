import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getQuestionById } from '../services/questionService';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { dracula } from '@uiw/codemirror-theme-dracula';

const CodeEditorPage = ({ loggedInUser }) => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState(null);
    const [code, setCode] = useState('');
    const [languageExtension, setLanguageExtension] = useState(javascript);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                setLoading(true);
                const questionData = await getQuestionById(questionId);
                setQuestion(questionData);

                if (questionData.starterCode) {
                    const formattedCode = questionData.starterCode
                        .split('\n')
                        .map(line => line.trimStart())
                        .join('\n');
                    setCode(formattedCode);
                }

                if (questionData.programmingLanguage) {
                    switch(questionData.programmingLanguage.name.toLowerCase()) {
                        case 'java':
                            setLanguageExtension(java);
                            break;
                        case 'python':
                            setLanguageExtension(python);
                            break;
                        case 'javascript':
                        default:
                            setLanguageExtension(javascript);
                            break;
                    }
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching question:', err);
                setError('Failed to load question. Please try again later.');
                setLoading(false);
            }
        };

        if (questionId) {
            fetchQuestion();
        } else {
            navigate('/questions');
        }
    }, [questionId, navigate]);

    const handleCodeChange = (value) => {
        setCode(value);
    };

    const handleRunCode = async () => {
        //TODO: Needs to be Implemented!
        console.log('Running code for question:', questionId);
        console.log('Code:', code);
    };

    const handleSubmitCode = async () => {
        //TODO: Needs to be Implemented!
        console.log('Submitting code for question:', questionId);
        console.log('Code:', code);
    };

    const getColorClass = (difficulty) => {
        if (!difficulty) return '';

        switch (difficulty) {
            case 'EASY':
                return 'difficulty-easy';
            case 'MEDIUM':
                return 'difficulty-medium';
            case 'HARD':
                return 'difficulty-hard';
            default:
                return '';
        }
    };

    if (loading) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-accent" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading question...</p>
                </div>
            </Layout>
        );
    }

    if (error) {
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

    if (!question) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5">
                    <div className="alert alert-warning" role="alert">
                        Question not found. <a href="/questions">Return to Questions</a>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout loggedInUser={loggedInUser}>
            <header className="question-header">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 className="h3 mb-0">
                                {question.title}
                                <span className={`difficulty-badge ${getColorClass(question.difficulty)}`}>
                  {question.difficulty}
                </span>
                            </h1>
                        </div>
                        <div>
                            <button className="btn btn-accent me-2" onClick={handleRunCode}>
                                <i className="fas fa-play me-2"></i>Run Code
                            </button>
                            <button className="btn btn-accent" onClick={handleSubmitCode}>
                                <i className="fas fa-paper-plane me-2"></i>Submit
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="editor-container">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-4">
                            <div className="question-card">
                                <h5 className="mb-3">Description</h5>
                                <p>{question.description}</p>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="editor-wrapper">
                                <CodeMirror
                                    value={code}
                                    height="500px"
                                    theme={dracula}
                                    extensions={[languageExtension]}
                                    onChange={handleCodeChange}
                                    style={{ borderRadius: '10px', overflow: 'hidden' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default CodeEditorPage;