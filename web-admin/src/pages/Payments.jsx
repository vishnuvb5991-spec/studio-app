import React, { useState } from 'react';
import {
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Download,
    Filter,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Sparkles,
    RefreshCw,
    Wallet,
    DollarSign,
    Zap
} from 'lucide-react';

const mockTransactions = [
    {
        id: 'TXN-984210',
        customer: 'Vikram & Ananya',
        event: 'Luxury Destination Wedding (Jaipur)',
        amount: 185000,
        gateway: 'Razorpay UPI',
        status: 'success',
        date: 'Aug 28, 2026',
        payoutStatus: 'Settled to Bank',
        refId: 'pay_P8xK910mNp'
    },
    {
        id: 'TXN-984209',
        customer: 'Siddharth Rao',
        event: 'Corporate Commercial Portfolio Shoot',
        amount: 55000,
        gateway: 'Net Banking (HDFC)',
        status: 'success',
        date: 'Aug 27, 2026',
        payoutStatus: 'Settled to Bank',
        refId: 'pay_P7aM330qLm'
    },
    {
        id: 'TXN-984208',
        customer: 'Meera Nambiar',
        event: 'AI Colorization & Torn Album Restoration',
        amount: 6800,
        gateway: 'Google Pay / UPI',
        status: 'success',
        date: 'Aug 26, 2026',
        payoutStatus: 'Settled to Bank',
        refId: 'pay_P5nB112vRt'
    },
    {
        id: 'TXN-984207',
        customer: 'Karan Mehra',
        event: 'Maternity & New Born Storybook',
        amount: 32000,
        gateway: 'Credit Card (Visa)',
        status: 'pending',
        date: 'Aug 25, 2026',
        payoutStatus: 'Processing',
        refId: 'pay_P2vT908xQw'
    },
    {
        id: 'TXN-984206',
        customer: 'Divya & Rohan',
        event: 'Pre-Wedding 4K Teaser & Stills',
        amount: 40000,
        gateway: 'PhonePe UPI',
        status: 'success',
        date: 'Aug 24, 2026',
        payoutStatus: 'Settled to Bank',
        refId: 'pay_P1rW654kJh'
    }
];

function Payments() {
    const [filter, setFilter] = useState('all');
    const [transactions] = useState(mockTransactions);

    const filteredTransactions = filter === 'all' 
        ? transactions 
        : transactions.filter(t => t.status === filter);

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
                        <h1 className="gradient-text">Payments & Financial Hub</h1>
                        <Sparkles size={20} color="#f59e0b" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Live gateway reconciliations, Razorpay payouts, and customer invoices.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-secondary" style={{ fontSize: '0.825rem' }}>
                        <Download size={16} /> Export Statement (CSV)
                    </button>
                    <button className="btn btn-primary" style={{ fontSize: '0.825rem' }}>
                        <Wallet size={16} /> Instant Payout
                    </button>
                </div>
            </div>

            {/* Financial Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
            }}>
                {/* Total Balance */}
                <div className="card" style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 80,
                        height: 80,
                        background: 'var(--grad-sunset)',
                        borderRadius: '50%',
                        filter: 'blur(35px)',
                        opacity: 0.35
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--grad-sunset)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px var(--accent-amber-glow)'
                        }}>
                            <CreditCard size={22} color="#fff" />
                        </div>
                        <span className="badge badge-success">+34.8% MTD</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.2rem' }}>
                        ₹3,18,800
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Total Monthly Volume</span>
                        <span style={{ color: '#34d399', fontWeight: 700 }}>Auto-Settled</span>
                    </div>
                </div>

                {/* Instant Available */}
                <div className="card" style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 80,
                        height: 80,
                        background: 'var(--grad-emerald-teal)',
                        borderRadius: '50%',
                        filter: 'blur(35px)',
                        opacity: 0.35
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--grad-emerald-teal)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px var(--accent-emerald-glow)'
                        }}>
                            <Wallet size={22} color="#fff" />
                        </div>
                        <span className="badge badge-info">Next: 6:00 PM</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.2rem' }}>
                        ₹72,000
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Ready for Payout</span>
                        <span style={{ color: '#22d3ee', fontWeight: 700 }}>HDFC Bank *4102</span>
                    </div>
                </div>

                {/* Success Rate */}
                <div className="card" style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 80,
                        height: 80,
                        background: 'var(--grad-primary)',
                        borderRadius: '50%',
                        filter: 'blur(35px)',
                        opacity: 0.35
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--grad-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px var(--primary-glow)'
                        }}>
                            <ShieldCheck size={22} color="#fff" />
                        </div>
                        <span className="badge badge-purple">Razorpay Core</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.2rem' }}>
                        99.4%
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Payment Success Rate</span>
                        <span style={{ color: '#c084fc', fontWeight: 700 }}>0 Chargebacks</span>
                    </div>
                </div>

                {/* Pending Invoices */}
                <div className="card" style={{ position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 80,
                        height: 80,
                        background: 'var(--grad-cyan-blue)',
                        borderRadius: '50%',
                        filter: 'blur(35px)',
                        opacity: 0.35
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div style={{
                            width: 44,
                            height: 44,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--grad-cyan-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 20px var(--accent-cyan-glow)'
                        }}>
                            <Clock size={22} color="#fff" />
                        </div>
                        <span className="badge badge-warning">2 Actionable</span>
                    </div>
                    <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.2rem' }}>
                        ₹32,000
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>Pending Balance Advance</span>
                        <span style={{ color: '#fbbf24', fontWeight: 700 }}>Auto-Reminder On</span>
                    </div>
                </div>
            </div>

            {/* Transactions Log Section */}
            <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h3>Settlement & Transaction Journal</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Verified transactions received across Web & Mobile apps
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                        {['all', 'success', 'pending'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                style={{
                                    padding: '0.45rem 0.9rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: 'none',
                                    background: filter === status ? 'var(--grad-primary)' : 'transparent',
                                    color: filter === status ? '#ffffff' : 'var(--text-secondary)',
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    transition: 'all var(--transition-fast)'
                                }}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Customer & Package</th>
                                <th>Channel</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Settlement</th>
                                <th style={{ textAlign: 'right' }}>Invoice</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.85rem' }}>
                                            {tx.id}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {tx.refId}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--text-pure)' }}>{tx.customer}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tx.event}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-purple">{tx.gateway}</span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1rem' }}>
                                            ₹{tx.amount.toLocaleString()}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.date}</div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${tx.status === 'success' ? 'success' : 'warning'}`}>
                                            {tx.status === 'success' ? '● Verified' : '● Processing'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: tx.status === 'success' ? '#34d399' : '#fbbf24' }}>
                                            {tx.payoutStatus}
                                        </div>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn btn-secondary"
                                            style={{ padding: '0.45rem 0.85rem', fontSize: '0.75rem', display: 'inline-flex' }}
                                            onClick={() => alert(`Downloading official GST invoice for ${tx.id}...`)}
                                        >
                                            <Download size={13} /> PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Payments;
