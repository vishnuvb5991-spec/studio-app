import React, { useState, useCallback } from 'react';
import { Outlet, Navigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import {
    LayoutDashboard,
    Image,
    Calendar,
    CreditCard,
    Settings,
    Menu,
    X,
} from 'lucide-react';

// Bottom-nav items shown on mobile (compact, 5 most-used)
const ownerBottomNav = [
    { icon: LayoutDashboard, label: 'Home',     path: '/dashboard' },
    { icon: Image,           label: 'Albums',   path: '/albums'    },
    { icon: Calendar,        label: 'Bookings', path: '/bookings'  },
    { icon: CreditCard,      label: 'Payments', path: '/payments'  },
    { icon: Settings,        label: 'Settings', path: '/settings'  },
];

const customerBottomNav = [
    { icon: LayoutDashboard, label: 'Home',     path: '/dashboard' },
    { icon: Image,           label: 'Albums',   path: '/albums'    },
    { icon: Calendar,        label: 'Bookings', path: '/bookings'  },
    { icon: CreditCard,      label: 'Invoices', path: '/payments'  },
    { icon: Settings,        label: 'Profile',  path: '/settings'  },
];

function Layout() {
    const { isAuthenticated, loading, isStudioOwner, viewMode } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const closeSidebar = useCallback(() => setSidebarOpen(false), []);
    const openSidebar  = useCallback(() => setSidebarOpen(true),  []);

    const isCustomerView = viewMode === 'customer';
    const bottomNavItems = isCustomerView ? customerBottomNav : ownerBottomNav;

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
                    Connecting to Balan Studios Cloud...
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="dashboard-layout">
            {/* Mobile overlay backdrop */}
            <div
                className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
                onClick={closeSidebar}
                aria-hidden="true"
            />

            {/* Sidebar — receives open state for mobile drawer */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            <div className="main-content">
                {/* Navbar — receives handler to open sidebar hamburger */}
                <Navbar onMenuClick={openSidebar} />
                <main style={{ marginTop: '0.5rem' }}>
                    <Outlet />
                </main>
            </div>

            {/* Mobile bottom navigation */}
            <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
                {bottomNavItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) => isActive ? 'active' : ''}
                        onClick={closeSidebar}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}

export default Layout;
