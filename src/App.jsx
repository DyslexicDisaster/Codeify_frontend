import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import CodeEditorPage from './pages/CodeEditorPage';
import LoginPage from './pages/LoginPage';
import LoginFailedPage from './pages/LoginFailedPage';
import RegisterPage from './pages/RegisterPage';

// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const user = localStorage.getItem('user');
      if (user) {
        setLoggedInUser(JSON.parse(user));
      }
    };

    checkLoginStatus();
  }, []);

  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage loggedInUser={loggedInUser} />} />
          <Route path="/questions" element={<QuestionsPage loggedInUser={loggedInUser} />} />
          <Route path="/questions/:questionId/attempt" element={<CodeEditorPage loggedInUser={loggedInUser} />} />
          <Route path="/codeEditor" element={<CodeEditorPage loggedInUser={loggedInUser} />} />
          <Route path="/login" element={<LoginPage loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />}/>
          <Route path="/login-failed" element={<LoginFailedPage loggedInUser={loggedInUser} />} />
          <Route path="/register" element={<RegisterPage loggedInUser={loggedInUser} />} />
        </Routes>
      </Router>
  );
};

export default App;
