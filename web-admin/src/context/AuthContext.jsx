import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('owner'); // 'owner' | 'customer'

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
            const userData = response.data;
            setUser(userData);
            if (userData.user_type === 'customer') {
                setViewMode('customer');
            } else {
                setViewMode('owner');
            }
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

            if (userData.user_type === 'customer') {
                setViewMode('customer');
            } else {
                setViewMode('owner');
            }

            return { success: true, user: userData };
        } catch (error) {
            console.error('❌ Login Error Details:', error.response?.data);

            let errorMessage = 'Login failed. Please verify credentials.';
            if (error.response?.data) {
                const data = error.response.data;
                if (data.non_field_errors) {
                    errorMessage = data.non_field_errors[0];
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (typeof data === 'object') {
                    const firstKey = Object.keys(data)[0];
                    if (Array.isArray(data[firstKey])) {
                        errorMessage = `${firstKey}: ${data[firstKey][0]}`;
                    }
                }
            } else if (error.request) {
                errorMessage = 'No response from cloud server. Check internet connection.';
            }

            return { success: false, error: errorMessage };
        }
    };

    const register = async ({ email, password, firstName, lastName, phone, userType = 'customer' }) => {
        try {
            const response = await api.post('/auth/register/', {
                email,
                username: email.split('@')[0] + Math.floor(Math.random() * 1000),
                password,
                first_name: firstName,
                last_name: lastName,
                phone: phone || '0000000000',
                user_type: userType
            });

            const { tokens, user: userData } = response.data;
            if (tokens?.access) {
                localStorage.setItem('access_token', tokens.access);
                localStorage.setItem('refresh_token', tokens.refresh);
                setToken(tokens.access);
                setUser(userData);
                setViewMode('customer');
            }

            return { success: true, user: userData };
        } catch (error) {
            console.error('❌ Register Error:', error.response?.data);
            let errorMessage = 'Registration failed. Please check inputs.';
            if (error.response?.data) {
                const data = error.response.data;
                const firstKey = Object.keys(data)[0];
                if (Array.isArray(data[firstKey])) {
                    errorMessage = `${firstKey}: ${data[firstKey][0]}`;
                } else if (typeof data[firstKey] === 'string') {
                    errorMessage = data[firstKey];
                }
            }
            return { success: false, error: errorMessage };
        }
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'owner' ? 'customer' : 'owner');
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
        setViewMode('owner');
    };

    const isStudioOwner = user?.user_type === 'studio_owner' || user?.is_superuser;
    const isCustomer = user?.user_type === 'customer';
    // If user is owner, they can switch between owner and customer view. If customer, always customer view.
    const activeView = isStudioOwner ? viewMode : 'customer';

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token,
        isCustomer,
        isStudioOwner,
        viewMode: activeView,
        setViewMode,
        toggleViewMode,
        login,
        register,
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
