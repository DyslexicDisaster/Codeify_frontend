import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicRoute from './components/PublicRoute';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute   from './components/AdminRoute';

import HomePage               from './pages/HomePage';
import LoginPage              from './pages/LoginPage';
import RegisterPage           from './pages/RegisterPage';
import OAuth2RedirectHandler  from './oauth2/OAuth2RedirectHandler';
import QuestionsPage          from './pages/QuestionsPage';
import CodeEditorPage         from './pages/CodeEditorPage';
import GradePage              from './pages/GradePage';
import ProfilePage            from './pages/ProfilePage';
import LogoutPage             from './pages/LogoutPage';
import AdminPage              from './pages/AdminPage';
import LoginFailedPage        from './pages/LoginFailedPage';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* always public */}
                    <Route path="/" element={<HomePage />} />

                    {/* OAuth2 callback is public (you don’t want it guarded!) */}
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

                    {/* only for anon users */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <PublicRoute>
                                <RegisterPage />
                            </PublicRoute>
                        }
                    />
                    <Route path="/login-failed" element={<LoginFailedPage />} />

                    {/* protected — must be logged in */}
                    <Route
                        path="/questions/*"
                        element={
                            <PrivateRoute>
                                <QuestionsPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/questions/:questionId/attempt"
                        element={
                            <PrivateRoute>
                                <CodeEditorPage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/grade"
                        element={
                            <PrivateRoute>
                                <GradePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/logout"
                        element={
                            <PrivateRoute>
                                <LogoutPage />
                            </PrivateRoute>
                        }
                    />

                    {/* admin only */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminPage />
                            </AdminRoute>
                        }
                    />

                    {/* catch‐all → home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}