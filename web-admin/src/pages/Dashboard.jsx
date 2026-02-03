import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Image,
    CreditCard,
    Users,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

// Mock chart data
const chartData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
    { name: 'Jul', revenue: 3490 },
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
            title: 'Total Bookings',
            value: stats?.total_bookings || 0,
            icon: Calendar,
            color: 'var(--primary)',
            change: '+12%'
        },
        {
            title: 'Albums Created',
            value: 24,
            icon: Image,
            color: 'var(--success)',
            change: '+8%'
        },
        {
            title: 'Revenue',
            value: `₹${(stats?.total_revenue || 0).toLocaleString()}`,
            icon: CreditCard,
            color: 'var(--accent)',
            change: '+23%'
        },
        {
            title: 'Customers',
            value: 156,
            icon: Users,
            color: 'var(--info)',
            change: '+5%'
        },
    ];

    return (
        <div className="animate-fadeIn">
            {/* Page Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1>Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Welcome back! Here's what's happening with your studio.
                </p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1.5rem',
                marginBottom: '2rem',
            }}>
                {statCards.map((stat, index) => (
                    <div key={index} className="card" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start'
                        }}>
                            <div style={{
                                width: 48,
                                height: 48,
                                background: `${stat.color}20`,
                                borderRadius: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <stat.icon size={24} color={stat.color} />
                            </div>
                            <span style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '0.75rem',
                                color: 'var(--success)',
                                fontWeight: 600,
                            }}>
                                <TrendingUp size={14} />
                                {stat.change}
                            </span>
                        </div>
                        <div>
                            <p style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                marginBottom: '0.25rem'
                            }}>
                                {stat.value}
                            </p>
                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-secondary)'
                            }}>
                                {stat.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '1.5rem',
                marginBottom: '2rem',
            }}>
                {/* Revenue Chart */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Revenue Overview</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: 8,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="var(--primary)"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Booking Status */}
                <div className="card">
                    <h3 style={{ marginBottom: '1rem' }}>Booking Status</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <StatusItem
                            icon={Clock}
                            label="Pending"
                            value={stats?.pending_bookings || 0}
                            color="var(--warning)"
                        />
                        <StatusItem
                            icon={CheckCircle2}
                            label="Confirmed"
                            value={stats?.confirmed_bookings || 0}
                            color="var(--success)"
                        />
                        <StatusItem
                            icon={AlertCircle}
                            label="Completed"
                            value={stats?.completed_bookings || 0}
                            color="var(--primary)"
                        />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h3 style={{ marginBottom: '1rem' }}>Recent Bookings</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Event</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Wedding Photography</td>
                            <td>Rahul Sharma</td>
                            <td>Feb 15, 2024</td>
                            <td>₹85,000</td>
                            <td><span className="badge badge-success">Confirmed</span></td>
                        </tr>
                        <tr>
                            <td>Pre-Wedding Shoot</td>
                            <td>Priya Patel</td>
                            <td>Feb 20, 2024</td>
                            <td>₹25,000</td>
                            <td><span className="badge badge-warning">Pending</span></td>
                        </tr>
                        <tr>
                            <td>Birthday Event</td>
                            <td>Amit Kumar</td>
                            <td>Feb 28, 2024</td>
                            <td>₹15,000</td>
                            <td><span className="badge badge-info">In Progress</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusItem({ icon: Icon, label, value, color }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem',
            background: `${color}10`,
            borderRadius: 'var(--radius-md)',
        }}>
            <Icon size={20} color={color} />
            <span style={{ flex: 1, color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontWeight: 600 }}>{value}</span>
        </div>
    );
}

export default Dashboard;
