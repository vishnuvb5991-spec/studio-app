import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, LogOut, Sparkles, ShieldCheck, Globe, Repeat, User, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
    const { user, isCustomer, isStudioOwner, viewMode, toggleViewMode, logout } = useAuth();

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
                width: 320,
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                {/* STUDIO OWNER DUAL-MODE TOGGLE SWITCH */}
                {isStudioOwner && (
                    <button
                        onClick={toggleViewMode}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.45rem 0.95rem',
                            borderRadius: 'var(--radius-full)',
                            background: viewMode === 'owner' 
                                ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.25))' 
                                : 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(16, 185, 129, 0.25))',
                            border: viewMode === 'owner' 
                                ? '1px solid rgba(139, 92, 246, 0.45)' 
                                : '1px solid rgba(6, 182, 212, 0.45)',
                            color: viewMode === 'owner' ? '#c084fc' : '#22d3ee',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all var(--transition-fast)'
                        }}
                        title="Click to toggle between Studio Owner view and Customer view"
                    >
                        {viewMode === 'owner' ? (
                            <>
                                <Crown size={14} color="#ec4899" />
                                <span>Owner Mode</span>
                                <Repeat size={13} style={{ opacity: 0.7 }} />
                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Switch to Customer</span>
                            </>
                        ) : (
                            <>
                                <User size={14} color="#22d3ee" />
                                <span>Customer View</span>
                                <Repeat size={13} style={{ opacity: 0.7 }} />
                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Back to Owner</span>
                            </>
                        )}
                    </button>
                )}

                {/* Switch to Public Website Link */}
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.45rem 0.85rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        transition: 'all var(--transition-fast)'
                    }}
                >
                    <Globe size={13} color="#06b6d4" />
                    <span>Public Site</span>
                </Link>

                {/* Notifications Button */}
                <button style={{
                    position: 'relative',
                    width: 40,
                    height: 40,
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
                    <Bell size={17} />
                    <span style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 7,
                        height: 7,
                        background: 'var(--accent-pink)',
                        borderRadius: '50%',
                        boxShadow: '0 0 8px var(--accent-pink)'
                    }} />
                </button>

                {/* Profile Pill */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.3rem 0.75rem 0.3rem 0.35rem',
                    background: 'linear-gradient(135deg, rgba(30, 35, 71, 0.6), rgba(15, 17, 35, 0.8))',
                    border: '1px solid var(--border-highlight)',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        background: 'var(--grad-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#ffffff',
                        boxShadow: '0 0 12px var(--primary-glow)'
                    }}>
                        {user?.first_name?.[0] || 'U'}
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.2, color: 'var(--text-pure)' }}>
                            {user?.first_name || 'Admin'} {user?.last_name || ''}
                        </p>
                        <p style={{ fontSize: '0.65rem', color: isStudioOwner ? '#ec4899' : '#22d3ee', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <ShieldCheck size={10} /> {isStudioOwner ? (viewMode === 'owner' ? 'Studio Owner' : 'Owner (Customer View)') : 'Verified Client'}
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    style={{
                        width: 40,
                        height: 40,
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
                    <LogOut size={17} />
                </button>
            </div>
        </header>
    );
}

export default Navbar;
