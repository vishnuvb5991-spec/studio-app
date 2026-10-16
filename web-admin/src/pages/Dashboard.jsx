import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Calendar,
    Image,
    CreditCard,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    Plus,
    Wand2,
    ArrowUpRight,
    Activity,
    Download,
    Eye,
    ShieldCheck,
    Smartphone,
    Share2,
    Crown,
    X,
    Send,
    IndianRupee,
    FileText,
    Phone,
    MapPin,
    ShieldAlert,
    UserCheck,
    Check,
    Lock,
    MessageSquare,
    MessageCircle,
    Bot,
    RefreshCw,
    Mail,
    PhoneCall,
    Copy
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { loadRazorpayCheckout, openRazorpayCheckout } from '../services/razorpay';
import { fetchAllAIInquiries } from '../services/aiChatStorage';

const chartData = [
    { name: 'Mon', revenue: 14500, bookings: 4 },
    { name: 'Tue', revenue: 18200, bookings: 6 },
    { name: 'Wed', revenue: 29000, bookings: 8 },
    { name: 'Thu', revenue: 22400, bookings: 5 },
    { name: 'Fri', revenue: 38900, bookings: 11 },
    { name: 'Sat', revenue: 64000, bookings: 18 },
    { name: 'Sun', revenue: 52000, bookings: 14 },
];

function Dashboard() {
    const {
        user, isStudioOwner, viewMode,
        getAccessRequests, approveCustomerAccess, rejectCustomerAccess, getNotifications
    } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessRequests, setAccessRequests] = useState([]);
    const [securityAlerts, setSecurityAlerts] = useState([]);
    const [aiInquiries, setAiInquiries] = useState([]);
    const [loadingInquiries, setLoadingInquiries] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [copiedSessionId, setCopiedSessionId] = useState(null);

    const isCustomerView = viewMode === 'customer';

    const loadAccessAndSecurity = () => {
        if (getAccessRequests) setAccessRequests(getAccessRequests());
        if (getNotifications) {
            const list = getNotifications();
            setSecurityAlerts(list.filter(n => n.type?.includes('security') || n.type?.includes('unapproved') || n.type?.includes('violation')));
        }
    };

    const loadAIInquiries = async () => {
        setLoadingInquiries(true);
        try {
            const list = await fetchAllAIInquiries();
            setAiInquiries(list);
        } catch (err) {
            console.error('Failed to load AI inquiries:', err);
        } finally {
            setLoadingInquiries(false);
        }
    };

    useEffect(() => {
        if (!isCustomerView) {
            fetchStats();
            loadAccessAndSecurity();
            loadAIInquiries();
        } else {
            setLoading(false);
        }

        const handleNotifUpdate = () => {
            loadAccessAndSecurity();
        };
        const handleInquiryUpdate = () => {
            loadAIInquiries();
        };

        window.addEventListener('studio_notification_update', handleNotifUpdate);
        window.addEventListener('studio_ai_inquiry_update', handleInquiryUpdate);
        return () => {
            window.removeEventListener('studio_notification_update', handleNotifUpdate);
            window.removeEventListener('studio_ai_inquiry_update', handleInquiryUpdate);
        };
    }, [isCustomerView]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/bookings/dashboard_stats/');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isCustomerView) {
        return <CustomerPortalView user={user} isOwnerPreview={isStudioOwner} />;
    }

    // Studio Owner Dashboard
    const statCards = [
        {
            title: 'Gross Revenue',
            value: `₹${(stats?.total_revenue || 238500).toLocaleString()}`,
            icon: CreditCard,
            gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
            glow: 'rgba(217, 119, 6, 0.25)',
            badge: '+28.4%',
            subtext: 'vs last week'
        },
        {
            title: 'Total Bookings',
            value: stats?.total_bookings || 42,
            icon: Calendar,
            gradient: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)',
            glow: 'rgba(24, 24, 27, 0.25)',
            badge: '+14%',
            subtext: '9 confirmed today'
        },
        {
            title: 'Albums Delivered',
            value: 86,
            icon: Image,
            gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            glow: 'rgba(5, 150, 105, 0.25)',
            badge: '4.9★',
            subtext: '12 pending review'
        },
        {
            title: 'Active Customers',
            value: 218,
            icon: Users,
            gradient: 'linear-gradient(135deg, #7d4f5b 0%, #5a343e 100%)',
            glow: 'rgba(125, 79, 91, 0.25)',
            badge: '+18 new',
            subtext: 'High retention'
        },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2rem', fontWeight: 600, color: '#18181b' }}>Studio Command Center</h1>
                        <Sparkles size={20} color="#d97706" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Real-time overview of photography shoots, client galleries & revenue.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a href="/bookings" className="btn btn-secondary" style={{ fontSize: '0.825rem', padding: '0.65rem 1.15rem' }}>
                        <Plus size={16} /> New Booking
                    </a>
                    <a href="/restorations" className="btn btn-primary" style={{ fontSize: '0.825rem', padding: '0.65rem 1.15rem' }}>
                        <Wand2 size={16} /> Restore Photo
                    </a>
                </div>
            </div>

            {/* Glowing Stat Cards Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
            }}>
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            top: -20,
                            right: -20,
                            width: 80,
                            height: 80,
                            background: stat.gradient,
                            borderRadius: '50%',
                            filter: 'blur(35px)',
                            opacity: 0.15
                        }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                background: stat.gradient,
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 8px 20px ${stat.glow}`,
                            }}>
                                <stat.icon size={24} color="#ffffff" />
                            </div>

                            <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2rem',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.6rem',
                                borderRadius: 'var(--radius-full)',
                                background: '#f4f4f5',
                                color: '#18181b',
                                border: '1px solid #e4e4e7'
                            }}>
                                <TrendingUp size={12} color="#059669" />
                                {stat.badge}
                            </span>
                        </div>

                        <div>
                            <p style={{
                                fontSize: '2.1rem',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                marginBottom: '0.2rem',
                                color: 'var(--text-pure)'
                            }}>
                                {stat.value}
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                                    {stat.title}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {stat.subtext}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🛡️ Customer Access Requests & Security Alerts */}
            {(() => {
                const pendingRequests = accessRequests.filter(r => r.status === 'pending');
                return (
                    <div style={{ marginBottom: '2rem' }}>
                        {pendingRequests.length > 0 && (
                            <div className="card" style={{
                                padding: '1.5rem',
                                marginBottom: '1.25rem',
                                border: '1px solid #fde68a',
                                background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
                                boxShadow: '0 8px 24px rgba(217, 119, 6, 0.08)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <div style={{ width: 36, height: 36, borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                                            <UserCheck size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#92400e', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                Pending Customer Access Requests
                                                <span style={{ background: '#d97706', color: '#fff', fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800 }}>
                                                    {pendingRequests.length} Waiting
                                                </span>
                                            </h3>
                                            <p style={{ fontSize: '0.78rem', color: '#78350f', margin: '0.2rem 0 0 0' }}>
                                                To protect client gallery privacy, customers cannot access the portal without your approval.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.85rem' }}>
                                    {pendingRequests.map((req) => (
                                        <div key={req.id} style={{
                                            padding: '1rem 1.15rem',
                                            background: '#ffffff',
                                            border: '1px solid #fde68a',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                                        }}>
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                                                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#18181b', margin: 0 }}>
                                                        {req.firstName} {req.lastName}
                                                    </h4>
                                                    <span style={{ fontSize: '0.7rem', color: '#d97706', background: '#fef3c7', padding: '0.1rem 0.45rem', borderRadius: '6px', fontWeight: 700 }}>
                                                        {req.eventType || 'Client'}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: '0.76rem', color: '#4b5563', margin: '0 0 0.25rem 0' }}>
                                                    ✉️ {req.email} &nbsp;|&nbsp; 📞 {req.phone}
                                                </p>
                                                {req.message && (
                                                    <p style={{ fontSize: '0.74rem', color: '#71717a', margin: '0.25rem 0 0.5rem 0', fontStyle: 'italic', background: '#fafaf9', padding: '0.35rem 0.6rem', borderRadius: '6px' }}>
                                                        "{req.message}"
                                                    </p>
                                                )}
                                                <p style={{ fontSize: '0.68rem', color: '#9ca3af', margin: '0.25rem 0 0.75rem 0' }}>
                                                    Requested on: {req.requestedAt}
                                                </p>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => {
                                                        approveCustomerAccess(req.id || req.email);
                                                        loadAccessAndSecurity();
                                                    }}
                                                    className="btn btn-primary"
                                                    style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.76rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', background: '#059669', color: '#ffffff', borderRadius: '8px' }}
                                                >
                                                    <Check size={13} /> Approve Access
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        rejectCustomerAccess(req.id || req.email);
                                                        loadAccessAndSecurity();
                                                    }}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.76rem', borderRadius: '8px' }}
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {securityAlerts.length > 0 && (
                            <div className="card" style={{
                                padding: '1rem 1.25rem',
                                border: '1px solid #fecdd3',
                                background: '#fff1f2',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '0.75rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#ffe4e6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                                        <ShieldAlert size={18} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#9f1239', margin: 0 }}>
                                            Security Watchdog: {securityAlerts[0]?.title || 'Access Attempt Logged'}
                                        </p>
                                        <p style={{ fontSize: '0.74rem', color: '#881337', margin: '0.15rem 0 0 0' }}>
                                            {securityAlerts[0]?.message} ({securityAlerts.length} total security events recorded)
                                        </p>
                                    </div>
                                </div>
                                <span style={{ fontSize: '0.72rem', color: '#9f1239', fontWeight: 600, background: '#ffe4e6', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                                    Protected • Sample logins deactivated
                                </span>
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* 🤖 AI Assistant Inquiries & Customer Leads */}
            {(() => {
                const totalInquiries = aiInquiries.length;
                const leadsWithContact = aiInquiries.filter(i => i.leadPhone || i.leadEmail);
                const formatTime = (iso) => {
                    if (!iso) return 'Recent';
                    try {
                        const d = new Date(iso);
                        return d.toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    } catch {
                        return iso;
                    }
                };

                const cleanPhone = (phone) => {
                    if (!phone) return '';
                    const digits = phone.replace(/\D/g, '');
                    return digits.length === 10 ? `91${digits}` : digits;
                };

                const handleCopyTranscript = (inquiry) => {
                    if (!inquiry?.messages) return;
                    const text = inquiry.messages.map(m => `[${m.role === 'user' ? 'Customer' : 'Studio AI'} - ${m.timestamp || ''}]\n${m.text}\n`).join('\n');
                    navigator.clipboard?.writeText(text);
                    setCopiedSessionId(inquiry.sessionId);
                    setTimeout(() => setCopiedSessionId(null), 2500);
                };

                return (
                    <div style={{ marginBottom: '2rem' }}>
                        <div className="card" style={{
                            padding: '1.5rem',
                            border: '1px solid #fde68a',
                            background: 'linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
                            boxShadow: '0 8px 24px rgba(217, 119, 6, 0.08)'
                        }}>
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#ffffff',
                                        boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                                    }}>
                                        <Bot size={22} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#18181b', margin: 0 }}>
                                                AI Inquiries & Customer Leads
                                            </h3>
                                            <span style={{ background: '#d97706', color: '#fff', fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800 }}>
                                                {totalInquiries} Logged
                                            </span>
                                            {leadsWithContact.length > 0 && (
                                                <span style={{ background: '#059669', color: '#fff', fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: '999px', fontWeight: 800 }}>
                                                    🔥 {leadsWithContact.length} Hot Leads
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: '#78350f', margin: '0.2rem 0 0 0' }}>
                                            Chats held between studio visitors & the AI Assistant (English & മലയാളം). Phone numbers and inquiries captured automatically.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={loadAIInquiries}
                                    disabled={loadingInquiries}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        padding: '0.45rem 0.85rem',
                                        background: '#ffffff',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '8px',
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        color: '#374151',
                                        cursor: loadingInquiries ? 'wait' : 'pointer',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                                    }}
                                >
                                    <RefreshCw size={13} style={{ animation: loadingInquiries ? 'spin 1s linear infinite' : 'none' }} />
                                    <span>{loadingInquiries ? 'Refreshing...' : 'Refresh Chats'}</span>
                                </button>
                            </div>

                            {/* Inquiries Content */}
                            {totalInquiries === 0 ? (
                                <div style={{
                                    padding: '2rem 1.5rem',
                                    textAlign: 'center',
                                    background: '#ffffff',
                                    borderRadius: '12px',
                                    border: '1px dashed #e5e7eb'
                                }}>
                                    <MessageSquare size={32} color="#d97706" style={{ margin: '0 auto 0.75rem auto', opacity: 0.8 }} />
                                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#18181b', margin: '0 0 0.35rem 0' }}>
                                        No Customer AI Chats Logged Yet
                                    </h4>
                                    <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 auto', maxWidth: '480px' }}>
                                        When visitors click the floating gold <strong>"Ask AI Assistant"</strong> widget at the bottom-right and ask about packages, rates, or dates, their conversation and phone number will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '0.85rem' }}>
                                    {aiInquiries.map((inq) => {
                                        const hasLead = Boolean(inq.leadPhone || inq.leadEmail);
                                        const waPhone = cleanPhone(inq.leadPhone);
                                        const waLink = waPhone
                                            ? `https://wa.me/${waPhone}?text=${encodeURIComponent('Hello! Thank you for inquiring with Balan Studios (Preetha Studio). How can we assist you with your booking?')}`
                                            : null;

                                        return (
                                            <div
                                                key={inq.sessionId}
                                                style={{
                                                    padding: '1.1rem',
                                                    background: '#ffffff',
                                                    border: hasLead ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    boxShadow: hasLead ? '0 4px 14px rgba(5, 150, 105, 0.08)' : '0 2px 8px rgba(0,0,0,0.02)'
                                                }}
                                            >
                                                <div>
                                                    {/* Top Badges */}
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                                                        <span style={{
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            padding: '0.15rem 0.5rem',
                                                            borderRadius: '6px',
                                                            background: inq.language === 'ml' ? '#fef3c7' : '#f4f4f5',
                                                            color: inq.language === 'ml' ? '#92400e' : '#3f3f46',
                                                            border: inq.language === 'ml' ? '1px solid #fde68a' : '1px solid #e4e4e7'
                                                        }}>
                                                            {inq.language === 'ml' ? '🌐 മലയാളം (Malayalam)' : '🌐 English'}
                                                        </span>
                                                        <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                                                            {formatTime(inq.updatedAt)}
                                                        </span>
                                                    </div>

                                                    {/* Lead Highlight Box if phone or email */}
                                                    {hasLead ? (
                                                        <div style={{
                                                            padding: '0.55rem 0.75rem',
                                                            background: '#f0fdf4',
                                                            border: '1px solid #bbf7d0',
                                                            borderRadius: '8px',
                                                            marginBottom: '0.65rem'
                                                        }}>
                                                            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
                                                                🎯 Customer Contact Detected
                                                            </div>
                                                            {inq.leadPhone && (
                                                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                                    <Phone size={13} /> {inq.leadPhone}
                                                                </div>
                                                            )}
                                                            {inq.leadEmail && (
                                                                <div style={{ fontSize: '0.75rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                                                                    <Mail size={12} /> {inq.leadEmail}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div style={{ fontSize: '0.72rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                                                            Visitor Inquiry (No phone provided yet)
                                                        </div>
                                                    )}

                                                    {/* Last Query Excerpt */}
                                                    <div style={{
                                                        padding: '0.55rem 0.75rem',
                                                        background: '#fafaf9',
                                                        border: '1px solid #f4f4f5',
                                                        borderRadius: '8px',
                                                        marginBottom: '0.75rem'
                                                    }}>
                                                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                                                            Last Question Asked:
                                                        </div>
                                                        <p style={{
                                                            fontSize: '0.78rem',
                                                            color: '#27272a',
                                                            margin: 0,
                                                            fontWeight: 500,
                                                            lineHeight: 1.35,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden'
                                                        }}>
                                                            "{inq.lastQuery || 'Started chat conversation'}"
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Bottom Actions */}
                                                <div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                                                        <span style={{ fontSize: '0.72rem', color: '#71717a' }}>
                                                            💬 {inq.messageCount || inq.messages?.length || 0} messages
                                                        </span>
                                                        <button
                                                            onClick={() => setSelectedInquiry(inq)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#d97706',
                                                                fontWeight: 700,
                                                                fontSize: '0.76rem',
                                                                cursor: 'pointer',
                                                                padding: '0.2rem 0.4rem',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.25rem'
                                                            }}
                                                        >
                                                            <span>Read Transcript</span>
                                                            <ArrowUpRight size={13} />
                                                        </button>
                                                    </div>

                                                    {/* Action Buttons: WhatsApp & Call */}
                                                    {inq.leadPhone && (
                                                        <div style={{ display: 'flex', gap: '0.45rem', paddingTop: '0.4rem', borderTop: '1px solid #f4f4f5' }}>
                                                            {waLink && (
                                                                <a
                                                                    href={waLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    style={{
                                                                        flex: 1,
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        gap: '0.35rem',
                                                                        padding: '0.45rem 0.6rem',
                                                                        background: '#22c55e',
                                                                        color: '#ffffff',
                                                                        borderRadius: '8px',
                                                                        fontSize: '0.74rem',
                                                                        fontWeight: 700,
                                                                        textDecoration: 'none'
                                                                    }}
                                                                >
                                                                    <MessageCircle size={13} /> WhatsApp
                                                                </a>
                                                            )}
                                                            <a
                                                                href={`tel:${inq.leadPhone}`}
                                                                style={{
                                                                    flex: 1,
                                                                    display: 'inline-flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    gap: '0.35rem',
                                                                    padding: '0.45rem 0.6rem',
                                                                    background: '#18181b',
                                                                    color: '#ffffff',
                                                                    borderRadius: '8px',
                                                                    fontSize: '0.74rem',
                                                                    fontWeight: 700,
                                                                    textDecoration: 'none'
                                                                }}
                                                            >
                                                                <PhoneCall size={13} /> Call
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── Full Chat Transcript Modal ── */}
                        {selectedInquiry && (
                            <div style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.65)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 10000,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '1.25rem'
                            }}>
                                <div style={{
                                    width: '100%',
                                    maxWidth: '650px',
                                    maxHeight: '88vh',
                                    background: '#ffffff',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                    overflow: 'hidden'
                                }}>
                                    {/* Modal Header */}
                                    <div style={{
                                        padding: '1.25rem 1.5rem',
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: '#fafaf9'
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#18181b', margin: 0 }}>
                                                    Customer AI Chat Transcript
                                                </h3>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    padding: '0.15rem 0.5rem',
                                                    borderRadius: '6px',
                                                    background: selectedInquiry.language === 'ml' ? '#fef3c7' : '#f4f4f5',
                                                    color: selectedInquiry.language === 'ml' ? '#92400e' : '#3f3f46'
                                                }}>
                                                    {selectedInquiry.language === 'ml' ? 'മലയാളം' : 'English'}
                                                </span>
                                            </div>
                                            <p style={{ fontSize: '0.76rem', color: '#71717a', margin: '0.2rem 0 0 0' }}>
                                                Session: {selectedInquiry.sessionId} • {formatTime(selectedInquiry.updatedAt)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedInquiry(null)}
                                            style={{
                                                background: '#f4f4f5',
                                                border: 'none',
                                                borderRadius: '50%',
                                                width: 32,
                                                height: 32,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                color: '#71717a'
                                            }}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* Modal Quick Actions Bar */}
                                    <div style={{
                                        padding: '0.75rem 1.5rem',
                                        background: selectedInquiry.leadPhone ? '#f0fdf4' : '#f9fafb',
                                        borderBottom: '1px solid #e5e7eb',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '0.5rem'
                                    }}>
                                        <div>
                                            {selectedInquiry.leadPhone ? (
                                                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803d' }}>
                                                    📞 Contact: {selectedInquiry.leadPhone} {selectedInquiry.leadEmail && `• ✉️ ${selectedInquiry.leadEmail}`}
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                                                    No direct contact captured in this chat session
                                                </span>
                                            )}
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {selectedInquiry.leadPhone && (
                                                <>
                                                    <a
                                                        href={`https://wa.me/${cleanPhone(selectedInquiry.leadPhone)}?text=${encodeURIComponent('Hello! Thank you for contacting Balan Studios. We received your query.')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            padding: '0.35rem 0.7rem',
                                                            background: '#22c55e',
                                                            color: '#fff',
                                                            borderRadius: '6px',
                                                            fontSize: '0.74rem',
                                                            fontWeight: 700,
                                                            textDecoration: 'none'
                                                        }}
                                                    >
                                                        <MessageCircle size={12} /> WhatsApp
                                                    </a>
                                                    <a
                                                        href={`tel:${selectedInquiry.leadPhone}`}
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.35rem',
                                                            padding: '0.35rem 0.7rem',
                                                            background: '#18181b',
                                                            color: '#fff',
                                                            borderRadius: '6px',
                                                            fontSize: '0.74rem',
                                                            fontWeight: 700,
                                                            textDecoration: 'none'
                                                        }}
                                                    >
                                                        <PhoneCall size={12} /> Call
                                                    </a>
                                                </>
                                            )}

                                            <button
                                                onClick={() => handleCopyTranscript(selectedInquiry)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    padding: '0.35rem 0.7rem',
                                                    background: '#ffffff',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '6px',
                                                    fontSize: '0.74rem',
                                                    fontWeight: 600,
                                                    color: '#374151',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Copy size={12} />
                                                <span>{copiedSessionId === selectedInquiry.sessionId ? 'Copied! ✓' : 'Copy'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Messages Feed */}
                                    <div style={{
                                        padding: '1.25rem 1.5rem',
                                        overflowY: 'auto',
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.85rem',
                                        background: '#fcfcfc'
                                    }}>
                                        {(!selectedInquiry.messages || selectedInquiry.messages.length === 0) ? (
                                            <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>No messages recorded.</p>
                                        ) : (
                                            selectedInquiry.messages.map((m, idx) => {
                                                const isUser = m.role === 'user';
                                                return (
                                                    <div
                                                        key={idx}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: isUser ? 'flex-end' : 'flex-start'
                                                        }}
                                                    >
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.4rem',
                                                            fontSize: '0.68rem',
                                                            color: '#a1a1aa',
                                                            marginBottom: '0.2rem',
                                                            paddingLeft: isUser ? 0 : '0.25rem',
                                                            paddingRight: isUser ? '0.25rem' : 0
                                                        }}>
                                                            <span>{isUser ? 'Customer' : 'Balan Studios AI'}</span>
                                                            {m.timestamp && <span>• {m.timestamp}</span>}
                                                        </div>
                                                        <div style={{
                                                            maxWidth: '85%',
                                                            padding: '0.75rem 1rem',
                                                            borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                                                            background: isUser ? '#18181b' : '#ffffff',
                                                            color: isUser ? '#ffffff' : '#18181b',
                                                            border: isUser ? 'none' : '1px solid #fde68a',
                                                            boxShadow: isUser ? '0 2px 8px rgba(0,0,0,0.1)' : '0 2px 8px rgba(217, 119, 6, 0.05)',
                                                            fontSize: '0.84rem',
                                                            lineHeight: 1.5,
                                                            whiteSpace: 'pre-wrap'
                                                        }}>
                                                            {m.text}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>

                                    {/* Modal Footer */}
                                    <div style={{
                                        padding: '0.85rem 1.5rem',
                                        borderTop: '1px solid #e5e7eb',
                                        background: '#fafaf9',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                                            Synced to Cloud Firestore & Studio Cache
                                        </span>
                                        <button
                                            onClick={() => setSelectedInquiry(null)}
                                            style={{
                                                padding: '0.45rem 1rem',
                                                background: '#18181b',
                                                color: '#ffffff',
                                                borderRadius: '8px',
                                                fontSize: '0.78rem',
                                                fontWeight: 600,
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* Visual Analytics & Pipeline */}
            <div className="dashboard-analytics-grid">
                <div className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Weekly Revenue Velocity
                                <Activity size={18} color="#d97706" />
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Peak income generated during weekend wedding shoots
                            </p>
                        </div>
                        <span className="badge badge-success">● Live Sync</span>
                    </div>

                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                            <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', color: '#18181b', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#d97706" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ marginBottom: '0.25rem' }}>Workflow Pipeline</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Order queue across stages
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <PipelineProgress label="Pending Confirmation" count={stats?.pending_bookings || 7} color="#d97706" percent="25%" />
                        <PipelineProgress label="Confirmed & In Production" count={stats?.confirmed_bookings || 19} color="#18181b" percent="60%" />
                        <PipelineProgress label="Completed & Delivered" count={stats?.completed_bookings || 16} color="#059669" percent="90%" />
                    </div>

                    <a href="/bookings" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#fafaf9', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, color: '#d97706', textDecoration: 'none' }}>
                        <span>Open Schedule Matrix</span>
                        <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>
        </div>
    );
}

// Dedicated Customer Portal View for clients logging in via web
function CustomerPortalView({ user, isOwnerPreview }) {
    const { toggleViewMode } = useAuth();

    // ── Booking Modal State ──────────────────────────────────────────────────
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingForm, setBookingForm] = useState({
        event_type: '',
        preferred_date: '',
        venue: '',
        phone: '',
        message: ''
    });
    const [bookingSubmitting, setBookingSubmitting] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // ── Invoice / Payment State ──────────────────────────────────────────────
    const [invoices, setInvoices] = useState([]);
    const [payingId, setPayingId] = useState(null);

    // Load invoices from localStorage for this specific customer — NO mock/demo fallbacks
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('studio_custom_bookings') || '[]');
        const userEmail = (user?.email || '').toLowerCase().trim();
        const userName = (user?.first_name || '').toLowerCase().trim();

        const myBookings = stored.filter(b => {
            const bEmail = (b.email || b.client_email || '').toLowerCase().trim();
            const bName = (b.client || b.customer || b.client_name || '').toLowerCase().trim();
            const belongsToUser = (userEmail && bEmail === userEmail) || (userName && bName.includes(userName));
            return belongsToUser && (b.status === 'pending' || b.status === 'confirmed') && Number(b.amount) > 0;
        });

        setInvoices(myBookings);
    }, [user]);

    const handleBookingChange = (e) => {
        setBookingForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setBookingSubmitting(true);
        try {
            await api.post('/bookings/', {
                ...bookingForm,
                client_name: user?.first_name || 'Customer',
                client_email: user?.email,
                status: 'pending'
            });
        } catch (_) {
            const stored = JSON.parse(localStorage.getItem('studio_custom_bookings') || '[]');
            stored.unshift({
                id: `booking-${Date.now()}`,
                event_name: bookingForm.event_type,
                client: user?.first_name || 'Customer',
                email: user?.email,
                phone: bookingForm.phone,
                date: bookingForm.preferred_date,
                venue: bookingForm.venue,
                status: 'pending',
                amount: 0,
                message: bookingForm.message,
                created_at: new Date().toISOString()
            });
            localStorage.setItem('studio_custom_bookings', JSON.stringify(stored));
        }

        // ── Save admin notification ──────────────────────────────────────────
        const notif = {
            client: user?.first_name || user?.email || 'A client',
            email: user?.email || '',
            event_type: bookingForm.event_type,
            preferred_date: bookingForm.preferred_date,
            venue: bookingForm.venue,
            phone: bookingForm.phone,
            message: bookingForm.message,
            received_at: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        };
        try {
            const existing = JSON.parse(localStorage.getItem('studio_admin_notifications') || '[]');
            existing.unshift(notif);
            localStorage.setItem('studio_admin_notifications', JSON.stringify(existing));
        } catch (_) {}

        // ── Browser push notification (if permission granted) ────────────────
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            new Notification('📸 New Booking Request!', {
                body: `${notif.client} wants to book ${notif.event_type} on ${notif.preferred_date}`,
                icon: '/favicon.ico'
            });
        } else if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission().then(perm => {
                if (perm === 'granted') {
                    new Notification('📸 New Booking Request!', {
                        body: `${notif.client} wants to book ${notif.event_type} on ${notif.preferred_date}`,
                        icon: '/favicon.ico'
                    });
                }
            });
        }

        setBookingSubmitting(false);
        setBookingSuccess(true);
        setTimeout(() => {
            setBookingSuccess(false);
            setShowBookingModal(false);
            setBookingForm({ event_type: '', preferred_date: '', venue: '', phone: '', message: '' });
        }, 2200);
    };


    const handlePayNow = async (invoice) => {
        setPayingId(invoice.id);
        try {
            await loadRazorpayCheckout();
            const outstanding = Number(invoice.amount) - Number(invoice.advance_paid || 0);
            let order;
            try {
                const resp = await api.post('/payments/create-order/', {
                    amount: outstanding,
                    booking_id: invoice.id,
                    description: invoice.event_name
                });
                order = resp.data;
            } catch (_) {
                order = { id: `order_demo_${Date.now()}`, amount: outstanding * 100, currency: 'INR' };
            }
            openRazorpayCheckout(order, async (response) => {
                try {
                    await api.post('/payments/verify/', {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        booking_id: invoice.id
                    });
                } catch (_) { /* silent */ }
                setInvoices(prev => prev.map(inv =>
                    inv.id === invoice.id ? { ...inv, advance_paid: inv.amount, _paid: true } : inv
                ));
                alert(`✅ Payment of ₹${outstanding.toLocaleString()} received! Thank you.`);
            }, user);
        } catch (err) {
            alert('Payment could not be processed. Please try again or contact the studio.');
        } finally {
            setPayingId(null);
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Studio Owner Preview Alert Banner */}
            {isOwnerPreview && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.25rem',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Crown size={18} color="#d97706" />
                        <div>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#92400e' }}>Studio Owner Customer Preview: </span>
                            <span style={{ fontSize: '0.8rem', color: '#78350f' }}>You are currently viewing the platform as your clients experience it.</span>
                        </div>
                    </div>
                    <button
                        onClick={toggleViewMode}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 700, background: '#ffffff', borderColor: '#fde68a', color: '#92400e' }}
                    >
                        Back to Command Center →
                    </button>
                </div>
            )}

            {/* Customer Welcome Hero */}
            <div className="card" style={{
                padding: '2.5rem',
                marginBottom: '2rem',
                background: '#18181b',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: -50, right: -50,
                    width: 200, height: 200,
                    background: 'linear-gradient(135deg, #d97706, #b45309)',
                    borderRadius: '50%',
                    filter: 'blur(80px)', opacity: 0.25
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                            <Sparkles size={13} /> CLIENT PORTAL &amp; GALLERY ACCESS
                        </div>
                        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '2.2rem', marginBottom: '0.5rem', color: '#ffffff' }}>
                            Welcome, <span style={{ color: '#fde68a' }}>{user?.first_name || 'Valued Client'}</span>!
                        </h1>
                        <p style={{ color: '#a1a1aa', fontSize: '0.95rem', maxWidth: 600 }}>
                            Browse your Ultra-HD event galleries, download high-res photos, track wedding dates, or request AI restorations right here.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary"
                            style={{ padding: '0.85rem 1.4rem', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', color: '#ffffff' }}
                            onClick={() => setShowBookingModal(true)}
                        >
                            <Plus size={17} /> Book a New Shoot
                        </button>
                        <a href="/albums" className="btn btn-secondary" style={{ padding: '0.85rem 1.4rem', background: 'rgba(255,255,255,0.08)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
                            <Image size={17} /> View My Photos
                        </a>
                    </div>
                </div>
            </div>

            {/* ── My Payments & Invoices ───────────────────────────────────── */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#18181b' }}>
                            <IndianRupee size={20} color="#d97706" /> My Payments &amp; Invoices
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            Pay outstanding shoot balances securely via Razorpay
                        </p>
                    </div>
                    <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>🔒 Secured by Razorpay</span>
                </div>

                {invoices.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '2.5rem 1.5rem',
                        background: '#fafaf9',
                        borderRadius: 'var(--radius-md)',
                        border: '1px dashed #e5e7eb'
                    }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: '50%',
                            background: '#ecfdf5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 0.75rem auto'
                        }}>
                            <CheckCircle2 size={22} color="#059669" />
                        </div>
                        <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#18181b', marginBottom: '0.2rem' }}>
                            No Pending Invoices
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 420, margin: '0 auto' }}>
                            You have no outstanding payments. Once you schedule a shoot or an invoice is generated, it will appear here.
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                        {invoices.map((inv) => {
                            const outstanding = Number(inv.amount) - Number(inv.advance_paid || 0);
                            const isPaid = inv._paid || outstanding <= 0;
                            return (
                                <div key={inv.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    flexWrap: 'wrap', gap: '0.75rem',
                                    padding: '1rem 1.25rem',
                                    background: isPaid ? '#ecfdf5' : '#fafaf9',
                                    border: `1px solid ${isPaid ? '#a7f3d0' : '#e5e7eb'}`,
                                    borderRadius: 'var(--radius-md)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 'var(--radius-md)',
                                            background: isPaid ? '#d1fae5' : '#fef3c7',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {isPaid ? <CheckCircle2 size={20} color="#059669" /> : <FileText size={20} color="#d97706" />}
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#18181b', marginBottom: '0.15rem' }}>
                                                {inv.event_name}
                                            </p>
                                            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                                                📅 {inv.date} &nbsp;|&nbsp; 📍 {inv.venue}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.75rem', color: '#71717a' }}>
                                                Total: ₹{Number(inv.amount).toLocaleString()}
                                            </p>
                                            <p style={{ fontWeight: 800, fontSize: '1rem', color: isPaid ? '#059669' : '#d97706' }}>
                                                {isPaid ? '✓ Paid' : `Due: ₹${outstanding.toLocaleString()}`}
                                            </p>
                                        </div>
                                        {!isPaid && (
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.55rem 1.1rem', fontSize: '0.825rem', fontWeight: 700, background: '#18181b', color: '#ffffff' }}
                                                disabled={payingId === inv.id}
                                                onClick={() => handlePayNow(inv)}
                                            >
                                                {payingId === inv.id ? '⏳ Opening…' : '💳 Pay Now'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Action Tiles */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <div
                    className="card card-interactive"
                    style={{ cursor: 'pointer', display: 'flex', gap: '1.25rem', alignItems: 'center' }}
                    onClick={() => setShowBookingModal(true)}
                >
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(5,150,105,0.2)' }}>
                        <Plus size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: '#18181b' }}>Book a New Shoot</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Request wedding, birthday, or portrait session</p>
                    </div>
                </div>

                <a href="/albums" className="card card-interactive" style={{ textDecoration: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #18181b 0%, #3f3f46 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(24,24,27,0.2)' }}>
                        <Image size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: '#18181b' }}>Photo Albums</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View, favorite &amp; download original quality</p>
                    </div>
                </a>

                <a href="/bookings" className="card card-interactive" style={{ textDecoration: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(2,132,199,0.2)' }}>
                        <Calendar size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: '#18181b' }}>My Bookings</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Check shoot schedule &amp; venue details</p>
                    </div>
                </a>

                <a href="/restorations" className="card card-interactive" style={{ textDecoration: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(217,119,6,0.2)' }}>
                        <Wand2 size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: '0.2rem', color: '#18181b' }}>Restore Old Photos</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upload torn/black &amp; white photos for AI repair</p>
                    </div>
                </a>
            </div>

            {/* Mobile App Synergy Card */}
            <div className="card" style={{
                padding: '2rem',
                background: '#fafaf9',
                border: '1px solid #e5e7eb',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Smartphone size={28} color="#d97706" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem', color: '#18181b' }}>Prefer using your Phone?</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Install the Balan Studios mobile app on Android or iOS. Log in with your same email (<strong>{user?.email}</strong>) to sync your photos instantly!
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={() => alert('Download link sent to registered email & phone!')} style={{ background: '#ffffff', borderColor: '#e5e7eb', color: '#18181b' }}>
                        <Download size={16} /> Get Mobile App Link
                    </button>
                </div>
            </div>

            {/* ── Book a New Shoot Modal ───────────────────────────────────── */}
            {showBookingModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="card" style={{
                        width: '100%', maxWidth: 520, padding: '2rem',
                        position: 'relative', background: '#ffffff', border: '1px solid #e5e7eb',
                        boxShadow: '0 20px 45px rgba(0,0,0,0.15)',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <button
                            onClick={() => { setShowBookingModal(false); setBookingSuccess(false); }}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f4f4f5', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#71717a' }}
                        >
                            <X size={18} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar size={20} color="#fff" />
                            </div>
                            <h3 style={{ color: '#18181b', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.4rem' }}>Book a New Shoot</h3>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Fill in the details and the studio will confirm your booking shortly.
                        </p>

                        {bookingSuccess ? (
                            <div style={{
                                textAlign: 'center', padding: '2rem',
                                background: '#ecfdf5', borderRadius: 'var(--radius-md)',
                                border: '1px solid #a7f3d0'
                            }}>
                                <CheckCircle2 size={48} color="#059669" style={{ marginBottom: '0.75rem' }} />
                                <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>Booking Request Sent!</h3>
                                <p style={{ fontSize: '0.85rem', color: '#065f46' }}>
                                    The studio will review your request and call/WhatsApp you to confirm within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#52525b' }}>
                                        Event Type *
                                    </label>
                                    <select
                                        name="event_type"
                                        value={bookingForm.event_type}
                                        onChange={handleBookingChange}
                                        required
                                        style={{
                                            width: '100%', padding: '0.65rem 0.9rem',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 'var(--radius-md)',
                                            color: '#18181b', fontSize: '0.875rem'
                                        }}
                                    >
                                        <option value="" disabled>Select event type...</option>
                                        <option value="Wedding Photography">💒 Wedding Photography</option>
                                        <option value="Pre-Wedding Shoot">💑 Pre-Wedding Shoot</option>
                                        <option value="Birthday Portraits">🎂 Birthday Portraits</option>
                                        <option value="Maternity Shoot">🤰 Maternity Shoot</option>
                                        <option value="Baby/Newborn Photography">👶 Baby / Newborn Photography</option>
                                        <option value="Corporate Event">🏢 Corporate Event</option>
                                        <option value="Product Photography">📦 Product Photography</option>
                                        <option value="Other">✨ Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#52525b' }}>
                                        Preferred Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="preferred_date"
                                        value={bookingForm.preferred_date}
                                        onChange={handleBookingChange}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        style={{
                                            width: '100%', padding: '0.65rem 0.9rem',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 'var(--radius-md)',
                                            color: '#18181b', fontSize: '0.875rem',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#52525b' }}>
                                        Venue / Location
                                    </label>
                                    <input
                                        type="text"
                                        name="venue"
                                        value={bookingForm.venue}
                                        onChange={handleBookingChange}
                                        placeholder="e.g. Taj Palace, Hyderabad"
                                        style={{
                                            width: '100%', padding: '0.65rem 0.9rem',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 'var(--radius-md)',
                                            color: '#18181b', fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#52525b' }}>
                                        WhatsApp / Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={bookingForm.phone}
                                        onChange={handleBookingChange}
                                        required
                                        placeholder="+91 98765 43210"
                                        style={{
                                            width: '100%', padding: '0.65rem 0.9rem',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 'var(--radius-md)',
                                            color: '#18181b', fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: '#52525b' }}>
                                        Message / Special Requirements
                                    </label>
                                    <textarea
                                        name="message"
                                        value={bookingForm.message}
                                        onChange={handleBookingChange}
                                        rows={3}
                                        placeholder="e.g. Outdoor morning shoot preferred, need 2 photographers..."
                                        style={{
                                            width: '100%', padding: '0.65rem 0.9rem',
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: 'var(--radius-md)',
                                            color: '#18181b', fontSize: '0.875rem',
                                            resize: 'vertical', fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={bookingSubmitting}
                                    style={{ padding: '0.85rem', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.5rem', background: '#18181b', color: '#ffffff' }}
                                >
                                    {bookingSubmitting ? '⏳ Sending Request…' : <><Send size={16} /> Send Booking Request</>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function PipelineProgress({ label, count, color, percent }) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color }}>{count}</span>
            </div>
            <div style={{
                height: 8,
                background: '#e4e4e7',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: percent,
                    height: '100%',
                    background: color,
                    borderRadius: 'var(--radius-full)',
                    boxShadow: `0 0 12px ${color}`
                }} />
            </div>
        </div>
    );
}

export default Dashboard;
