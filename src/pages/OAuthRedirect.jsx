import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthRedirect = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const token = params.get('token');

        if (token) {
            const currentToken = localStorage.getItem('jwtToken');
            if (currentToken !== token) {
                login(token);
            }
            navigate('/', { replace: true });
        } else {
            navigate('/login', {
                state: { error: 'Authentication failed' },
                replace: true
            });
        }
    }, [search, navigate, login]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4">Completing authentication...</p>
            </div>
        </div>
    );
};

export default OAuthRedirect;