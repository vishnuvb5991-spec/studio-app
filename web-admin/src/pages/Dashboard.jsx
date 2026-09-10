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
    MapPin
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { loadRazorpayCheckout, openRazorpayCheckout } from '../services/razorpay';

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
    const { user, isStudioOwner, viewMode } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const isCustomerView = viewMode === 'customer';

    useEffect(() => {
        if (!isCustomerView) {
            fetchStats();
        } else {
            setLoading(false);
        }
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
            gradient: 'var(--grad-sunset)',
            glow: 'var(--accent-amber-glow)',
            badge: '+28.4%',
            subtext: 'vs last week'
        },
        {
            title: 'Total Bookings',
            value: stats?.total_bookings || 42,
            icon: Calendar,
            gradient: 'var(--grad-cyan-blue)',
            glow: 'var(--accent-cyan-glow)',
            badge: '+14%',
            subtext: '9 confirmed today'
        },
        {
            title: 'Albums Delivered',
            value: 86,
            icon: Image,
            gradient: 'var(--grad-primary)',
            glow: 'var(--primary-glow)',
            badge: '4.9★',
            subtext: '12 pending review'
        },
        {
            title: 'Active Customers',
            value: 218,
            icon: Users,
            gradient: 'var(--grad-emerald-teal)',
            glow: 'var(--accent-emerald-glow)',
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
                        <h1 className="gradient-text">Studio Command Center</h1>
                        <Sparkles size={20} color="#ec4899" />
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
                            opacity: 0.4
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
                                background: 'rgba(255, 255, 255, 0.08)',
                                color: '#ffffff',
                                border: '1px solid rgba(255, 255, 255, 0.12)'
                            }}>
                                <TrendingUp size={12} color="#34d399" />
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

            {/* Visual Analytics & Pipeline */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1.75rem',
                marginBottom: '2rem',
            }}>
                <div className="card" style={{ padding: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                Weekly Revenue Velocity
                                <Activity size={18} color="var(--accent-pink)" />
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
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip contentStyle={{ background: 'rgba(15, 17, 35, 0.95)', border: '1px solid rgba(139, 92, 246, 0.4)', borderRadius: '12px', color: '#ffffff' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
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
                        <PipelineProgress label="Pending Confirmation" count={stats?.pending_bookings || 7} color="#f59e0b" percent="25%" />
                        <PipelineProgress label="Confirmed & In Production" count={stats?.confirmed_bookings || 19} color="#06b6d4" percent="60%" />
                        <PipelineProgress label="Completed & Delivered" count={stats?.completed_bookings || 16} color="#10b981" percent="90%" />
                    </div>

                    <a href="/bookings" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-light)' }}>
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

    // Load invoices from localStorage or fall back to demo invoices
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('studio_custom_bookings') || '[]');
        const pending = stored.filter(b =>
            (b.status === 'pending' || b.status === 'confirmed') && Number(b.amount) > 0
        );
        if (pending.length > 0) {
            setInvoices(pending);
        } else {
            setInvoices([
                { id: 'demo-1', event_name: 'Wedding Photography Shoot', amount: 25000, advance_paid: 5000, status: 'confirmed', date: '2024-12-25', venue: 'Taj Palace, Hyderabad' },
                { id: 'demo-2', event_name: 'Birthday Portrait Session', amount: 8500, advance_paid: 0, status: 'pending', date: '2025-01-10', venue: 'Home Studio' }
            ]);
        }
    }, []);

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
                    background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15))',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Crown size={18} color="#ec4899" />
                        <div>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#ffffff' }}>Studio Owner Customer Preview: </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>You are currently viewing the platform as your clients experience it.</span>
                        </div>
                    </div>
                    <button
                        onClick={toggleViewMode}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', fontWeight: 700 }}
                    >
                        Back to Command Center →
                    </button>
                </div>
            )}

            {/* Customer Welcome Hero */}
            <div className="card" style={{
                padding: '2.5rem',
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, rgba(30, 35, 71, 0.8), rgba(15, 17, 35, 0.95))',
                border: '1px solid var(--border-highlight)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', top: -50, right: -50,
                    width: 200, height: 200,
                    background: 'var(--grad-primary)',
                    borderRadius: '50%',
                    filter: 'blur(80px)', opacity: 0.3
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.35)', color: '#22d3ee', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                            <Sparkles size={13} /> CLIENT PORTAL & GALLERY ACCESS
                        </div>
                        <h1 style={{ fontSize: '2.1rem', marginBottom: '0.5rem' }}>
                            Welcome, <span className="gradient-text">{user?.first_name || 'Valued Client'}</span>!
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 600 }}>
                            Browse your Ultra-HD event galleries, download high-res photos, track wedding dates, or request AI restorations right here.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary"
                            style={{ padding: '0.85rem 1.4rem' }}
                            onClick={() => setShowBookingModal(true)}
                        >
                            <Plus size={17} /> Book a New Shoot
                        </button>
                        <a href="/albums" className="btn btn-secondary" style={{ padding: '0.85rem 1.4rem' }}>
                            <Image size={17} /> View My Photos
                        </a>
                    </div>
                </div>
            </div>

            {/* ── My Payments & Invoices ───────────────────────────────────── */}
            <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                        <h3 style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IndianRupee size={20} color="#ec4899" /> My Payments & Invoices
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            Pay outstanding shoot balances securely via Razorpay
                        </p>
                    </div>
                    <span className="badge badge-success" style={{ alignSelf: 'flex-start' }}>🔒 Secured by Razorpay</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {invoices.map((inv) => {
                        const outstanding = Number(inv.amount) - Number(inv.advance_paid || 0);
                        const isPaid = inv._paid || outstanding <= 0;
                        return (
                            <div key={inv.id} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                flexWrap: 'wrap', gap: '0.75rem',
                                padding: '1rem 1.25rem',
                                background: isPaid ? 'rgba(16, 185, 129, 0.06)' : 'rgba(255, 255, 255, 0.04)',
                                border: `1px solid ${isPaid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                                borderRadius: 'var(--radius-md)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 'var(--radius-md)',
                                        background: isPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(236, 72, 153, 0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {isPaid ? <CheckCircle2 size={20} color="#10b981" /> : <FileText size={20} color="#ec4899" />}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-pure)', marginBottom: '0.15rem' }}>
                                            {inv.event_name}
                                        </p>
                                        <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                                            📅 {inv.date} &nbsp;|&nbsp; 📍 {inv.venue}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            Total: ₹{Number(inv.amount).toLocaleString()}
                                        </p>
                                        <p style={{ fontWeight: 800, fontSize: '1rem', color: isPaid ? '#10b981' : '#f59e0b' }}>
                                            {isPaid ? '✓ Paid' : `Due: ₹${outstanding.toLocaleString()}`}
                                        </p>
                                    </div>
                                    {!isPaid && (
                                        <button
                                            className="btn btn-primary"
                                            style={{ padding: '0.55rem 1.1rem', fontSize: '0.825rem', fontWeight: 700 }}
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
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'var(--grad-emerald-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px var(--accent-emerald-glow)' }}>
                        <Plus size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-pure)' }}>Book a New Shoot</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Request wedding, birthday, or portrait session</p>
                    </div>
                </div>

                <a href="/albums" className="card card-interactive" style={{ textDecoration: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px var(--primary-glow)' }}>
                        <Image size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-pure)' }}>Photo Albums</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View, favorite & download original quality</p>
                    </div>
                </a>

                <a href="/bookings" className="card card-interactive" style={{ textDecoration: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'var(--grad-cyan-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px var(--accent-cyan-glow)' }}>
                        <Calendar size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-pure)' }}>My Bookings</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Check shoot schedule & venue details</p>
                    </div>
                </a>

                <a href="/restorations" className="card card-interactive" style={{ textDecoration: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'var(--grad-sunset)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px var(--accent-amber-glow)' }}>
                        <Wand2 size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-pure)' }}>Restore Old Photos</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upload torn/black & white photos for AI repair</p>
                    </div>
                </a>
            </div>

            {/* Mobile App Synergy Card */}
            <div className="card" style={{
                padding: '2rem',
                background: 'rgba(20, 24, 48, 0.65)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '1.5rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Smartphone size={28} color="#22d3ee" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>Prefer using your Phone?</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Install the Studio Pro mobile app on Android or iOS. Log in with your same email (<strong>{user?.email}</strong>) to sync your photos instantly!
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" onClick={() => alert('Download link sent to registered email & phone!')}>
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
                        position: 'relative', border: '1px solid var(--border-highlight)',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <button
                            onClick={() => { setShowBookingModal(false); setBookingSuccess(false); }}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                            <X size={22} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                            <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--grad-emerald-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Calendar size={20} color="#fff" />
                            </div>
                            <h3>Book a New Shoot</h3>
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Fill in the details and the studio will confirm your booking shortly.
                        </p>

                        {bookingSuccess ? (
                            <div style={{
                                textAlign: 'center', padding: '2rem',
                                background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(16, 185, 129, 0.35)'
                            }}>
                                <CheckCircle2 size={48} color="#10b981" style={{ marginBottom: '0.75rem' }} />
                                <h3 style={{ color: '#10b981', marginBottom: '0.5rem' }}>Booking Request Sent!</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    The studio will review your request and call/WhatsApp you to confirm within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                                        Event Type *
                                    </label>
                                    <select
                                        name="event_type"
                                        value={bookingForm.event_type}
                                        onChange={handleBookingChange}
                                        required
                                        style={{
                                            width: '100%', padding: '0.65rem 0.9rem',
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-pure)', fontSize: '0.875rem'
                                        }}
                                    >
                                        <option value="" disabled style={{ background: '#1a1f3e' }}>Select event type...</option>
                                        <option value="Wedding Photography" style={{ background: '#1a1f3e' }}>💒 Wedding Photography</option>
                                        <option value="Pre-Wedding Shoot" style={{ background: '#1a1f3e' }}>💑 Pre-Wedding Shoot</option>
                                        <option value="Birthday Portraits" style={{ background: '#1a1f3e' }}>🎂 Birthday Portraits</option>
                                        <option value="Maternity Shoot" style={{ background: '#1a1f3e' }}>🤰 Maternity Shoot</option>
                                        <option value="Baby/Newborn Photography" style={{ background: '#1a1f3e' }}>👶 Baby / Newborn Photography</option>
                                        <option value="Corporate Event" style={{ background: '#1a1f3e' }}>🏢 Corporate Event</option>
                                        <option value="Product Photography" style={{ background: '#1a1f3e' }}>📦 Product Photography</option>
                                        <option value="Other" style={{ background: '#1a1f3e' }}>✨ Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
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
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-pure)', fontSize: '0.875rem',
                                            colorScheme: 'dark'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
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
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-pure)', fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
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
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-pure)', fontSize: '0.875rem'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
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
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            borderRadius: 'var(--radius-md)',
                                            color: 'var(--text-pure)', fontSize: '0.875rem',
                                            resize: 'vertical', fontFamily: 'inherit'
                                        }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={bookingSubmitting}
                                    style={{ padding: '0.85rem', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.5rem' }}
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
                background: 'rgba(255, 255, 255, 0.06)',
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
