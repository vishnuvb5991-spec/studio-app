import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, LogOut, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
    const { user, isCustomer, logout } = useAuth();

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0 1.75rem 0',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '2rem'
        }}>
            {/* Search with Command shortcut */}
            <div style={{
                position: 'relative',
                width: 340,
            }}>
                <Search
                    size={17}
                    style={{
                        position: 'absolute',
                        left: 14,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }}
                />
                <input
                    type="text"
                    placeholder="Search bookings, albums, photos..."
                    style={{
                        paddingLeft: 42,
                        paddingRight: 60,
                        height: 44,
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(20, 24, 48, 0.6)',
                        borderColor: 'var(--border-subtle)'
                    }}
                />
                <div style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-xs)',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-muted)'
                }}>
                    ⌘K
                </div>
            </div>

            {/* Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Switch to Public Website Link */}
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.55rem 1rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'all var(--transition-fast)'
                    }}
                >
                    <Globe size={14} color="#06b6d4" />
                    <span>View Public Website</span>
                </Link>

                {/* Notifications Button */}
                <button style={{
                    position: 'relative',
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(20, 24, 48, 0.6)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                }}>
                    <Bell size={18} />
                    <span style={{
                        position: 'absolute',
                        top: 9,
                        right: 9,
                        width: 8,
                        height: 8,
                        background: 'var(--accent-pink)',
                        borderRadius: '50%',
                        boxShadow: '0 0 8px var(--accent-pink)'
                    }} />
                </button>

                {/* Profile Pill */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.35rem 0.85rem 0.35rem 0.45rem',
                    background: 'linear-gradient(135deg, rgba(30, 35, 71, 0.6), rgba(15, 17, 35, 0.8))',
                    border: '1px solid var(--border-highlight)',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        width: 34,
                        height: 34,
                        background: 'var(--grad-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        color: '#ffffff',
                        boxShadow: '0 0 12px var(--primary-glow)'
                    }}>
                        {user?.first_name?.[0] || 'U'}
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '0.825rem', lineHeight: 1.2, color: 'var(--text-pure)' }}>
                            {user?.first_name || 'Client'} {user?.last_name || ''}
                        </p>
                        <p style={{ fontSize: '0.7rem', color: isCustomer ? '#22d3ee' : '#a78bfa', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <ShieldCheck size={11} /> {isCustomer ? 'Verified Client' : 'Studio Owner'}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    style={{
                        width: 42,
                        height: 42,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: 'var(--radius-md)',
                        color: '#f87171',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                    }}
                    title="Logout"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </header>
    );
}

export default Navbar;
