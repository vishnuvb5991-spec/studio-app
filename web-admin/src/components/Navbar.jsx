import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, LogOut, ShieldCheck, Globe, Repeat, User, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
    const { user, isStudioOwner, viewMode, toggleViewMode, logout } = useAuth();

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0 1.5rem 0',
            borderBottom: '1px solid #e5e7eb',
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
                        color: '#71717a'
                    }}
                />
                <input
                    type="text"
                    placeholder="Search bookings, albums, photos..."
                    style={{
                        paddingLeft: 42,
                        paddingRight: 60,
                        height: 42,
                        fontSize: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: '#ffffff',
                        borderColor: '#e5e7eb',
                        color: '#18181b',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
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
                    background: '#f4f4f5',
                    color: '#71717a'
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
                                ? '#fef3c7' 
                                : '#f4f4f5',
                            border: viewMode === 'owner' 
                                ? '1px solid #fde68a' 
                                : '1px solid #e4e4e7',
                            color: viewMode === 'owner' ? '#92400e' : '#18181b',
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
                                <Crown size={14} color="#d97706" />
                                <span>Owner Mode</span>
                                <Repeat size={13} style={{ opacity: 0.6 }} />
                                <span style={{ color: '#71717a', fontWeight: 600 }}>Switch to Customer</span>
                            </>
                        ) : (
                            <>
                                <User size={14} color="#18181b" />
                                <span>Customer View</span>
                                <Repeat size={13} style={{ opacity: 0.6 }} />
                                <span style={{ color: '#71717a', fontWeight: 600 }}>Back to Owner</span>
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
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#18181b',
                        textDecoration: 'none',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all var(--transition-fast)'
                    }}
                >
                    <Globe size={13} color="#d97706" />
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
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--radius-md)',
                    color: '#52525b',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)'
                }}>
                    <Bell size={17} />
                    <span style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 7,
                        height: 7,
                        background: '#d97706',
                        borderRadius: '50%',
                    }} />
                </button>

                {/* Profile Pill */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.3rem 0.75rem 0.3rem 0.35rem',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        width: 32,
                        height: 32,
                        background: '#18181b',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#fde68a'
                    }}>
                        {user?.first_name?.[0] || 'U'}
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.2, color: '#18181b' }}>
                            {user?.first_name || 'Admin'} {user?.last_name || ''}
                        </p>
                        <p style={{ fontSize: '0.65rem', color: isStudioOwner ? '#d97706' : '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
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
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 'var(--radius-md)',
                        color: '#991b1b',
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
