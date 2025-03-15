import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import axios from 'axios';

// API base URL
const API_URL = 'http://localhost:8080/admin';

const AdminPage = ({ loggedInUser }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // User state
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userFormData, setUserFormData] = useState({
        userId: 0,
        username: '',
        email: '',
        password: '',
        salt: '',
        role: 'user'
    });
    const [isEditingUser, setIsEditingUser] = useState(false);

    // Question state
    const [questions, setQuestions] = useState([]);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [questionFormData, setQuestionFormData] = useState({
        id: 0,
        title: '',
        description: '',
        programmingLanguage: { id: 1 },
        questionType: 'CODE',
        difficulty: 'EASY',
        starterCode: '',
        aiSolutionRequired: false,
        correctAnswer: ''
    });
    const [isEditingQuestion, setIsEditingQuestion] = useState(false);
    const [programmingLanguages, setProgrammingLanguages] = useState([]);

    useEffect(() => {
        // Redirect if not logged in as admin
        if (!loggedInUser) {
            navigate('/login', {
                state: { message: 'Please login to access the admin panel.' }
            });
            return;
        }

        fetchProgrammingLanguages();

        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'questions') {
            fetchQuestions();
        }
    }, [loggedInUser, navigate, activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/get_all_users`);
            console.log('Users API response:', response.data);


            if (typeof response.data === 'string') {
                try {
                    const userDataString = response.data;
                    const userObjects = [];

                    // Extract individual user entries using regex
                    const userRegex = /User\{([^}]+)\}/g;
                    const matches = userDataString.match(userRegex);

                    if (matches && matches.length > 0) {
                        matches.forEach(userString => {
                            // For each user string, extract the field values
                            const userId = userString.match(/userId=(\d+)/)?.[1];
                            const username = userString.match(/username='([^']+)'/)?.[1];
                            const email = userString.match(/email='([^']+)'/)?.[1];
                            const role = userString.match(/role=([^,}]+)/)?.[1];
                            const registrationDate = userString.match(/registrationDate=([^,}]+)/)?.[1];

                            if (userId && username) {
                                userObjects.push({
                                    userId: parseInt(userId),
                                    username,
                                    email: email || '',
                                    role: role || 'user',
                                    registrationDate: registrationDate || '',
                                });
                            }
                        });
                    }

                    console.log('Parsed users:', userObjects);
                    setUsers(userObjects);
                } catch (parseErr) {
                    console.error('Error parsing user data:', parseErr);
                    setError('Error parsing user data. The format may have changed.');
                    setUsers([]);
                }
            } else if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setUsers([]);
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users. Please try again.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };


    const handleUserFormChange = (e) => {
        const { name, value } = e.target;
        setUserFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUserRoleChange = (e) => {
        setUserFormData(prev => ({
            ...prev,
            role: e.target.value
        }));
    };

    const handleUserSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isEditingUser) {
                await axios.put(`${API_URL}/update_user`, userFormData);
                setSuccessMessage('User updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_user`, userFormData);
                setSuccessMessage('User added successfully!');
            }

            fetchUsers();
            resetUserForm();
        } catch (err) {
            console.error('Error saving user:', err);
            setError(err.response?.data || 'An error occurred while saving the user.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setUserFormData({
            userId: user.userId,
            username: user.username,
            email: user.email,
            password: '',
            salt: user.salt,
            role: user.role
        });
        setSelectedUser(user);
        setIsEditingUser(true);
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await axios.delete(`${API_URL}/delete_user/${userId}`);
            setSuccessMessage('User deleted successfully!');
            fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.response?.data || 'An error occurred while deleting the user.');
        } finally {
            setLoading(false);
        }
    };

    const resetUserForm = () => {
        setUserFormData({
            userId: 0,
            username: '',
            email: '',
            password: '',
            salt: '',
            role: 'user'
        });
        setSelectedUser(null);
        setIsEditingUser(false);
    };

    // Question management functions
    const fetchQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/get_all_questions`);
            console.log('Questions API response:', response.data);

            if (typeof response.data === 'string') {
                try {
                    const questionDataString = response.data;
                    const questionObjects = [];

                    const questionRegex = /Question\{([^}]+)\}/g;
                    const matches = questionDataString.match(questionRegex);

                    if (matches && matches.length > 0) {
                        matches.forEach(questionString => {
                            const id = questionString.match(/id=(\d+)/)?.[1];
                            const title = questionString.match(/title='([^']+)'/)?.[1];
                            const description = questionString.match(/description='([^']+)'/)?.[1];
                            const difficulty = questionString.match(/difficulty=([^,}]+)/)?.[1];
                            const questionType = questionString.match(/questionType=([^,}]+)/)?.[1];

                            const langId = questionString.match(/programmingLanguage=ProgrammingLanguage\{id=(\d+)/)?.[1];
                            const langName = questionString.match(/programmingLanguage=ProgrammingLanguage\{[^}]*name='([^']+)'/)?.[1];

                            if (id && title) {
                                questionObjects.push({
                                    id: parseInt(id),
                                    title,
                                    description: description || '',
                                    difficulty: difficulty || 'EASY',
                                    questionType: questionType || 'CODE',
                                    programmingLanguage: {
                                        id: langId ? parseInt(langId) : 1,
                                        name: langName || 'Unknown'
                                    }
                                });
                            }
                        });
                    }

                    console.log('Parsed questions:', questionObjects);
                    setQuestions(questionObjects);
                } catch (parseErr) {
                    console.error('Error parsing question data:', parseErr);
                    setError('Error parsing question data. The format may have changed.');
                    setQuestions([]);
                }
            } else if (Array.isArray(response.data)) {
                setQuestions(response.data);
            } else {
                setQuestions([]);
            }
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError('Failed to load questions. Please try again.');
            setQuestions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchProgrammingLanguages = async () => {
        try {
            const response = await axios.get(`${API_URL}/programming_languages`);
            setProgrammingLanguages(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Error fetching programming languages:', err);
        }
    };

    const handleQuestionFormChange = (e) => {
        const { name, value } = e.target;
        setQuestionFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLanguageChange = (e) => {
        setQuestionFormData(prev => ({
            ...prev,
            programmingLanguage: { id: parseInt(e.target.value) }
        }));
    };

    const handleQuestionTypeChange = (e) => {
        setQuestionFormData(prev => ({
            ...prev,
            questionType: e.target.value
        }));
    };

    const handleDifficultyChange = (e) => {
        setQuestionFormData(prev => ({
            ...prev,
            difficulty: e.target.value
        }));
    };

    const handleAiSolutionChange = (e) => {
        setQuestionFormData(prev => ({
            ...prev,
            aiSolutionRequired: e.target.checked
        }));
    };

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isEditingQuestion) {
                await axios.put(`${API_URL}/update_question`, questionFormData);
                setSuccessMessage('Question updated successfully!');
            } else {
                await axios.post(`${API_URL}/add_question`, questionFormData);
                setSuccessMessage('Question added successfully!');
            }

            fetchQuestions();
            resetQuestionForm();
        } catch (err) {
            console.error('Error saving question:', err);
            setError(err.response?.data || 'An error occurred while saving the question.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditQuestion = (question) => {
        setQuestionFormData({
            id: question.id,
            title: question.title,
            description: question.description,
            programmingLanguage: question.programmingLanguage,
            questionType: question.questionType,
            difficulty: question.difficulty,
            starterCode: question.starterCode,
            aiSolutionRequired: question.aiSolutionRequired,
            correctAnswer: question.correctAnswer
        });
        setSelectedQuestion(question);
        setIsEditingQuestion(true);
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            await axios.delete(`${API_URL}/delete_question/${questionId}`);
            setSuccessMessage('Question deleted successfully!');
            fetchQuestions();
        } catch (err) {
            console.error('Error deleting question:', err);
            setError(err.response?.data || 'An error occurred while deleting the question.');
        } finally {
            setLoading(false);
        }
    };

    const resetQuestionForm = () => {
        setQuestionFormData({
            id: 0,
            title: '',
            description: '',
            programmingLanguage: { id: programmingLanguages[0]?.id || 1 },
            questionType: 'CODE',
            difficulty: 'EASY',
            starterCode: '',
            aiSolutionRequired: false,
            correctAnswer: ''
        });
        setSelectedQuestion(null);
        setIsEditingQuestion(false);
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

    return (
        <Layout loggedInUser={loggedInUser}>
            <div className="admin-container main-content">
                <div className="container mt-4">
                    <div className="admin-header mb-4 fade-in">
                        <h1 className="text-center">
                            <i className="fas fa-cogs me-2"></i>Admin Panel
                        </h1>
                        <p className="text-center text-muted">
                            Manage users and questions for the Codeify platform
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-danger fade-in-up mb-4" role="alert">
                            <i className="fas fa-exclamation-circle me-2"></i>
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div className="alert alert-success fade-in-up mb-4" role="alert">
                            <i className="fas fa-check-circle me-2"></i>
                            {successMessage}
                        </div>
                    )}

                    <ul className="nav nav-tabs admin-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                                onClick={() => setActiveTab('users')}
                            >
                                <i className="fas fa-users me-2"></i>Users
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'questions' ? 'active' : ''}`}
                                onClick={() => setActiveTab('questions')}
                            >
                                <i className="fas fa-question-circle me-2"></i>Questions
                            </button>
                        </li>
                    </ul>

                    {activeTab === 'users' && (
                        <div className="user-management slide-in-right">
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="card shadow mb-4">
                                        <div className="card-header bg-transparent">
                                            <h3 className="mb-0">
                                                <i className="fas fa-users me-2"></i>All Users
                                            </h3>
                                        </div>
                                        <div className="card-body p-0">
                                            {loading && users.length === 0 ? (
                                                <div className="text-center p-4">
                                                    <div className="spinner-border text-accent" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2 mb-0">Loading users...</p>
                                                </div>
                                            ) : users.length === 0 ? (
                                                <div className="text-center p-4">
                                                    <p className="mb-0">No users found</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <table className="table table-hover table-striped mb-0">
                                                        <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Username</th>
                                                            <th>Email</th>
                                                            <th>Role</th>
                                                            <th>Registration Date</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {users.map(user => (
                                                            <tr key={user.userId}
                                                                className={selectedUser?.userId === user.userId ? 'table-active' : ''}>
                                                                <td>{user.userId}</td>
                                                                <td>{user.username}</td>
                                                                <td>{user.email}</td>
                                                                <td>
                                                                        <span className={`badge ${user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                                                            {user.role}
                                                                        </span>
                                                                </td>
                                                                <td>{user.registrationDate}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-accent me-2"
                                                                        onClick={() => handleEditUser(user)}
                                                                    >
                                                                        <i className="fas fa-edit"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleDeleteUser(user.userId)}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div className="card shadow">
                                        <div className="card-header bg-transparent">
                                            <h3 className="mb-0">
                                                {isEditingUser ? (
                                                    <><i className="fas fa-edit me-2"></i>Edit User</>
                                                ) : (
                                                    <><i className="fas fa-plus-circle me-2"></i>Add User</>
                                                )}
                                            </h3>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleUserSubmit}>
                                                <div className="mb-3">
                                                    <label htmlFor="username" className="form-label">Username</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="username"
                                                        name="username"
                                                        value={userFormData.username}
                                                        onChange={handleUserFormChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="email" className="form-label">Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        id="email"
                                                        name="email"
                                                        value={userFormData.email}
                                                        onChange={handleUserFormChange}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="password" className="form-label">
                                                        {isEditingUser ? 'New Password (leave blank to keep current)' : 'Password'}
                                                    </label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="password"
                                                        name="password"
                                                        value={userFormData.password}
                                                        onChange={handleUserFormChange}
                                                        required={!isEditingUser}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="role" className="form-label">Role</label>
                                                    <select
                                                        className="form-select"
                                                        id="role"
                                                        value={userFormData.role}
                                                        onChange={handleUserRoleChange}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </div>
                                                <div className="d-grid gap-2">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-accent"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Saving...
                                                            </>
                                                        ) : isEditingUser ? (
                                                            <>
                                                                <i className="fas fa-save me-2"></i>
                                                                Update User
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-plus-circle me-2"></i>
                                                                Add User
                                                            </>
                                                        )}
                                                    </button>
                                                    {isEditingUser && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            onClick={resetUserForm}
                                                        >
                                                            <i className="fas fa-times me-2"></i>
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div className="question-management slide-in-right">
                            <div className="row">
                                <div className="col-md-12 mb-4">
                                    <div className="card shadow">
                                        <div className="card-header bg-transparent">
                                            <h3 className="mb-0">
                                                <i className="fas fa-question-circle me-2"></i>All Questions
                                            </h3>
                                        </div>
                                        <div className="card-body p-0">
                                            {loading && questions.length === 0 ? (
                                                <div className="text-center p-4">
                                                    <div className="spinner-border text-accent" role="status">
                                                        <span className="visually-hidden">Loading...</span>
                                                    </div>
                                                    <p className="mt-2 mb-0">Loading questions...</p>
                                                </div>
                                            ) : questions.length === 0 ? (
                                                <div className="text-center p-4">
                                                    <p className="mb-0">No questions found</p>
                                                </div>
                                            ) : (
                                                <div className="table-responsive">
                                                    <table className="table table-hover table-striped mb-0">
                                                        <thead>
                                                        <tr>
                                                            <th>ID</th>
                                                            <th>Title</th>
                                                            <th>Language</th>
                                                            <th>Type</th>
                                                            <th>Difficulty</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {questions.map(question => (
                                                            <tr key={question.id}
                                                                className={selectedQuestion?.id === question.id ? 'table-active' : ''}>
                                                                <td>{question.id}</td>
                                                                <td>{question.title}</td>
                                                                <td>{question.programmingLanguage?.name}</td>
                                                                <td>{question.questionType}</td>
                                                                <td>
                                                                        <span className={`difficulty-badge ${getColorClass(question.difficulty)}`}>
                                                                            {question.difficulty}
                                                                        </span>
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-accent me-2"
                                                                        onClick={() => handleEditQuestion(question)}
                                                                    >
                                                                        <i className="fas fa-edit"></i>
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleDeleteQuestion(question.id)}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="card shadow">
                                        <div className="card-header bg-transparent">
                                            <h3 className="mb-0">
                                                {isEditingQuestion ? (
                                                    <><i className="fas fa-edit me-2"></i>Edit Question</>
                                                ) : (
                                                    <><i className="fas fa-plus-circle me-2"></i>Add Question</>
                                                )}
                                            </h3>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleQuestionSubmit}>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="title" className="form-label">Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="title"
                                                            name="title"
                                                            value={questionFormData.title}
                                                            onChange={handleQuestionFormChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="programmingLanguage" className="form-label">
                                                            Programming Language
                                                        </label>
                                                        <select
                                                            className="form-select"
                                                            id="programmingLanguage"
                                                            value={questionFormData.programmingLanguage.id}
                                                            onChange={handleLanguageChange}
                                                            required
                                                        >
                                                            {programmingLanguages.map(lang => (
                                                                <option key={lang.id} value={lang.id}>
                                                                    {lang.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-4 mb-3">
                                                        <label htmlFor="questionType" className="form-label">
                                                            Question Type
                                                        </label>
                                                        <select
                                                            className="form-select"
                                                            id="questionType"
                                                            value={questionFormData.questionType}
                                                            onChange={handleQuestionTypeChange}
                                                            required
                                                        >
                                                            <option value="CODE">Code</option>
                                                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label htmlFor="difficulty" className="form-label">
                                                            Difficulty
                                                        </label>
                                                        <select
                                                            className="form-select"
                                                            id="difficulty"
                                                            value={questionFormData.difficulty}
                                                            onChange={handleDifficultyChange}
                                                            required
                                                        >
                                                            <option value="EASY">Easy</option>
                                                            <option value="MEDIUM">Medium</option>
                                                            <option value="HARD">Hard</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4 mb-3">
                                                        <label className="form-label d-block">Options</label>
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="aiSolutionRequired"
                                                                checked={questionFormData.aiSolutionRequired}
                                                                onChange={handleAiSolutionChange}
                                                            />
                                                            <label className="form-check-label" htmlFor="aiSolutionRequired">
                                                                AI Solution Required
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="description" className="form-label">Description</label>
                                                    <textarea
                                                        className="form-control"
                                                        id="description"
                                                        name="description"
                                                        rows="3"
                                                        value={questionFormData.description}
                                                        onChange={handleQuestionFormChange}
                                                        required
                                                    ></textarea>
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="starterCode" className="form-label">Starter Code</label>
                                                    <textarea
                                                        className="form-control code-textarea"
                                                        id="starterCode"
                                                        name="starterCode"
                                                        rows="5"
                                                        value={questionFormData.starterCode}
                                                        onChange={handleQuestionFormChange}
                                                    ></textarea>
                                                </div>

                                                <div className="mb-3">
                                                    <label htmlFor="correctAnswer" className="form-label">Correct Answer</label>
                                                    <textarea
                                                        className="form-control code-textarea"
                                                        id="correctAnswer"
                                                        name="correctAnswer"
                                                        rows="5"
                                                        value={questionFormData.correctAnswer}
                                                        onChange={handleQuestionFormChange}
                                                        required
                                                    ></textarea>
                                                </div>

                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        {isEditingQuestion && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-secondary"
                                                                onClick={resetQuestionForm}
                                                            >
                                                                <i className="fas fa-times me-2"></i>
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="btn btn-accent"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                                Saving...
                                                            </>
                                                        ) : isEditingQuestion ? (
                                                            <>
                                                                <i className="fas fa-save me-2"></i>
                                                                Update Question
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-plus-circle me-2"></i>
                                                                Add Question
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .main-content {
                    min-height: calc(100vh - 250px);
                }

                .fade-in {
                    animation: fadeIn 0.5s ease-in-out forwards;
                }

                .fade-in-up {
                    animation: fadeInUp 0.5s ease-in-out forwards;
                }

                .slide-in-right {
                    animation: slideInRight 0.5s ease-in-out forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
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

                .card {
                    border-radius: 15px;
                    overflow: hidden;
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                    border: 1px solid #333;
                    margin-bottom: 25px;
                    transition: all 0.3s ease;
                }

                .card:hover {
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
                    border-color: var(--accent);
                }

                .admin-header h1 {
                    font-size: 2.5rem;
                    color: var(--accent);
                    margin-bottom: 0.5rem;
                }

                .admin-tabs .nav-link {
                    color: #ccc;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 10px 10px 0 0;
                    margin-right: 5px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .admin-tabs .nav-link:hover:not(.active) {
                    background-color: rgba(0, 255, 136, 0.1);
                    color: var(--accent);
                }

                .admin-tabs .nav-link.active {
                    background-color: var(--dark-secondary);
                    color: var(--accent);
                    border-bottom: 3px solid var(--accent);
                }

                .btn-accent {
                    background-color: var(--accent);
                    color: var(--dark-bg);
                    border: none;
                    transition: all 0.3s ease;
                }

                .btn-accent:hover:not(:disabled) {
                    background-color: #00cc6a;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 255, 136, 0.3);
                }

                .btn-outline-accent {
                    color: var(--accent);
                    border-color: var(--accent);
                    background-color: transparent;
                    transition: all 0.3s ease;
                }

                .btn-outline-accent:hover {
                    background-color: var(--accent);
                    color: var(--dark-bg);
                }

                .form-control, .form-select {
                    background-color: var(--dark-secondary);
                    border: 1px solid #333;
                    color: #fff;
                    border-radius: 8px;
                    padding: 0.6rem 1rem;
                }

                .form-control:focus, .form-select:focus {
                    border-color: var(--accent);
                    box-shadow: 0 0 0 0.25rem rgba(0, 255, 136, 0.25);
                    background-color: var(--dark-secondary);
                    color: #fff;
                }

                .code-textarea {
                    font-family: monospace;
                    font-size: 0.9rem;
                }

                .table {
                    color: #fff;
                }

                .table tr {
                    transition: all 0.3s ease;
                }

                .table tr:hover {
                    background-color: rgba(0, 255, 136, 0.05);
                }

                .table-active {
                    background-color: rgba(0, 255, 136, 0.1) !important;
                }

                .difficulty-badge {
                    display: inline-block;
                    padding: 0.35rem 0.8rem;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    font-weight: 500;
                }

                .difficulty-easy {
                    background-color: rgba(40, 167, 69, 0.2);
                    color: #5cb85c;
                }

                .difficulty-medium {
                    background-color: rgba(255, 193, 7, 0.2);
                    color: #ffc107;
                }

                .difficulty-hard {
                    background-color: rgba(220, 53, 69, 0.2);
                    color: #ff6b6b;
                }
            `}</style>
        </Layout>
    );
};

export default AdminPage;