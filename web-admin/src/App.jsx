import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Albums from './pages/Albums';
import Bookings from './pages/Bookings';
import Restorations from './pages/Restorations';
import Payments from './pages/Payments';
import Customers from './pages/Customers';
import Settings from './pages/Settings';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Showcase & In-Website Login (Antimetal/Mobbin style) */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Navigate to="/" replace />} />

                    {/* Authenticated Workspace for Customers & Studio Owners */}
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/albums" element={<Albums />} />
                        <Route path="/bookings" element={<Bookings />} />
                        <Route path="/restorations" element={<Restorations />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
