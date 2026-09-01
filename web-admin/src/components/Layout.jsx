import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function Layout() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'var(--bg-main)'
            }}>
                <div className="animate-pulse" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    Connecting to Studio Pro Cloud...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <main style={{ marginTop: '0.5rem' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
