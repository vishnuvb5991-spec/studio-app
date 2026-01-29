import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, MapPin, User, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings/');
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.post(`/bookings/${id}/update_status/`, { status });
            fetchBookings();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1>Bookings</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage photo shoots and event schedules</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} /> Add New Booking
                </button>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Event & Date</th>
                            <th>Customer</th>
                            <th>Location</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : bookings.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No bookings found</td></tr>
                        ) : (
                            bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{booking.event_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={12} /> {format(new Date(booking.event_date), 'MMM dd, yyyy')}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                                                {booking.customer_name[0]}
                                            </div>
                                            {booking.customer_name}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                                            <MapPin size={14} /> {booking.venue_name || 'TBD'}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>₹{booking.total_amount.toLocaleString()}</div>
                                        <div style={{ fontSize: '0.75rem', color: booking.advance_paid ? 'var(--success)' : 'var(--warning)' }}>
                                            {booking.advance_paid ? 'Advance Paid' : 'Payment Pending'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${booking.status === 'confirmed' ? 'success' :
                                                booking.status === 'pending' ? 'warning' : 'info'
                                            }`}>
                                            {booking.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            {booking.status === 'pending' && (
                                                <button
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.4rem', color: 'var(--success)' }}
                                                    onClick={() => updateStatus(booking.id, 'confirmed')}
                                                    title="Confirm"
                                                >
                                                    <CheckCircle2 size={16} />
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem', color: 'var(--error)' }}
                                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                                title="Cancel"
                                            >
                                                <XCircle size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Bookings;
