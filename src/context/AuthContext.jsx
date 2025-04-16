import { createContext, useContext, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('jwtToken');
        return token ? { token } : null;
    });

    const login = useCallback(async token => {
        localStorage.setItem('jwtToken', token);
        try {
            const res = await fetch('http://localhost:8080/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const profile = await res.json();
            setUser({ token, username: profile.username, role: profile.role });
        } catch {
            // fallback: decode token or set minimal user
            const { sub: email } = jwtDecode(token);
            setUser({ token, username: email, role: 'user' });
        }
    }, []);


    const logout = useCallback(() => {
        localStorage.removeItem('jwtToken');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
};