import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Bell, Search, LogOut, ShieldCheck, Globe, Repeat, User, Crown, Menu,
    ShieldAlert, UserCheck, Check, X, Calendar, AlertTriangle, Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar({ onMenuClick }) {
    const {
        user, isStudioOwner, viewMode, toggleViewMode, logout,
        getNotifications, clearNotification, clearAllNotifications,
        markAllNotificationsRead, approveCustomerAccess, rejectCustomerAccess
    } = useAuth();

    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const notifRef = useRef(null);

    // Load notifications & subscribe to live updates
    useEffect(() => {
        const load = () => {
            if (getNotifications) {
                setNotifications(getNotifications());
            }
        };
        load();

        const handleUpdate = () => load();
        window.addEventListener('studio_notification_update', handleUpdate);
        return () => window.removeEventListener('studio_notification_update', handleUpdate);
    }, [getNotifications]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleBellClick = () => {
        const nextState = !isNotifOpen;
        setIsNotifOpen(nextState);
        if (nextState && unreadCount > 0 && markAllNotificationsRead) {
            markAllNotificationsRead();
        }
    };

    const handleApprove = (notif) => {
        if (approveCustomerAccess) {
            approveCustomerAccess(notif.requestId || notif.email);
            setNotifications(getNotifications());
        }
    };

    const handleDecline = (notif) => {
        if (rejectCustomerAccess) {
            rejectCustomerAccess(notif.requestId || notif.email);
            setNotifications(getNotifications());
        }
    };

    const handleClearOne = (e, notifId) => {
        e.stopPropagation();
        if (clearNotification) {
            clearNotification(notifId);
            setNotifications(getNotifications());
        }
    };

    const handleClearAll = () => {
        if (clearAllNotifications) {
            clearAllNotifications();
            setNotifications([]);
        }
    };

    return (
        <header style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0 0 1.5rem 0',
            borderBottom: '1px solid #e5e7eb',
            marginBottom: '2rem',
            position: 'relative'
        }}>
            {/* Hamburger — only visible on mobile (CSS shows it) */}
            <button
                className="hamburger-btn"
                onClick={onMenuClick}
                aria-label="Open navigation menu"
            >
                <Menu size={20} />
            </button>

            {/* Search bar — hidden on small screens */}
            <div style={{
                position: 'relative',
                width: 320,
                flex: '1 1 auto',
                maxWidth: 320,
                minWidth: 0,
            }} className="navbar-search">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>

                {/* Owner dual-mode toggle — hidden on very small screens */}
                {isStudioOwner && (
                    <button
                        onClick={toggleViewMode}
                        className="navbar-mode-toggle"
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
                            transition: 'all var(--transition-fast)',
                            whiteSpace: 'nowrap',
                        }}
                        title="Toggle between Studio Owner view and Customer view"
                    >
                        {viewMode === 'owner' ? (
                            <>
                                <Crown size={14} color="#d97706" />
                                <span className="hide-sm">Owner Mode</span>
                                <Repeat size={13} style={{ opacity: 0.6 }} />
                                <span className="hide-sm" style={{ color: '#71717a', fontWeight: 600 }}>Switch to Customer</span>
                            </>
                        ) : (
                            <>
                                <User size={14} color="#18181b" />
                                <span className="hide-sm">Customer View</span>
                                <Repeat size={13} style={{ opacity: 0.6 }} />
                                <span className="hide-sm" style={{ color: '#71717a', fontWeight: 600 }}>Back to Owner</span>
                            </>
                        )}
                    </button>
                )}

                {/* Public Site link — hidden on mobile */}
                <Link
                    to="/"
                    className="hide-md"
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
                        transition: 'all var(--transition-fast)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Globe size={13} color="#d97706" />
                    <span>Public Site</span>
                </Link>

                {/* 🔔 Interactive Notifications Bell */}
                <div style={{ position: 'relative' }} ref={notifRef}>
                    <button
                        onClick={handleBellClick}
                        style={{
                            position: 'relative',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: isNotifOpen ? '#f4f4f5' : '#ffffff',
                            border: isNotifOpen ? '1px solid #d4d4d8' : '1px solid #e5e7eb',
                            borderRadius: 'var(--radius-md)',
                            color: '#52525b',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)',
                            transition: 'all var(--transition-fast)',
                            flexShrink: 0,
                        }}
                        title="Security Alerts & Notifications"
                        aria-label="Notifications"
                    >
                        <Bell size={17} />
                        {unreadCount > 0 ? (
                            <span style={{
                                position: 'absolute',
                                top: -4,
                                right: -4,
                                background: '#dc2626',
                                color: '#ffffff',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                minWidth: 18,
                                height: 18,
                                padding: '0 4px',
                                borderRadius: '999px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 5px rgba(220, 38, 38, 0.4)',
                                border: '2px solid #ffffff'
                            }}>
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        ) : notifications.length > 0 ? (
                            <span style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                width: 7,
                                height: 7,
                                background: '#d97706',
                                borderRadius: '50%',
                            }} />
                        ) : null}
                    </button>

                    {/* Notifications Dropdown Drawer */}
                    {isNotifOpen && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 10px)',
                            right: 0,
                            width: 380,
                            maxWidth: '92vw',
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #e4e4e7',
                            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.14), 0 0 20px rgba(0, 0, 0, 0.04)',
                            zIndex: 1000,
                            overflow: 'hidden'
                        }}>
                            {/* Drawer Header */}
                            <div style={{
                                padding: '1rem 1.15rem',
                                background: '#fafaf9',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#18181b', margin: 0 }}>
                                        Security & Access Alerts
                                    </h4>
                                    {unreadCount > 0 && (
                                        <span style={{
                                            background: '#fee2e2',
                                            color: '#991b1b',
                                            padding: '0.1rem 0.45rem',
                                            borderRadius: '999px',
                                            fontSize: '0.68rem',
                                            fontWeight: 800
                                        }}>
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={handleClearAll}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#71717a',
                                            fontSize: '0.72rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}
                                    >
                                        <Trash2 size={12} /> Clear all
                                    </button>
                                )}
                            </div>

                            {/* Notifications Scroll List */}
                            <div style={{ maxHeight: 380, overflowY: 'auto', padding: '0.5rem' }}>
                                {notifications.length === 0 ? (
                                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#71717a' }}>
                                        <ShieldCheck size={32} color="#059669" style={{ margin: '0 auto 0.6rem auto', opacity: 0.8 }} />
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#18181b', marginBottom: '0.2rem' }}>All Clear & Protected</p>
                                        <p style={{ fontSize: '0.75rem', margin: 0 }}>No unauthorized access attempts or pending requests.</p>
                                    </div>
                                ) : (
                                    notifications.map((notif, idx) => {
                                        const isAccessRequest = notif.type === 'access_request';
                                        const isSecurityAlert = notif.type?.includes('security') || notif.type?.includes('unapproved');
                                        const isPending = notif.status === 'pending_approval' || notif.status === 'pending';

                                        return (
                                            <div
                                                key={notif.id || idx}
                                                style={{
                                                    padding: '0.85rem',
                                                    borderRadius: '10px',
                                                    marginBottom: '0.4rem',
                                                    background: isSecurityAlert ? '#fff1f2' : (isAccessRequest ? '#fffbeb' : '#fafaf9'),
                                                    border: isSecurityAlert ? '1px solid #fecdd3' : (isAccessRequest ? '1px solid #fef3c7' : '1px solid #f4f4f5'),
                                                    position: 'relative'
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                                                    <div style={{
                                                        width: 28, height: 28,
                                                        borderRadius: '8px',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        flexShrink: 0,
                                                        background: isSecurityAlert ? '#ffe4e6' : (isAccessRequest ? '#fef3c7' : '#e4e4e7'),
                                                        color: isSecurityAlert ? '#e11d48' : (isAccessRequest ? '#d97706' : '#52525b')
                                                    }}>
                                                        {isSecurityAlert ? <ShieldAlert size={16} /> : (isAccessRequest ? <UserCheck size={16} /> : <Bell size={15} />)}
                                                    </div>

                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                                            <p style={{
                                                                fontSize: '0.78rem',
                                                                fontWeight: 700,
                                                                color: isSecurityAlert ? '#9f1239' : (isAccessRequest ? '#92400e' : '#18181b'),
                                                                margin: 0
                                                            }}>
                                                                {notif.title || (isAccessRequest ? 'Customer Access Request' : 'Portal Alert')}
                                                            </p>
                                                            <button
                                                                onClick={(e) => handleClearOne(e, notif.id)}
                                                                style={{
                                                                    background: 'none', border: 'none',
                                                                    color: '#a1a1aa', cursor: 'pointer',
                                                                    padding: '2px', display: 'flex'
                                                                }}
                                                                title="Dismiss"
                                                            >
                                                                <X size={13} />
                                                            </button>
                                                        </div>

                                                        <p style={{ fontSize: '0.74rem', color: '#4b5563', lineHeight: 1.4, margin: '0 0 0.35rem 0' }}>
                                                            {notif.message}
                                                        </p>

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                                                            <span style={{ fontSize: '0.68rem', color: '#9ca3af' }}>
                                                                {notif.received_at || 'Just now'}
                                                            </span>

                                                            {/* Approval Buttons for Customer Access Requests */}
                                                            {isAccessRequest && isPending && (
                                                                <div style={{ display: 'flex', gap: '0.35rem' }}>
                                                                    <button
                                                                        onClick={() => handleApprove(notif)}
                                                                        style={{
                                                                            background: '#059669',
                                                                            color: '#ffffff',
                                                                            border: 'none',
                                                                            padding: '0.25rem 0.6rem',
                                                                            borderRadius: '6px',
                                                                            fontSize: '0.7rem',
                                                                            fontWeight: 700,
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.25rem',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        <Check size={11} /> Approve Access
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDecline(notif)}
                                                                        style={{
                                                                            background: '#f4f4f5',
                                                                            color: '#71717a',
                                                                            border: '1px solid #e4e4e7',
                                                                            padding: '0.25rem 0.5rem',
                                                                            borderRadius: '6px',
                                                                            fontSize: '0.7rem',
                                                                            fontWeight: 600,
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    >
                                                                        Decline
                                                                    </button>
                                                                </div>
                                                            )}
                                                            {notif.status === 'approved' && (
                                                                <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700 }}>
                                                                    ✓ Access Approved
                                                                </span>
                                                            )}
                                                            {notif.status === 'declined' && (
                                                                <span style={{ fontSize: '0.68rem', color: '#dc2626', fontWeight: 700 }}>
                                                                    ✕ Access Declined
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile pill */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.3rem 0.75rem 0.3rem 0.35rem',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: 'var(--shadow-sm)',
                    flexShrink: 0,
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
                        color: '#fde68a',
                        flexShrink: 0,
                    }}>
                        {user?.first_name?.[0] || 'V'}
                    </div>
                    <div className="hide-sm">
                        <p style={{ fontWeight: 700, fontSize: '0.8rem', lineHeight: 1.2, color: '#18181b' }}>
                            {user?.first_name || 'Vishnu'} {user?.last_name || 'V B'}
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
                        transition: 'all var(--transition-fast)',
                        flexShrink: 0,
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
