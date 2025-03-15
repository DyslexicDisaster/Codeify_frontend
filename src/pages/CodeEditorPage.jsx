import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getQuestionById } from '../services/questionService';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { dracula } from '@uiw/codemirror-theme-dracula';
import axios from 'axios';

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
    }, [questionId, navigate]);

    const handleCodeChange = (value) => {
        setCode(value);
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('');

        try {
            if (question?.programmingLanguage?.name) {
                const language = question.programmingLanguage.name.toLowerCase();

                const response = await axios.post('http://localhost:8080/api/execute', {
                    code: code,
                    language: language
                });

                setOutput(response.data.output || 'Code executed successfully with no output.');
            } else {
                setOutput('Error: Cannot determine the programming language.');
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
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        // Show a confirmation dialog to the user.
        const userConfirmed = window.confirm("Are you sure you want to submit your code?");
        if (!userConfirmed) return;

        console.log('Submitting code for question:', questionId);
        console.log('Code:', code);

        try {
            // Determine the programming language from the question data.
            const language = question?.programmingLanguage?.name?.toLowerCase();
            if (!language) {
                setOutput('Error: Programming language not specified.');
                return;
            }

            // Prepare the parameters with questionId and code (as answer)
            const params = {
                questionId: questionId,
                answer: code
            };

            // Send the POST request to the grade endpoint.
            const response = await axios.post(
                'http://localhost:8080/api/question/grade',
                null, // No request body needed; parameters are sent as query params.
                { params }
            );

            // After receiving the evaluation, navigate to the GradePage, passing the evaluation result.
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
                            <button className="btn btn-accent me-2" onClick={handleRunCode} disabled={isRunning}>
                                <i className="fas fa-play me-2"></i>{isRunning ? 'Running...' : 'Run Code'}
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
                        <div className="col-md-12 mb-4">
                            <div className="editor-wrapper">
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
                            <div className="question-card">
                                <h5 className="mb-3">Output</h5>
                                <div className="code-output" style={{
                                    backgroundColor: '#282a36',
                                    color: '#f8f8f2',
                                    padding: '15px',
                                    borderRadius: '10px',
                                    fontFamily: 'monospace',
                                    minHeight: '100px',
                                    maxHeight: '300px',
                                    overflowY: 'auto'
                                }}>
                                    {output ? (
                                        <pre style={{ margin: 0 }}>{output}</pre>
                                    ) : (
                                        <span className="text-muted">Click "Run Code" to see the output here</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
};

export default CodeEditorPage;