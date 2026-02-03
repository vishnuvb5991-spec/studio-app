import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/auth/profile/');
            setUser(response.data);
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login/', { email, password });
            const { tokens, user: userData } = response.data;

            localStorage.setItem('access_token', tokens.access);
            localStorage.setItem('refresh_token', tokens.refresh);
            setToken(tokens.access);
            setUser(userData);

            return { success: true };
        } catch (error) {
            console.error('❌ Login Error Details:', error.response?.data);

            let errorMessage = 'Login failed';

            if (error.response?.data) {
                const data = error.response.data;
                // DRF typically returns non_field_errors or specific field errors
                if (data.non_field_errors) {
                    errorMessage = data.non_field_errors[0];
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (typeof data === 'object') {
                    // Try to extract first error from any field
                    const firstKey = Object.keys(data)[0];
                    if (Array.isArray(data[firstKey])) {
                        errorMessage = `${firstKey}: ${data[firstKey][0]}`;
                    }
                }
            } else if (error.request) {
                errorMessage = 'No response from server. Check your internet or API URL.';
            }

            return {
                success: false,
                error: errorMessage
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
