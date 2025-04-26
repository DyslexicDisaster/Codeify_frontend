import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = Cookies.get('jwtToken');
        return token ? { token, loading: true } : null;
    });

    const loadProfile = async (token) => {
        try {
            const res = await fetch('http://localhost:8080/api/auth/me', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.warn('[AuthContext] /me returned', res.status);
                return null;
            }
            return await res.json();
        } catch (e) {
            console.error('[AuthContext] loadProfile error', e);
            return null;
        }
    };

    useEffect(() => {
        if (user?.token && user.loading) {
            (async () => {
                const profile = await loadProfile(user.token);
                if (profile?.username) {
                    setUser({
                        token: user.token,
                        username: profile.username,
                        role: profile.role,
                        loading: false
                    });
                } else {
                    setUser({ token: user.token, loading: false });
                }
            })();
        }
    }, [user]);

    const login = useCallback(async (token) => {
        Cookies.set('jwtToken', token, { expires: 1, sameSite: 'Lax' });
        setUser({ token, loading: true });
        const profile = await loadProfile(token);
        if (profile?.username) {
            setUser({
                token,
                username: profile.username,
                role: profile.role,
                loading: false
            });
        } else {
            setUser({ token, loading: false });
        }
    }, []);

    const logout = useCallback(() => {
        Cookies.remove('jwtToken');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}