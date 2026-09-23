import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { loadRazorpayCheckout, openRazorpayCheckout } from '../services/razorpay';
import {
    CreditCard,
    Download,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Sparkles,
    Wallet,
    FileText,
    AlertCircle,
    IndianRupee,
    Bell
} from 'lucide-react';

// ── Mock data only visible to STUDIO OWNER ────────────────────────────────────
const allTransactions = [
    {
        id: 'TXN-984210',
        customer: 'Vikram & Ananya',
        email: 'vikram@example.com',
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
        email: 'siddharth@example.com',
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
        email: 'meera@example.com',
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
        email: 'karan@example.com',
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
        email: 'divya@example.com',
        event: 'Pre-Wedding 4K Teaser & Stills',
        amount: 40000,
        gateway: 'PhonePe UPI',
        status: 'success',
        date: 'Aug 24, 2026',
        payoutStatus: 'Settled to Bank',
        refId: 'pay_P1rW654kJh'
    },
    // Ananya's own transactions — visible when she logs in
    {
        id: 'TXN-984210',
        customer: 'Ananya S',
        email: 'ananya.s@gmail.com',
        event: 'Luxury Destination Wedding (Jaipur)',
        amount: 185000,
        advance_paid: 185000,
        gateway: 'Razorpay UPI',
        status: 'success',
        date: 'Aug 28, 2026',
        payoutStatus: 'Settled to Bank',
        refId: 'pay_P8xK910mNp'
    },
    {
        id: 'TXN-984205',
        customer: 'Ananya S',
        email: 'ananya.s@gmail.com',
        event: 'Birthday Portrait Session',
        amount: 8500,
        advance_paid: 0,
        gateway: 'Pending',
        status: 'pending',
        date: 'Jan 10, 2025',
        payoutStatus: 'Awaiting Payment',
        refId: ''
    }
];

// ── ADMIN: full transaction journal ──────────────────────────────────────────
function AdminPaymentsView() {
    const [filter, setFilter] = useState('all');
    const [amount, setAmount] = useState('');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [checkoutMessage, setCheckoutMessage] = useState('');

    // Admin notifications from customer booking requests
    const [adminNotifications, setAdminNotifications] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('studio_admin_notifications') || '[]');
        } catch { return []; }
    });

    const clearNotification = (idx) => {
        const updated = adminNotifications.filter((_, i) => i !== idx);
        setAdminNotifications(updated);
        localStorage.setItem('studio_admin_notifications', JSON.stringify(updated));
    };

    const clearAll = () => {
        setAdminNotifications([]);
        localStorage.setItem('studio_admin_notifications', '[]');
    };

    // Only show non-duplicated transactions (exclude Ananya's duplicated demo rows)
    const ownerTransactions = allTransactions.filter(t => t.email !== 'ananya.s@gmail.com' || t.status === 'success' && t.id === 'TXN-984210' && false);
    const displayTransactions = allTransactions.filter(t => !['ananya.s@gmail.com'].includes(t.email));

    const filteredTransactions = filter === 'all'
        ? displayTransactions
        : displayTransactions.filter(t => t.status === filter);

    const startPayment = async (event) => {
        event.preventDefault();
        const parsedAmount = Number(amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount < 1) {
            setCheckoutMessage('Enter an amount of at least ₹1.');
            return;
        }
        setIsPaying(true);
        setCheckoutMessage('');
        try {
            const { data: order } = await api.post('/payments/create-order/', {
                amount: parsedAmount.toFixed(2),
                payment_type: 'other',
                description: 'Studio payment collected from web dashboard',
            });
            await openRazorpayCheckout(order, async (response) => {
                await api.post('/payments/verify/', {
                    payment_id: order.payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });
                setCheckoutMessage('Payment verified successfully.');
                setIsCheckoutOpen(false);
                setAmount('');
            });
        } catch (error) {
            setCheckoutMessage(error.response?.data?.error || error.message || 'Unable to complete payment.');
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
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
                    <button
                        className="btn btn-primary"
                        style={{ fontSize: '0.825rem' }}
                        onClick={() => { setCheckoutMessage(''); setIsCheckoutOpen(true); }}
                    >
                        <Wallet size={16} /> Collect Payment
                    </button>
                </div>
            </div>

            {/* Admin Booking Notifications */}
            {adminNotifications.length > 0 && (
                <div className="card" style={{ padding: '1.25rem', marginBottom: '1.75rem', border: '1px solid rgba(217, 119, 6, 0.25)', background: '#fffbeb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: '#92400e' }}>
                            <Bell size={18} color="#d97706" />
                            New Booking Requests
                            <span style={{ background: '#d97706', color: '#fff', borderRadius: '999px', padding: '0.1rem 0.55rem', fontSize: '0.72rem', fontWeight: 800 }}>
                                {adminNotifications.length}
                            </span>
                        </h3>
                        <button
                            onClick={clearAll}
                            className="btn btn-secondary"
                            style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        >
                            Clear All
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                        {adminNotifications.map((notif, idx) => (
                            <div key={idx} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                flexWrap: 'wrap', gap: '0.5rem',
                                padding: '0.75rem 1rem',
                                background: '#ffffff',
                                border: '1px solid rgba(217, 119, 6, 0.2)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-pure)', marginBottom: '0.2rem' }}>
                                        🎯 {notif.client} requested <strong>{notif.event_type}</strong>
                                    </p>
                                    <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                                        📅 {notif.preferred_date} &nbsp;|&nbsp; 📍 {notif.venue || 'TBD'} &nbsp;|&nbsp; 📞 {notif.phone} &nbsp;|&nbsp; ✉️ {notif.email}
                                    </p>
                                    {notif.message && (
                                        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                            💬 {notif.message}
                                        </p>
                                    )}
                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                        Received: {notif.received_at}
                                    </p>
                                </div>
                                <button
                                    onClick={() => clearNotification(idx)}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.72rem' }}
                                >
                                    ✓ Done
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Collect Payment Inline Form */}
            {isCheckoutOpen && (
                <form onSubmit={startPayment} className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem', maxWidth: 520 }}>
                    <h3 style={{ marginBottom: '0.45rem' }}>Collect a payment</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        Razorpay Checkout opens after the server creates the order.
                    </p>
                    <label htmlFor="payment-amount" style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.45rem' }}>Amount (₹)</label>
                    <input
                        id="payment-amount"
                        type="number"
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        required
                        disabled={isPaying}
                        style={{ width: '100%', marginBottom: '0.9rem' }}
                    />
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button className="btn btn-primary" type="submit" disabled={isPaying}>
                            <CreditCard size={16} /> {isPaying ? 'Opening Checkout…' : 'Continue to Razorpay'}
                        </button>
                        <button className="btn btn-secondary" type="button" disabled={isPaying} onClick={() => setIsCheckoutOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {checkoutMessage && (
                <p role="status" style={{ color: checkoutMessage.includes('successfully') ? '#34d399' : '#f87171', marginBottom: '1.25rem' }}>
                    {checkoutMessage}
                </p>
            )}

            {/* Financial Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <SummaryCard gradient="var(--grad-sunset)" glow="var(--accent-amber-glow)" icon={CreditCard} badge="+34.8% MTD" badgeClass="badge-success" value="₹3,18,800" label="Total Monthly Volume" sub="Auto-Settled" subColor="#34d399" />
                <SummaryCard gradient="var(--grad-emerald-teal)" glow="var(--accent-emerald-glow)" icon={Wallet} badge="Next: 6:00 PM" badgeClass="badge-info" value="₹72,000" label="Ready for Payout" sub="HDFC Bank *4102" subColor="#22d3ee" />
                <SummaryCard gradient="var(--grad-primary)" glow="var(--primary-glow)" icon={ShieldCheck} badge="Razorpay Core" badgeClass="badge-purple" value="99.4%" label="Payment Success Rate" sub="0 Chargebacks" subColor="#c084fc" />
                <SummaryCard gradient="var(--grad-cyan-blue)" glow="var(--accent-cyan-glow)" icon={Clock} badge="2 Actionable" badgeClass="badge-warning" value="₹32,000" label="Pending Balance" sub="Auto-Reminder On" subColor="#fbbf24" />
            </div>

            {/* Transaction Journal */}
            <div className="card" style={{ padding: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h3>Settlement & Transaction Journal</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Verified transactions received across Web & Mobile apps</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                        {['all', 'success', 'pending'].map((s) => (
                            <button key={s} onClick={() => setFilter(s)} style={{
                                padding: '0.45rem 0.9rem', borderRadius: 'var(--radius-sm)', border: 'none',
                                background: filter === s ? 'var(--grad-primary)' : 'transparent',
                                color: filter === s ? '#ffffff' : 'var(--text-secondary)',
                                fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                textTransform: 'uppercase', letterSpacing: '0.04em'
                            }}>
                                {s}
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
                            {filteredTransactions.map((tx, i) => (
                                <tr key={`${tx.id}-${i}`}>
                                    <td>
                                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.85rem' }}>{tx.id}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tx.refId}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--text-pure)' }}>{tx.customer}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tx.event}</div>
                                    </td>
                                    <td><span className="badge badge-purple">{tx.gateway}</span></td>
                                    <td>
                                        <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1rem' }}>₹{tx.amount.toLocaleString()}</div>
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
                                            onClick={() => alert(`Downloading invoice for ${tx.id}…`)}
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

// ── CUSTOMER: only their own invoices ────────────────────────────────────────
function CustomerInvoicesView({ user }) {
    const [myInvoices, setMyInvoices] = useState([]);
    const [payingId, setPayingId] = useState(null);

    useEffect(() => {
        // 1. Try API
        api.get('/payments/my-invoices/')
            .then(res => setMyInvoices(res.data))
            .catch(() => {
                // 2. Filter mock transactions by this user's email
                const email = user?.email?.toLowerCase() || '';
                const fromMock = allTransactions.filter(t => t.email?.toLowerCase() === email);

                // 3. Also merge any localStorage bookings this user created
                const stored = JSON.parse(localStorage.getItem('studio_custom_bookings') || '[]');
                const fromLocal = stored
                    .filter(b => b.email?.toLowerCase() === email || b.client?.toLowerCase() === (user?.first_name || '').toLowerCase())
                    .map((b, i) => ({
                        id: b.id || `LOCAL-${i}`,
                        customer: b.client || user?.first_name || 'Customer',
                        email: b.email || email,
                        event: b.event_name || 'Booking',
                        amount: Number(b.amount) || 0,
                        advance_paid: Number(b.advance_paid) || 0,
                        gateway: b.status === 'confirmed' ? 'Razorpay' : 'Pending',
                        status: Number(b.amount) > 0 && Number(b.advance_paid) >= Number(b.amount) ? 'success' : 'pending',
                        date: b.date || '—',
                        payoutStatus: Number(b.amount) > 0 && Number(b.advance_paid) >= Number(b.amount) ? 'Settled to Bank' : 'Awaiting Payment',
                        refId: ''
                    }));

                // Merge, dedupe by id
                const all = [...fromMock, ...fromLocal];
                const seen = new Set();
                setMyInvoices(all.filter(inv => {
                    if (seen.has(inv.id)) return false;
                    seen.add(inv.id);
                    return true;
                }));
            });
    }, [user]);

    const handlePayNow = async (inv) => {
        setPayingId(inv.id);
        try {
            await loadRazorpayCheckout();
            const outstanding = Number(inv.amount) - Number(inv.advance_paid || 0);
            let order;
            try {
                const resp = await api.post('/payments/create-order/', {
                    amount: outstanding,
                    booking_id: inv.id,
                    description: inv.event
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
                        booking_id: inv.id
                    });
                } catch (_) {}
                setMyInvoices(prev => prev.map(i =>
                    i.id === inv.id ? { ...i, advance_paid: i.amount, status: 'success', payoutStatus: 'Settled to Bank', _paid: true } : i
                ));
                alert(`✅ Payment of ₹${outstanding.toLocaleString()} received! Thank you, ${user?.first_name || 'valued client'}.`);
            }, user);
        } catch {
            alert('Payment could not be processed. Please contact the studio.');
        } finally {
            setPayingId(null);
        }
    };

    const totalPaid = myInvoices
        .filter(i => i.status === 'success' || i._paid)
        .reduce((s, i) => s + Number(i.amount), 0);
    const totalDue = myInvoices
        .filter(i => i.status !== 'success' && !i._paid && Number(i.amount) > 0)
        .reduce((s, i) => s + (Number(i.amount) - Number(i.advance_paid || 0)), 0);

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <h1 className="gradient-text">My Invoices & Receipts</h1>
                    <IndianRupee size={20} color="#d97706" />
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Your personal payment history and outstanding balances — only your transactions are shown here.
                </p>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid #10b981' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Total Paid</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>₹{totalPaid.toLocaleString()}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Across {myInvoices.filter(i => i.status === 'success' || i._paid).length} settled invoice(s)</p>
                </div>
                <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid #d97706' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Outstanding Balance</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>₹{totalDue.toLocaleString()}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{totalDue > 0 ? 'Pay now to confirm your booking' : 'All clear! 🎉'}</p>
                </div>
                <div className="card" style={{ padding: '1.25rem', borderLeft: '3px solid #18181b' }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Total Invoices</p>
                    <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#18181b' }}>{myInvoices.length}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🔒 Secured by Razorpay</p>
                </div>
            </div>

            {/* Invoice List */}
            <div className="card" style={{ padding: '1.75rem' }}>
                <h3 style={{ marginBottom: '0.25rem' }}>Your Transaction History</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Only your bookings and payments are visible here. Other clients' data is never shown.
                </p>

                {myInvoices.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <FileText size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p style={{ fontWeight: 600 }}>No invoices yet</p>
                        <p style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>Book a shoot from your dashboard and your invoice will appear here.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {myInvoices.map((inv) => {
                            const outstanding = Number(inv.amount) - Number(inv.advance_paid || 0);
                            const isPaid = inv._paid || inv.status === 'success' || outstanding <= 0;
                            return (
                                <div key={inv.id} style={{
                                    padding: '1.25rem 1.5rem',
                                    background: isPaid ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)',
                                    border: `1px solid ${isPaid ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', flexWrap: 'wrap', gap: '1rem'
                                }}>
                                    {/* Left: Invoice info */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 'var(--radius-md)',
                                            background: isPaid ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.15)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            {isPaid
                                                ? <CheckCircle2 size={22} color="#10b981" />
                                                : <AlertCircle size={22} color="#f59e0b" />
                                            }
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-pure)', marginBottom: '0.2rem' }}>
                                                {inv.event}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                📅 {inv.date}
                                                {inv.refId && <span> &nbsp;|&nbsp; 🔖 {inv.refId}</span>}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                                                {inv.gateway !== 'Pending' && `via ${inv.gateway}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Amount + action */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                Total: ₹{Number(inv.amount).toLocaleString()}
                                            </p>
                                            <p style={{ fontWeight: 800, fontSize: '1.1rem', color: isPaid ? '#10b981' : '#f59e0b' }}>
                                                {isPaid
                                                    ? '✓ Fully Paid'
                                                    : outstanding > 0
                                                        ? `Due: ₹${outstanding.toLocaleString()}`
                                                        : '✓ Fully Paid'
                                                }
                                            </p>
                                        </div>

                                        {isPaid ? (
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                                onClick={() => alert(`Downloading receipt for ${inv.event}…`)}
                                            >
                                                <Download size={14} /> Receipt PDF
                                            </button>
                                        ) : outstanding > 0 ? (
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', fontWeight: 700 }}
                                                disabled={payingId === inv.id}
                                                onClick={() => handlePayNow(inv)}
                                            >
                                                {payingId === inv.id ? '⏳ Opening…' : '💳 Pay Now'}
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Shared Summary Card sub-component ────────────────────────────────────────
function SummaryCard({ gradient, glow, icon: Icon, badge, badgeClass, value, label, sub, subColor }) {
    return (
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: gradient, borderRadius: '50%', filter: 'blur(35px)', opacity: 0.35 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 20px ${glow}` }}>
                    <Icon size={22} color="#fff" />
                </div>
                <span className={`badge ${badgeClass}`}>{badge}</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-pure)', marginBottom: '0.2rem' }}>{value}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>{label}</span>
                <span style={{ color: subColor, fontWeight: 700 }}>{sub}</span>
            </div>
        </div>
    );
}

// ── Root export: switches view based on role ──────────────────────────────────
function Payments() {
    const { user, isStudioOwner, viewMode } = useAuth();
    const isCustomerView = !isStudioOwner || viewMode === 'customer';

    if (isCustomerView) {
        return <CustomerInvoicesView user={user} />;
    }
    return <AdminPaymentsView />;
}

export default Payments;
