import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Image,
    Calendar,
    Wand2,
    CreditCard,
    Users,
    Settings,
    Camera
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Image, label: 'Albums', path: '/albums' },
    { icon: Calendar, label: 'Bookings', path: '/bookings' },
    { icon: Wand2, label: 'Restoration', path: '/restorations' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: Users, label: 'Customers', path: '/customers' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

function Sidebar() {
    return (
        <aside className="sidebar">
            {/* Logo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, var(--primary), #a855f7)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Camera size={24} color="white" />
                </div>
                <span style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, var(--primary), #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Studio Pro
                </span>
            </div>

            {/* Navigation */}
            <nav>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                            background: isActive ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                            textDecoration: 'none',
                            marginBottom: '0.25rem',
                            transition: 'all var(--transition-fast)',
                        })}
                    >
                        <item.icon size={20} />
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Help Card */}
            <div style={{
                marginTop: 'auto',
                padding: '1.25rem',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
            }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Need Help?</h4>
                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem'
                }}>
                    Contact our support team
                </p>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                    Get Support
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
