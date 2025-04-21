import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

export default function OAuth2RedirectHandler() {
    const { login } = useAuth();
    const navigate  = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        console.log('[OAuth2RedirectHandler] mounted, search=', search);
        (async () => {
            const params = new URLSearchParams(search);
            const token  = params.get('token');
            console.log('[OAuth2RedirectHandler] parsed token=', token);

            if (token) {
                console.log('[OAuth2RedirectHandler] setting JWT cookie');
                Cookies.set('jwtToken', token, { expires: 1, sameSite: 'Lax' });

                console.log('[OAuth2RedirectHandler] calling context.login(token)');
                login(token);

                console.log('[OAuth2RedirectHandler] navigate to home');
                navigate('/', { replace: true });
            } else {
                console.warn('[OAuth2RedirectHandler] no token, redirecting to /login');
                navigate('/login', {
                    replace: true,
                    state: { message: params.get('error') || 'OAuth login failed' }
                });
            }
        })();
    }, [search, login, navigate]);

    return <div>Signing you in…</div>;
}