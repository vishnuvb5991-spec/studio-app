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
    Camera,
    Sparkles,
    Zap,
    ExternalLink
} from 'lucide-react';

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', badge: null },
    { icon: Image, label: 'Albums', path: '/albums', badge: 'HD' },
    { icon: Calendar, label: 'Bookings', path: '/bookings', badge: 'Live' },
    { icon: Wand2, label: 'Restoration', path: '/restorations', badge: 'AI' },
    { icon: CreditCard, label: 'Payments', path: '/payments', badge: '₹' },
    { icon: Users, label: 'Customers', path: '/customers', badge: null },
    { icon: Settings, label: 'Settings', path: '/settings', badge: null },
];

function Sidebar() {
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
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em'
                    }}>
                        Enterprise Studio Suite
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
                    Menu
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

            {/* Cloud & AI Status Footer Card */}
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
                <div style={{
                    position: 'absolute',
                    top: -15,
                    right: -15,
                    width: 70,
                    height: 70,
                    background: 'var(--grad-primary)',
                    borderRadius: '50%',
                    filter: 'blur(30px)',
                    opacity: 0.35
                }} />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <div className="pulse-dot" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399' }}>Cloud Engine</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>v2.4 Live</span>
                </div>

                <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '0.85rem',
                    lineHeight: 1.4
                }}>
                    AI Photo enhancement & automatic booking sync active.
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.75rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                }}>
                    <span>Storage (Cloudinary)</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>82%</span>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
