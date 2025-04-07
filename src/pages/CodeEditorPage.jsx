import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getQuestionById } from '../services/questionService';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { dracula } from '@uiw/codemirror-theme-dracula';
import axiosClient from '../services/axiosClient';  // Use our custom axios client

const CodeEditorPage = ({ loggedInUser }) => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [question, setQuestion] = useState(null);
    const [code, setCode] = useState('');
    const [languageExtension, setLanguageExtension] = useState(javascript);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [runSuccess, setRunSuccess] = useState(null);

    useEffect(() => {
        // Redirect if not logged in
        if (!loggedInUser) {
            navigate('/login', { state: { message: 'Please login to access the code editor.' } });
            return;
        }

        const fetchQuestion = async () => {
            try {
                setLoading(true);
                const questionData = await getQuestionById(questionId);
                setQuestion(questionData);

                // Set the code using any provided starter code
                if (questionData.starterCode) {
                    const formattedCode = questionData.starterCode
                        .split('\n')
                        .map(line => line.trimStart())
                        .join('\n');
                    setCode(formattedCode);
                }

                // Set the correct language extension for CodeMirror
                if (questionData.programmingLanguage) {
                    switch (questionData.programmingLanguage.name.toLowerCase()) {
                        case 'java':
                            setLanguageExtension(java);
                            break;
                        case 'mysql':
                            setLanguageExtension(sql);
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
    }, [questionId, navigate, loggedInUser]);

    // Updates code in state from the editor component
    const handleCodeChange = (value) => {
        setCode(value);
    };

    // Runs the code using the backend execute endpoint.
    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('');
        setRunSuccess(null);

        try {
            if (question?.programmingLanguage?.name) {
                const language = question.programmingLanguage.name.toLowerCase();

                // Send the request to the /api/execute endpoint using axiosClient
                const response = await axiosClient.post('/api/execute', {
                    code: code,
                    language: language
                });
                const outputText = response.data.output || 'Code executed successfully with no output.';
                setOutput(outputText);
                setRunSuccess(!outputText.toLowerCase().includes('error'));
            } else {
                setOutput('Error: Cannot determine the programming language.');
                setRunSuccess(false);
            }
        } catch (error) {
            console.error('Error running code:', error);
            let errorMessage = 'An error occurred while running the code.';
            if (error.response) {
                errorMessage = error.response.data || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setOutput(`Error: ${errorMessage}`);
            setRunSuccess(false);
        } finally {
            setIsRunning(false);
        }
    };

    // Submits the code for grading using the /api/question/grade endpoint.
    const handleSubmitCode = async () => {
        // Show a confirmation dialog to the user
        const userConfirmed = window.confirm("Are you sure you want to submit your code?");
        if (!userConfirmed) return;

        try {
            const language = question?.programmingLanguage?.name?.toLowerCase();
            if (!language) {
                setOutput('Error: Programming language not specified.');
                return;
            }

            // Prepare the payload as JSON; the backend expects { questionId, answer }
            const payload = {
                questionId: questionId,
                answer: code
            };

            // Send the grading request using axiosClient so the JWT cookie is automatically included.
            const response = await axiosClient.post('/api/question/grade', payload, {
                headers: { 'Content-Type': 'application/json' }
            });

            // Navigate to the GradePage, passing the evaluation results in state.
            navigate("/grade", { state: response.data });
        } catch (error) {
            console.error('Error submitting code:', error);
            let errorMessage = 'An error occurred while submitting the code.';
            if (error.response) {
                errorMessage = error.response.data || errorMessage;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setOutput(`Error: ${errorMessage}`);
        }
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
                <div className="container mt-5 text-center main-content">
                    <div className="loading-container">
                        <div className="spinner-border text-accent" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3 loading-text">Loading question...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
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

    if (!question) {
        return (
            <Layout loggedInUser={loggedInUser}>
                <div className="container mt-5 main-content">
                    <div className="alert alert-warning fade-in" role="alert">
                        <i className="fas fa-question-circle me-2"></i>
                        Question not found. <a href="/questions">Return to Questions</a>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout loggedInUser={loggedInUser}>
            <header className="question-header fade-in">
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
                        <div className="d-flex">
                            <button
                                className="btn btn-accent me-2 run-btn"
                                onClick={handleRunCode}
                                disabled={isRunning}
                            >
                                <i className="fas fa-play me-2"></i>
                                {isRunning ? 'Running...' : 'Run Code'}
                            </button>
                            <button className="btn btn-accent submit-btn" onClick={handleSubmitCode}>
                                <i className="fas fa-paper-plane me-2"></i>Submit
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="editor-container main-content">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 mb-4">
                            <div className="question-card slide-in-left">
                                <h5 className="mb-3"><i className="fas fa-info-circle me-2"></i>Description</h5>
                                <p>{question.description}</p>
                            </div>
                        </div>
                        <div className="col-md-12 mb-4">
                            <div className="editor-wrapper slide-in-right">
                                <CodeMirror
                                    value={code}
                                    height="400px"
                                    theme={dracula}
                                    extensions={[languageExtension]}
                                    onChange={handleCodeChange}
                                    style={{ borderRadius: '10px', overflow: 'hidden' }}
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="question-card slide-in-bottom">
                                <h5 className="mb-3">
                                    <i className="fas fa-terminal me-2"></i>Output
                                    {runSuccess !== null && (
                                        <span className={`output-status ms-2 ${runSuccess ? 'success' : 'error'}`}>
                                            <i className={`fas ${runSuccess ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                                            {runSuccess ? 'Success' : 'Error'}
                                        </span>
                                    )}
                                </h5>
                                <div className="code-output">
                                    {isRunning ? (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-accent" role="status">
                                                <span className="visually-hidden">Running...</span>
                                            </div>
                                            <p className="mt-2 mb-0">Executing your code...</p>
                                        </div>
                                    ) : output ? (
                                        <pre className="output-text">{output}</pre>
                                    ) : (
                                        <div className="empty-output">
                                            <i className="fas fa-code fa-2x mb-2"></i>
                                            <span>Click "Run Code" to see the output here</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .main-content {
                    min-height: calc(100vh - 250px);
                }
                .fade-in {
                    animation: fadeIn 0.5s ease-in-out forwards;
                }
                .slide-in-left {
                    animation: slideInLeft 0.5s ease-in-out forwards;
                }
                .slide-in-right {
                    animation: slideInRight 0.5s ease-in-out forwards;
                }
                .slide-in-bottom {
                    animation: slideInBottom 0.5s ease-in-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInBottom {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
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
                .question-header {
                    background: var(--dark-secondary);
                    border-bottom: 1px solid #333;
                    padding: 1.5rem 0;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .difficulty-badge {
                    display: inline-block;
                    padding: 0.35rem 1rem;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    margin-left: 1rem;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                .run-btn, .submit-btn {
                    position: relative;
                    overflow: hidden;
                    z-index: 1;
                }
                .run-btn:before, .submit-btn:before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 0;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.1);
                    z-index: -1;
                    transition: width 0.3s ease;
                }
                .run-btn:hover:not(:disabled):before, 
                .submit-btn:hover:before {
                    width: 100%;
                }
                .run-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
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
                .editor-wrapper {
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                    border: 1px solid #333;
                }
                .editor-wrapper:hover {
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 255, 136, 0.1);
                    border-color: var(--accent);
                }
                .code-output {
                    background-color: #282a36;
                    color: #f8f8f2;
                    padding: 15px;
                    border-radius: 10px;
                    font-family: monospace;
                    min-height: 150px;
                    max-height: 300px;
                    overflow-y: auto;
                    transition: all 0.3s ease;
                    border: 1px solid #333;
                }
                .code-output:hover {
                    border-color: #444;
                }
                .output-text {
                    margin: 0;
                    white-space: pre-wrap;
                }
                .empty-output {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100px;
                    color: #6c757d;
                }
                .output-status {
                    font-size: 0.85rem;
                    padding: 0.25rem 0.75rem;
                    border-radius: 50px;
                }
                .output-status.success {
                    background-color: rgba(40, 167, 69, 0.2);
                    color: #5cb85c;
                }
                .output-status.error {
                    background-color: rgba(220, 53, 69, 0.2);
                    color: #ff6b6b;
                }
            `}</style>
        </Layout>
    );
};

export default CodeEditorPage;
