import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import OAuth2RedirectHandler from "./oauth2/OAuth2RedirectHandler";
import QuestionsPage from "./pages/QuestionsPage";
import AdminRoute from "./components/AdminRoute";
import LogoutPage from "./pages/LogoutPage";
import CodeEditorPage from "./pages/CodeEditorPage";
import LoginFailedPage from "./pages/LoginFailedPage";
import RegisterPage from "./pages/RegisterPage";
import GradePage from "./pages/GradePage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";

function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user
        ? children
        : <Navigate to="/login" state={{ message: "Please log in first" }} />;
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                    <Route
                        path="/questions/*"
                        element={
                            <PrivateRoute>
                                <QuestionsPage />
                            </PrivateRoute>
                        }
                    />
            <Route path="/" element={<HomePage />} />
            <Route path="/questions" element={<QuestionsPage />} />
            <Route path="/questions/:questionId/attempt" element={<CodeEditorPage />} />
            <Route path="/codeEditor" element={<CodeEditorPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/login-failed" element={<LoginFailedPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/grade" element={<GradePage />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
            <Route
                path="/admin"
                element={
                  <AdminRoute element={<AdminPage />} />
                }
            />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}