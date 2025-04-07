import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import pages
import HomePage from './pages/HomePage';
import QuestionsPage from './pages/QuestionsPage';
import CodeEditorPage from './pages/CodeEditorPage';
import LoginPage from './pages/LoginPage';
import LoginFailedPage from './pages/LoginFailedPage';
import RegisterPage from './pages/RegisterPage';
import LogoutPage from "./pages/LogoutPage";

// Import Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GradePage from "./pages/GradePage";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage";
import OAuth2Success from "./pages/OAuth2Success";

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
          <Route path="/logout" element={<LogoutPage loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />} />
          <Route path="/grade" element={<GradePage loggedInUser={loggedInUser} />} />
          <Route path="/oauth2-success" element={<OAuth2Success />} />

          <Route
              path="/admin"
              element={
                <AdminRoute
                    element={<AdminPage loggedInUser={loggedInUser} />}
                    loggedInUser={loggedInUser}
                />
              }
          />
        </Routes>
      </Router>
  );
};

export default App;
