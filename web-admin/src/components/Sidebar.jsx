import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Image,
    Calendar,
    Wand2,
    CreditCard,
    Users,
    Settings,
    Camera,
    Sparkles,
    UserCheck,
    Smartphone,
    Download
} from 'lucide-react';

const studioOwnerNav = [
    { icon: LayoutDashboard, label: 'Command Center', path: '/', badge: null },
    { icon: Image, label: 'Client Galleries', path: '/albums', badge: 'HD' },
    { icon: Calendar, label: 'Shoot Schedules', path: '/bookings', badge: 'Live' },
    { icon: Wand2, label: 'AI Restoration Lab', path: '/restorations', badge: 'AI' },
    { icon: CreditCard, label: 'Payments & Revenue', path: '/payments', badge: '₹' },
    { icon: Users, label: 'Customer CRM', path: '/customers', badge: null },
    { icon: Settings, label: 'Studio Settings', path: '/settings', badge: null },
];

const customerNav = [
    { icon: LayoutDashboard, label: 'Client Home', path: '/', badge: null },
    { icon: Image, label: 'My Photo Albums', path: '/albums', badge: 'Download' },
    { icon: Calendar, label: 'My Event Bookings', path: '/bookings', badge: null },
    { icon: Wand2, label: 'Restore Old Photos', path: '/restorations', badge: 'AI' },
    { icon: CreditCard, label: 'Invoices & Receipts', path: '/payments', badge: null },
    { icon: Settings, label: 'Profile Settings', path: '/settings', badge: null },
];

function Sidebar() {
    const { user, isCustomer } = useAuth();
    const navItems = isCustomer ? customerNav : studioOwnerNav;

    return (
        <aside className="sidebar">
            {/* Brand Logo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                marginBottom: '2.25rem',
                padding: '0 0.5rem'
            }}>
                <div style={{
                    width: 44,
                    height: 44,
                    background: 'var(--grad-cosmic)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 24px var(--primary-glow)',
                }}>
                    <Camera size={24} color="white" />
                </div>
                <div>
                    <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                    }}>
                        <span className="gradient-text">Studio Pro</span>
                        <Sparkles size={14} color="#ec4899" />
                    </div>
                    <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: isCustomer ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        {isCustomer ? '👤 Client Portal' : '👑 Studio Suite'}
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    padding: '0.5rem 0.75rem 0.25rem'
                }}>
                    {isCustomer ? 'My Hub' : 'Management'}
                </div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 0.95rem',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? '#ffffff' : 'var(--text-secondary)',
                            background: isActive
                                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.15))'
                                : 'transparent',
                            border: isActive
                                ? '1px solid rgba(139, 92, 246, 0.35)'
                                : '1px solid transparent',
                            boxShadow: isActive ? '0 0 20px rgba(139, 92, 246, 0.2)' : 'none',
                            textDecoration: 'none',
                            transition: 'all var(--transition-fast)',
                            cursor: 'pointer',
                        })}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <item.icon size={19} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</span>
                        </div>

                        {item.badge && (
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.45rem',
                                borderRadius: 'var(--radius-full)',
                                background: item.badge === 'AI' 
                                    ? 'var(--grad-primary)' 
                                    : item.badge === 'Live'
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : 'rgba(255, 255, 255, 0.1)',
                                color: item.badge === 'Live' ? '#34d399' : '#ffffff',
                                border: item.badge === 'Live' ? '1px solid rgba(16, 185, 129, 0.4)' : 'none'
                            }}>
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Mobile App Sync Promotion / Cloud Status Card */}
            <div style={{
                marginTop: 'auto',
                padding: '1.15rem',
                background: 'linear-gradient(135deg, rgba(20, 24, 48, 0.9), rgba(15, 17, 35, 0.95))',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-highlight)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <Smartphone size={16} color="var(--accent-cyan)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-pure)' }}>
                        Mobile App Sync
                    </span>
                </div>

                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.65rem',
                    lineHeight: 1.35
                }}>
                    Use your same account to download photos on your Android/iOS phone.
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.7rem',
                    color: '#34d399',
                    fontWeight: 700
                }}>
                    <div className="pulse-dot" />
                    <span>Live 2-Way Sync Active</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
