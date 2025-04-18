import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getQuestionById, submitAnswer, getLastAttempt } from '../services/questionService';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { dracula } from '@uiw/codemirror-theme-dracula';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CodeEditorPage = () => {
    const { user } = useAuth();
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingLastAttempt, setLoadingLastAttempt] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login', {
                state: { message: 'Please login to access the code editor.' }
            });
            return;
        }

        async function fetchQuestion() {
            try {
                setLoading(true);
                const q = await getQuestionById(questionId);
                setQuestion(q);

                let initial = q.starterCode ?? '';
                setLoadingLastAttempt(true);
                try {
                    const last = await getLastAttempt(questionId);
                    if (last) initial = last;
                } catch {
                } finally {
                    setLoadingLastAttempt(false);
                }
                setCode(initial);

                const lang = q.programmingLanguage?.name.toLowerCase();
                if (lang === 'java') setLanguageExtension(java);
                else if (lang === 'mysql') setLanguageExtension(sql);
                else setLanguageExtension(javascript);

            } catch (e) {
                console.error(e);
                setError('Failed to load question. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        if (questionId) fetchQuestion();
        else navigate('/questions');

    }, [questionId, navigate, user]);

    const handleCodeChange = value => setCode(value);

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput('');
        setRunSuccess(null);
        try {
            const lang = question.programmingLanguage.name.toLowerCase();
            const resp = await axios.post('http://localhost:8080/api/execute', { code, language: lang });
            const text = resp.data.output || 'Executed with no output.';
            setOutput(text);
            setRunSuccess(!/error/i.test(text));
        } catch (e) {
            console.error(e);
            setOutput('Error running code: ' + (e.response?.data || e.message));
            setRunSuccess(false);
        } finally {
            setIsRunning(false);
        }
    };

    const handleSubmitCode = async () => {
        if (!window.confirm('Are you sure you want to submit?')) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await submitAnswer(questionId, code);
            if (!result) throw new Error('Empty response');
            navigate('/grade', {
                state: {
                    grade: result.grade,
                    feedback: result.feedback,
                    message: result.message,
                    status: result.status,
                    passed: result.grade >= 70,
                }
            });
        } catch (e) {
            console.error(e);
            setError(e.response?.data || e.message || 'Submission failed');
            setRunSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const badgeClass = diff => {
        if (diff === 'EASY') return 'difficulty-easy';
        if (diff === 'MEDIUM') return 'difficulty-medium';
        if (diff === 'HARD') return 'difficulty-hard';
        return '';
    };

    if (loading) {
        return (
            <Layout loggedInUser={user}>
                <div className="container mt-5 text-center">
                    <div className="spinner-border text-accent" role="status" />
                    <p className="mt-3">Loading question…</p>
                </div>
            </Layout>
        );
    }

    if (error && !question) {
        return (
            <Layout loggedInUser={user}>
                <div className="container mt-5">
                    <div className="alert alert-danger">{error}</div>
                </div>
            </Layout>
        );
    }

    if (!question) {
        return (
            <Layout loggedInUser={user}>
                <div className="container mt-5">
                    <div className="alert alert-warning">
                        Question not found. <a href="/questions">Back to list</a>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout loggedInUser={user}>
            <header className="question-header">
                <div className="container d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="h3">
                            {question.title}{' '}
                            <span className={`difficulty-badge ${badgeClass(question.difficulty)}`}>
                {question.difficulty}
              </span>
                        </h1>
                        {loadingLastAttempt && <small>Loading your last attempt…</small>}
                    </div>
                    <div>
                        <button className="btn btn-accent me-2" onClick={handleRunCode} disabled={isRunning || isSubmitting}>
                            {isRunning ? 'Running…' : 'Run Code'}
                        </button>
                        <button className="btn btn-accent" onClick={handleSubmitCode} disabled={isSubmitting || isRunning}>
                            {isSubmitting ? 'Submitting…' : 'Submit'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="editor-container">
                <div className="container">
                    <section className="mb-4">
                        <h5>Description</h5>
                        <p>{question.description}</p>
                    </section>

                    <section className="mb-4">
                        <CodeMirror
                            value={code}
                            height="400px"
                            theme={dracula}
                            extensions={[languageExtension]}
                            onChange={handleCodeChange}
                        />
                    </section>

                    <section>
                        <h5>
                            Output{' '}
                            {runSuccess !== null && (
                                <span className={`output-status ${runSuccess ? 'success' : 'error'}`}>
                  {runSuccess ? 'ok' : 'not ok'}
                </span>
                            )}
                        </h5>
                        <div className="code-output">
                            {output ? <pre>{output}</pre> : <em>Click “Run Code” to see results</em>}
                        </div>
                    </section>
                </div>
            </main>

            <style>{`

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

                @keyframes slideInBottom {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0% { opacity: 0.6; }
                    50% { opacity: 1; }
                    100% { opacity: 0.6; }
                }
            `}</style>
        </Layout>
    );
};

export default CodeEditorPage;