import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuth2Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const name = urlParams.get('name');

        if (token && name) {
            const user = {
                username: name,
                token: token,
                role: 'USER' // Or extract from token if you want
            };
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/questions');
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <div className="spinner-border text-accent" role="status" />
                <p className="mt-3">Logging you in...</p>
            </div>
        </div>
    );
};

export default OAuth2Success;