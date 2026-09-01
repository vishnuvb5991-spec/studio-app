import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, MapPin, CheckCircle2, XCircle, Sparkles, Filter, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
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

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/');
            const data = response.data;
            const fetched = Array.isArray(data) ? data : (data.results || []);
            setBookings(fetched.length > 0 ? fetched : defaultShowcaseBookings);
        } catch (error) {
            console.error('Using default showcase bookings:', error);
            setBookings(defaultShowcaseBookings);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.post(`/bookings/${id}/update_status/`, { status });
            fetchBookings();
        } catch (error) {
            console.error('Status update fallback:', error);
            // Optimistic UI update
            setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
        }
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
                    onClick={() => alert('New Booking Intake Modal')}
                >
                    <Plus size={18} /> Schedule New Event
                </button>
            </div>

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
                            padding: '0.45rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: statusFilter === tab.id ? 'var(--grad-cyan-blue)' : 'transparent',
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

            {/* Bookings Table */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Event & Package</th>
                                <th>Client Contact</th>
                                <th>Venue Location</th>
                                <th>Shoot Date</th>
                                <th>Contract Value</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => {
                                let formattedDate = 'Upcoming';
                                try {
                                    if (booking.event_date) {
                                        formattedDate = format(new Date(booking.event_date), 'MMM dd, yyyy');
                                    }
                                } catch (e) {
                                    formattedDate = booking.event_date;
                                }

                                return (
                                    <tr key={booking.id}>
                                        <td>
                                            <div style={{ fontWeight: 700, color: 'var(--text-pure)', fontSize: '0.95rem' }}>
                                                {booking.event_name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                ID: {String(booking.id).substring(0, 8)}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{booking.customer_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                                <Phone size={12} /> {booking.customer_phone || '+91 98765 43210'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-primary)' }}>
                                                <MapPin size={14} color="#ec4899" />
                                                {booking.venue_name || 'Main Studio'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 700, color: '#22d3ee', fontSize: '0.85rem' }}>
                                                {formattedDate}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1rem' }}>
                                                ₹{Number(booking.total_amount || 0).toLocaleString()}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: booking.advance_paid ? '#34d399' : '#fbbf24', fontWeight: 600 }}>
                                                {booking.advance_paid ? '✓ Advance Paid' : '● Balance Due'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-${
                                                booking.status === 'confirmed' ? 'success' :
                                                booking.status === 'pending' ? 'warning' : 'info'
                                            }`}>
                                                {booking.status?.toUpperCase() || 'CONFIRMED'}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                                                {booking.status === 'pending' && (
                                                    <button
                                                        className="btn btn-secondary"
                                                        style={{ padding: '0.45rem', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                                                        onClick={() => updateStatus(booking.id, 'confirmed')}
                                                        title="Confirm Shoot"
                                                    >
                                                        <CheckCircle2 size={16} />
                                                    </button>
                                                )}
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.45rem', color: '#f87171' }}
                                                    onClick={() => updateStatus(booking.id, 'cancelled')}
                                                    title="Cancel Event"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Bookings;
