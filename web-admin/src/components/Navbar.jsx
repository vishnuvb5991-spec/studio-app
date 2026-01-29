import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, LogOut } from 'lucide-react';

function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 0 1.5rem 0',
            borderBottom: '1px solid var(--glass-border)',
        }}>
            {/* Search */}
            <div style={{
                position: 'relative',
                width: 300,
            }}>
                <Search
                    size={18}
                    style={{
                        position: 'absolute',
                        left: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }}
                />
                <input
                    type="text"
                    placeholder="Search..."
                    style={{
                        paddingLeft: 40,
                        background: 'var(--bg-card)',
                    }}
                />
            </div>

            {/* Right side */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Notifications */}
                <button style={{
                    position: 'relative',
                    padding: '0.625rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 8,
                        height: 8,
                        background: 'var(--error)',
                        borderRadius: '50%',
                    }} />
                </button>

                {/* User */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 1rem 0.5rem 0.5rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-md)',
                }}>
                    <div style={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, var(--primary), #a855f7)',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                    }}>
                        {user?.first_name?.[0] || 'U'}
                    </div>
                    <div>
                        <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            {user?.first_name} {user?.last_name}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Studio Owner
                        </p>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    style={{
                        padding: '0.625rem',
                        background: 'transparent',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-md)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                    }}
                    title="Logout"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
}

export default Navbar;
