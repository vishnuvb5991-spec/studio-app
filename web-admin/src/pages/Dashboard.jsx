import React, { useState, useEffect } from 'react';
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
    Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../services/api';

// Dynamic Chart Data
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
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

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
            {/* Header with Quick Action Launchers */}
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

                {/* Action Chips */}
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
                        {/* Corner Glow Accent */}
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
                                <p style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    color: 'var(--text-secondary)'
                                }}>
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

            {/* Visual Analytics & Breakdown */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1.75rem',
                marginBottom: '2rem',
            }}>
                {/* Revenue Curve Chart */}
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
                        <span className="badge badge-success">
                            ● Live Sync
                        </span>
                    </div>

                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(15, 17, 35, 0.95)',
                                    border: '1px solid rgba(139, 92, 246, 0.4)',
                                    borderRadius: '12px',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                                    color: '#ffffff'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#ec4899"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRev)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Booking Status Progress */}
                <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ marginBottom: '0.25rem' }}>Workflow Pipeline</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Order queue across stages
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <PipelineProgress
                            label="Pending Confirmation"
                            count={stats?.pending_bookings || 7}
                            color="#f59e0b"
                            percent="25%"
                        />
                        <PipelineProgress
                            label="Confirmed & In Production"
                            count={stats?.confirmed_bookings || 19}
                            color="#06b6d4"
                            percent="60%"
                        />
                        <PipelineProgress
                            label="Completed & Delivered"
                            count={stats?.completed_bookings || 16}
                            color="#10b981"
                            percent="90%"
                        />
                    </div>

                    <a href="/bookings" style={{
                        marginTop: '1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        background: 'rgba(255, 255, 255, 0.04)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--primary-light)'
                    }}>
                        <span>Open Schedule Matrix</span>
                        <ArrowUpRight size={16} />
                    </a>
                </div>
            </div>

            {/* Recent Live Activity Feed */}
            <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div>
                        <h3>Recent Bookings & Studio Activity</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Latest transactions and shoots updated in real time
                        </p>
                    </div>
                    <a href="/bookings" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                        View All Bookings
                    </a>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Event Type</th>
                                <th>Customer</th>
                                <th>Schedule Date</th>
                                <th>Amount</th>
                                <th>Gateway</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div style={{ fontWeight: 700, color: 'var(--text-pure)' }}>Grand Wedding & Reception</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>4K Cinematic + Drone + Candid</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                                            R
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Rahul & Sneha</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>rahul.s@gmail.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>Oct 24, 2026</div>
                                    <div style={{ fontSize: '0.75rem', color: '#06b6d4' }}>Full Day Shoot</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.95rem' }}>₹1,25,000</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>₹50,000 Advance Paid</div>
                                </td>
                                <td>
                                    <span className="badge badge-purple">Razorpay UPI</span>
                                </td>
                                <td>
                                    <span className="badge badge-success">Confirmed</span>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div style={{ fontWeight: 700, color: 'var(--text-pure)' }}>Pre-Wedding Sunset Story</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Beach Resort & Outdoor</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--grad-cyan-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                                            P
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Priya Patel</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>priya.p@outlook.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>Nov 02, 2026</div>
                                    <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Evening Slot</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.95rem' }}>₹45,000</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Full Payment Complete</div>
                                </td>
                                <td>
                                    <span className="badge badge-info">Google Pay</span>
                                </td>
                                <td>
                                    <span className="badge badge-success">Confirmed</span>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <div style={{ fontWeight: 700, color: 'var(--text-pure)' }}>AI Heritage Photo Restoration</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Torn 1968 Family Portrait + Colorize</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--grad-sunset)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                                            A
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>Anand Verma</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>anand.v@gmail.com</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 600 }}>Sep 04, 2026</div>
                                    <div style={{ fontSize: '0.75rem', color: '#ec4899' }}>Urgent (24h)</div>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.95rem' }}>₹4,500</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Settled</div>
                                </td>
                                <td>
                                    <span className="badge badge-purple">PhonePe</span>
                                </td>
                                <td>
                                    <span className="badge badge-warning">In Review</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
