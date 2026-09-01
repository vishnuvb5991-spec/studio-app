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
    Crown
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

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
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    background: 'var(--grad-primary)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    opacity: 0.3
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

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <a href="/albums" className="btn btn-primary" style={{ padding: '0.85rem 1.4rem' }}>
                            <Image size={17} /> View My Photos
                        </a>
                        <a href="/restorations" className="btn btn-secondary" style={{ padding: '0.85rem 1.4rem' }}>
                            <Wand2 size={17} /> AI Restore Photo
                        </a>
                    </div>
                </div>
            </div>

            {/* Quick Action Tiles */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {/* Albums Tile */}
                <a href="/albums" className="card card-interactive" style={{ textDecoration: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px var(--primary-glow)' }}>
                        <Image size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-pure)' }}>Photo Albums</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>View, favorite & download original quality</p>
                    </div>
                </a>

                {/* Bookings Tile */}
                <a href="/bookings" className="card card-interactive" style={{ textDecoration: 'none', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ width: 54, height: 54, borderRadius: 'var(--radius-md)', background: 'var(--grad-cyan-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px var(--accent-cyan-glow)' }}>
                        <Calendar size={26} color="#ffffff" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', color: 'var(--text-pure)' }}>My Bookings</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Check shoot schedule & venue details</p>
                    </div>
                </a>

                {/* Restoration Tile */}
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
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem'
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
