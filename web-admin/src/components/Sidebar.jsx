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
    Smartphone,
    Eye,
    Repeat,
    Crown,
    X,
} from 'lucide-react';

const studioOwnerNav = [
    { icon: LayoutDashboard, label: 'Command Center', path: '/dashboard', badge: null },
    { icon: Image, label: 'Client Galleries', path: '/albums', badge: 'HD' },
    { icon: Calendar, label: 'Shoot Schedules', path: '/bookings', badge: 'Live' },
    { icon: Wand2, label: 'AI Restoration Lab', path: '/restorations', badge: 'AI' },
    { icon: CreditCard, label: 'Payments & Revenue', path: '/payments', badge: '₹' },
    { icon: Users, label: 'Customer CRM', path: '/customers', badge: null },
    { icon: Settings, label: 'Studio Settings', path: '/settings', badge: null },
];

const customerNav = [
    { icon: LayoutDashboard, label: 'Client Home', path: '/dashboard', badge: null },
    { icon: Image, label: 'My Photo Albums', path: '/albums', badge: 'Download' },
    { icon: Calendar, label: 'My Event Bookings', path: '/bookings', badge: null },
    { icon: Wand2, label: 'Restore Old Photos', path: '/restorations', badge: 'AI' },
    { icon: CreditCard, label: 'Invoices & Receipts', path: '/payments', badge: null },
    { icon: Settings, label: 'Profile Settings', path: '/settings', badge: null },
];

function Sidebar({ isOpen, onClose }) {
    const { user, isStudioOwner, viewMode, toggleViewMode } = useAuth();
    const isCustomerView = viewMode === 'customer';
    const navItems = isCustomerView ? customerNav : studioOwnerNav;

    return (
        <aside className={`sidebar${isOpen ? ' open' : ''}`}>
            {/* Brand Logo + Mobile Close */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                marginBottom: '2rem',
                padding: '0 0.5rem'
            }}>

                <div style={{
                    width: 44,
                    height: 44,
                    background: '#18181b',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(24, 24, 27, 0.25)',
                }}>
                    <Camera size={22} color="#fde68a" />
                </div>
                <div>
                    <div style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.01em',
                        color: '#18181b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                    }}>
                        <span>Balan Studios</span>
                        <Sparkles size={14} color="#d97706" />
                    </div>
                    <div style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: isCustomerView ? '#d97706' : '#71717a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        {isCustomerView ? (isStudioOwner ? '👤 Customer View (Owner)' : '👤 Client Portal') : '👑 Studio Suite'}
                    </div>
                </div>

                {/* Mobile close button — only visible ≤1024px via CSS */}
                <button
                    onClick={onClose}
                    style={{
                        marginLeft: 'auto',
                        width: 34,
                        height: 34,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f4f4f5',
                        border: '1px solid #e4e4e7',
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        color: '#18181b',
                        flexShrink: 0,
                    }}
                    aria-label="Close sidebar"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Navigation Menu */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#71717a',
                    padding: '0.5rem 0.75rem 0.25rem'
                }}>
                    {isCustomerView ? 'Customer Space' : 'Studio Management'}
                </div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        onClick={onClose}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem 0.95rem',
                            borderRadius: 'var(--radius-md)',
                            color: isActive ? '#92400e' : '#52525b',
                            background: isActive
                                ? '#fef3c7'
                                : 'transparent',
                            border: isActive
                                ? '1px solid #fde68a'
                                : '1px solid transparent',
                            boxShadow: isActive ? '0 2px 8px rgba(217, 119, 6, 0.12)' : 'none',
                            textDecoration: 'none',
                            transition: 'all var(--transition-fast)',
                            cursor: 'pointer',
                        })}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <item.icon size={19} />
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</span>
                        </div>

                        {item.badge && (
                            <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                padding: '0.15rem 0.45rem',
                                borderRadius: 'var(--radius-full)',
                                background: item.badge === 'Live'
                                    ? '#ecfdf5'
                                    : item.badge === 'AI'
                                    ? '#fef3c7'
                                    : '#f4f4f5',
                                color: item.badge === 'Live' 
                                    ? '#065f46' 
                                    : item.badge === 'AI'
                                    ? '#92400e'
                                    : '#18181b',
                                border: item.badge === 'Live' 
                                    ? '1px solid #a7f3d0' 
                                    : item.badge === 'AI'
                                    ? '1px solid #fde68a'
                                    : '1px solid #e4e4e7'
                            }}>
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Owner Dual-Access Switcher Card */}
            {isStudioOwner && (
                <div style={{
                    marginTop: 'auto',
                    marginBottom: '1rem',
                    padding: '0.85rem 1rem',
                    background: isCustomerView ? '#fef3c7' : '#f4f4f5',
                    border: `1px solid ${isCustomerView ? '#fde68a' : '#e4e4e7'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                }}
                onClick={toggleViewMode}
                title="Switch view"
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isCustomerView ? <Crown size={16} color="#d97706" /> : <Eye size={16} color="#18181b" />}
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: isCustomerView ? '#92400e' : '#18181b' }}>
                                {isCustomerView ? 'Switch to Owner Mode' : 'Preview Customer Mode'}
                            </span>
                        </div>
                        <Repeat size={14} color="#71717a" />
                    </div>
                </div>
            )}

            {/* Mobile App Sync / Cloud Status Card */}
            <div style={{
                marginTop: isStudioOwner ? 0 : 'auto',
                padding: '1.15rem',
                background: '#fafaf9',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid #e5e7eb',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                    <Smartphone size={16} color="#d97706" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#18181b' }}>
                        Mobile App Sync
                    </span>
                </div>

                <p style={{
                    fontSize: '0.74rem',
                    color: '#52525b',
                    marginBottom: '0.65rem',
                    lineHeight: 1.35
                }}>
                    Use your same credentials on Android/iOS to access client galleries.
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.7rem',
                    color: '#059669',
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
