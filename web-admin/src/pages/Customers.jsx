import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            // Fetching all users with type customer from Django
            const response = await api.get('/auth/studios/'); // Using studios list as a proxy or dedicated customer endpoint
            setCustomers(response.data);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div style={{ marginBottom: '2rem' }}>
                <h1>Customers</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage and view your client database</p>
            </div>

            <div className="card" style={{ padding: 0 }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Contact Info</th>
                            <th>Location</th>
                            <th>Member Since</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
                        ) : customers.length === 0 ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No customers found</td></tr>
                        ) : (
                            customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary), #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                                                {customer.user?.first_name?.[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{customer.user?.first_name} {customer.user?.last_name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {customer.id.substring(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Mail size={14} color="var(--text-muted)" /> {customer.user?.email}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Phone size={14} color="var(--text-muted)" /> {customer.user?.phone}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                                            <MapPin size={14} /> {customer.city}, {customer.state}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-secondary)' }}>
                                            <Calendar size={14} /> {format(new Date(customer.created_at), 'MMM yyyy')}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">Active</span>
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

export default Customers;
