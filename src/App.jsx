import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider }     from './context/AuthContext';
import PublicRoute          from './components/PublicRoute';
import PrivateRoute         from './components/PrivateRoute';
import AdminRoute           from './components/AdminRoute';
import HomePage             from './pages/HomePage';
import LoginPage            from './pages/LoginPage';
import RegisterPage         from './pages/RegisterPage';
import OAuth2RedirectHandler from './oauth2/OAuth2RedirectHandler';
import QuestionsPage        from './pages/QuestionsPage';
import CodeEditorPage       from './pages/CodeEditorPage';
import GradePage            from './pages/GradePage';
import LogoutPage           from './pages/LogoutPage';
import AdminPage            from './pages/AdminPage';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>} />
                    <Route path="/register" element={<PublicRoute><RegisterPage/></PublicRoute>} />
                    <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>} />
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/questions" element={<PrivateRoute><QuestionsPage/></PrivateRoute>} />
                    <Route path="/questions/:questionId/attempt" element={<PrivateRoute><CodeEditorPage/></PrivateRoute>} />
                    <Route path="/grade" element={<PrivateRoute><GradePage/></PrivateRoute>} />
                    <Route path="/logout" element={<PrivateRoute><LogoutPage/></PrivateRoute>} />
                    <Route path="/admin" element={
                        <PrivateRoute>
                            <AdminRoute><AdminPage/></AdminRoute>
                        </PrivateRoute>
                    }/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}