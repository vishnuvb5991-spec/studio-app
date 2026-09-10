import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Calendar, 
    Clock, 
    MapPin, 
    CheckCircle2, 
    XCircle, 
    Sparkles, 
    Filter, 
    Phone, 
    Mail,
    X,
    DollarSign,
    User,
    CalendarCheck
} from 'lucide-react';
import api from '../services/api';

const defaultShowcaseBookings = [
    {
        id: 'bkg-101',
        event_name: 'Ananya & Kabir Sangeet + Wedding',
        event_date: '2026-11-18',
        customer_name: 'Ananya Sharma',
        customer_email: 'ananya.s@gmail.com',
        customer_phone: '+91 98201 44521',
        venue_name: 'The Leela Palace, Udaipur',
        total_amount: 195000,
        advance_paid: true,
        status: 'confirmed'
    },
    {
        id: 'bkg-102',
        event_name: 'Dr. Nair 50th Anniversary Cinematic Shoot',
        event_date: '2026-10-05',
        customer_name: 'Dr. Suresh Nair',
        customer_email: 'suresh.nair@apollo.org',
        customer_phone: '+91 94470 12390',
        venue_name: 'Taj Gateway, Kochi',
        total_amount: 55000,
        advance_paid: true,
        status: 'confirmed'
    },
    {
        id: 'bkg-103',
        event_name: 'Zara Lifestyle Autumn Lookbook',
        event_date: '2026-09-22',
        customer_name: 'Rohan Mehra (Creative Dir)',
        customer_email: 'rohan.m@zara.in',
        customer_phone: '+91 98110 99823',
        venue_name: 'Studio Pro Studio 1, Bandra',
        total_amount: 85000,
        advance_paid: false,
        status: 'pending'
    },
    {
        id: 'bkg-104',
        event_name: 'Baby Aadhya 1st Birthday Film',
        event_date: '2026-09-15',
        customer_name: 'Deepika & Vicky',
        customer_email: 'deepika.v@yahoo.com',
        customer_phone: '+91 99200 33410',
        venue_name: 'JW Marriott, Juhu',
        total_amount: 38000,
        advance_paid: true,
        status: 'completed'
    }
];

function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');

    // Create Event Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventName, setEventName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [venueName, setVenueName] = useState('');
    const [totalAmount, setTotalAmount] = useState('75000');
    const [advancePaid, setAdvancePaid] = useState(true);
    const [eventStatus, setEventStatus] = useState('confirmed');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = () => {
        try {
            const stored = localStorage.getItem('studio_custom_bookings');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setBookings(parsed);
                    setLoading(false);
                    return;
                }
            }
        } catch (e) {}

        setBookings(defaultShowcaseBookings);
        setLoading(false);
    };

    const handleCreateBooking = (e) => {
        e.preventDefault();
        if (!eventName.trim() || !customerName.trim() || !eventDate) return;

        const newBooking = {
            id: `bkg-${Date.now()}`,
            event_name: eventName.trim(),
            event_date: eventDate,
            customer_name: customerName.trim(),
            customer_email: customerEmail.trim() || `${customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
            customer_phone: customerPhone.trim() || '+91 98765 00000',
            venue_name: venueName.trim() || 'Main Studio, Studio Pro',
            total_amount: Number(totalAmount) || 50000,
            advance_paid: advancePaid,
            status: eventStatus
        };

        const updated = [newBooking, ...bookings];
        setBookings(updated);
        try {
            localStorage.setItem('studio_custom_bookings', JSON.stringify(updated));
        } catch (err) {}

        // Try syncing to Django API in background
        api.post('/bookings/', {
            event_name: newBooking.event_name,
            event_date: newBooking.event_date,
            total_amount: newBooking.total_amount,
            venue_name: newBooking.venue_name,
        }).catch(() => {});

        setIsModalOpen(false);
        setSuccessMessage(`Shoot "${newBooking.event_name}" scheduled for ${newBooking.event_date}!`);
        setTimeout(() => setSuccessMessage(''), 4000);

        // Reset
        setEventName('');
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setVenueName('');
        setEventDate('');
    };

    const updateStatus = (id, status) => {
        const updated = bookings.map(b => b.id === id ? { ...b, status } : b);
        setBookings(updated);
        try {
            localStorage.setItem('studio_custom_bookings', JSON.stringify(updated));
        } catch (err) {}

        api.post(`/bookings/${id}/update_status/`, { status }).catch(() => {});
    };

    const filteredBookings = statusFilter === 'all'
        ? bookings
        : bookings.filter(b => (b.status || '').toLowerCase() === statusFilter.toLowerCase());

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
                        <h1 className="gradient-text">Studio Production Schedule</h1>
                        <Sparkles size={20} color="#06b6d4" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Manage upcoming wedding dates, drone operators, and shooting calendar.
                    </p>
                </div>

                <button
                    className="btn btn-cyan"
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.4rem' }}
                >
                    <Plus size={18} /> Schedule New Event
                </button>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    padding: '0.85rem 1.25rem',
                    background: 'rgba(6, 182, 212, 0.15)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    color: '#22d3ee',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <CheckCircle2 size={16} /> {successMessage}
                </div>
            )}

            {/* Status Filter Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.75rem',
                flexWrap: 'wrap',
                background: 'rgba(20, 24, 48, 0.6)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                width: 'fit-content'
            }}>
                {[
                    { id: 'all', label: 'All Events' },
                    { id: 'confirmed', label: 'Confirmed (Active)' },
                    { id: 'pending', label: 'Pending Review' },
                    { id: 'completed', label: 'Completed' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        style={{
                            padding: '0.45rem 1.15rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: statusFilter === tab.id ? 'var(--grad-cyan)' : 'transparent',
                            color: statusFilter === tab.id ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredBookings.map((b) => (
                    <div
                        key={b.id}
                        className="card card-interactive"
                        style={{
                            padding: '1.4rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '1.25rem'
                        }}
                    >
                        {/* Event Details */}
                        <div style={{ minWidth: 280, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
                                <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    padding: '0.2rem 0.55rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: b.status === 'confirmed' ? 'rgba(16, 185, 129, 0.2)' : (b.status === 'pending' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)'),
                                    color: b.status === 'confirmed' ? '#34d399' : (b.status === 'pending' ? '#fbbf24' : '#60a5fa'),
                                    textTransform: 'uppercase'
                                }}>
                                    {b.status}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {b.id}</span>
                            </div>

                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                                {b.event_name}
                            </h3>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Calendar size={14} color="var(--accent-cyan)" /> {b.event_date}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <MapPin size={14} color="#ec4899" /> {b.venue_name}
                                </span>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <div style={{ minWidth: 220, fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 700, color: 'var(--text-pure)', marginBottom: '0.25rem' }}>
                                {b.customer_name}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                <Mail size={12} /> {b.customer_email}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                                <Phone size={12} /> {b.customer_phone}
                            </div>
                        </div>

                        {/* Amount & Status Action */}
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            <div>
                                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--accent-emerald)' }}>
                                    ₹{Number(b.total_amount).toLocaleString('en-IN')}
                                </span>
                                <div style={{ fontSize: '0.7rem', color: b.advance_paid ? '#34d399' : '#f87171', fontWeight: 700 }}>
                                    {b.advance_paid ? '✓ Advance Paid (Razorpay)' : '⚠️ Advance Pending'}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                                {b.status !== 'confirmed' && (
                                    <button
                                        onClick={() => updateStatus(b.id, 'confirmed')}
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            border: '1px solid rgba(16, 185, 129, 0.4)',
                                            color: '#34d399',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Confirm
                                    </button>
                                )}
                                {b.status !== 'completed' && (
                                    <button
                                        onClick={() => updateStatus(b.id, 'completed')}
                                        style={{
                                            padding: '0.35rem 0.65rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'rgba(59, 130, 246, 0.2)',
                                            border: '1px solid rgba(59, 130, 246, 0.4)',
                                            color: '#60a5fa',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Complete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SCHEDULE NEW EVENT MODAL */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem'
                }}>
                    <div className="card" style={{
                        width: '100%',
                        maxWidth: 580,
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '2rem',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: 18,
                                right: 18,
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: 'none',
                                color: '#ffffff',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={16} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <CalendarCheck size={22} color="#06b6d4" />
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Schedule New Production Shoot</h2>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Reserve crew, assign cinematographer gear, and send confirmation to customer.
                        </p>

                        <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                    Event Title / Occasion *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Vikram & Sneha Royal Sangeet & Reception"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    required
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Client Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Sneha Patel"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        required
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Shoot Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={eventDate}
                                        onChange={(e) => setEventDate(e.target.value)}
                                        required
                                        style={{ width: '100%', height: 44 }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Client Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="client@gmail.com"
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Client Phone / WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                    Venue / Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Taj Lands End, Bandra, Mumbai"
                                    value={venueName}
                                    onChange={(e) => setVenueName(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Total Package (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={totalAmount}
                                        onChange={(e) => setTotalAmount(e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.4rem' }}>
                                        Booking Status
                                    </label>
                                    <select
                                        value={eventStatus}
                                        onChange={(e) => setEventStatus(e.target.value)}
                                        style={{ width: '100%', height: 44 }}
                                    >
                                        <option value="confirmed">Confirmed (Active Schedule)</option>
                                        <option value="pending">Pending Client Deposit</option>
                                        <option value="completed">Completed / Delivered</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    id="advance"
                                    checked={advancePaid}
                                    onChange={(e) => setAdvancePaid(e.target.checked)}
                                    style={{ width: 18, height: 18 }}
                                />
                                <label htmlFor="advance" style={{ fontSize: '0.85rem', color: '#e2e8f0', cursor: 'pointer' }}>
                                    Advance deposit collected via Razorpay / Cash
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <button
                                    type="submit"
                                    className="btn btn-cyan"
                                    style={{ flex: 1, padding: '0.85rem', fontWeight: 700 }}
                                >
                                    Confirm & Schedule Shoot
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '0.85rem 1.25rem' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Bookings;
