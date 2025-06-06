import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/user/', {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.data);
            }
        } catch (err) {
            console.log('Not authenticated');
        } finally {
            setLoading(false);
        }
    };

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch('http://localhost:8080/api/v1/user/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (err) {
            console.log('Logout error:', err);
        } finally {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export { AuthContext };