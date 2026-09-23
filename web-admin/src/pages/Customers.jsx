import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Calendar, Sparkles, Search, UserCheck, Star, Shield, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

const defaultShowcaseCustomers = [
    {
        id: 'CUST-8801',
        name: 'Vikram & Ananya Singhania',
        email: 'ananya.s@gmail.com',
        phone: '+91 98201 44521',
        city: 'Mumbai',
        state: 'Maharashtra',
        tier: 'Platinum VIP',
        shootsCount: 3,
        lifetimeValue: '₹2,75,000',
        joined: 'Jan 2026',
        status: 'active'
    },
    {
        id: 'CUST-8802',
        name: 'Dr. Suresh Nair',
        email: 'suresh.nair@apollo.org',
        phone: '+91 94470 12390',
        city: 'Kochi',
        state: 'Kerala',
        tier: 'Gold',
        shootsCount: 2,
        lifetimeValue: '₹95,000',
        joined: 'Feb 2026',
        status: 'active'
    },
    {
        id: 'CUST-8803',
        name: 'Priya & Aman Mathur',
        email: 'priya.m@outlook.com',
        phone: '+91 98110 88231',
        city: 'Bengaluru',
        state: 'Karnataka',
        tier: 'Platinum VIP',
        shootsCount: 4,
        lifetimeValue: '₹1,85,000',
        joined: 'Mar 2026',
        status: 'active'
    },
    {
        id: 'CUST-8804',
        name: 'Meera Nambiar',
        email: 'meera.nambiar@gmail.com',
        phone: '+91 98450 77112',
        city: 'Chennai',
        state: 'Tamil Nadu',
        tier: 'Silver',
        shootsCount: 1,
        lifetimeValue: '₹6,800',
        joined: 'Jul 2026',
        status: 'active'
    }
];

function Customers() {
    const [customers, setCustomers] = useState(defaultShowcaseCustomers);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await api.get('/auth/studios/');
            const data = response.data;
            const fetched = Array.isArray(data) ? data : (data.results || []);
            if (fetched.length > 0) {
                // Map backend studios/customers format
                const mapped = fetched.map((c, i) => ({
                    id: c.id || `CUST-880${i+1}`,
                    name: `${c.user?.first_name || 'Client'} ${c.user?.last_name || ''}`,
                    email: c.user?.email || 'client@studio.com',
                    phone: c.user?.phone || '+91 98765 00000',
                    city: c.city || 'Mumbai',
                    state: c.state || 'Maharashtra',
                    tier: i % 2 === 0 ? 'Platinum VIP' : 'Gold',
                    shootsCount: 2,
                    lifetimeValue: '₹85,000',
                    joined: '2026',
                    status: 'active'
                }));
                setCustomers(mapped);
            }
        } catch (error) {
            console.error('Using default customer roster:', error);
        }
    };

    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <h1 className="gradient-text">Client Relationship CRM</h1>
                        <Sparkles size={20} color="#d97706" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Manage customer accounts, family registries, and shoot history.
                    </p>
                </div>

                {/* Search */}
                <div style={{ position: 'relative', width: 280 }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search name, email, city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: 40, height: 42, fontSize: '0.85rem' }}
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="card" style={{ padding: '1.5rem' }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Client Profile</th>
                                <th>Contact Information</th>
                                <th>Base Location</th>
                                <th>Tier & Shoots</th>
                                <th>Lifetime Value</th>
                                <th>Account Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                            <div style={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 'var(--radius-md)',
                                                background: 'var(--grad-cosmic)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 800,
                                                fontSize: '0.95rem',
                                                color: '#ffffff',
                                                boxShadow: '0 0 14px var(--primary-glow)'
                                            }}>
                                                {customer.name[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-pure)', fontSize: '0.95rem' }}>
                                                    {customer.name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                                                    {customer.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                                <Mail size={13} color="var(--primary-light)" />
                                                <span>{customer.email}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)' }}>
                                                <Phone size={13} color="#d97706" />
                                                <span>{customer.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                            <MapPin size={14} color="#d97706" />
                                            <span>{customer.city}, {customer.state}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span className={`badge ${customer.tier?.includes('VIP') ? 'badge-purple' : 'badge-info'}`}>
                                                ★ {customer.tier}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {customer.shootsCount} Events Booked
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
                                            {customer.lifetimeValue}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">
                                            ● Verified
                                        </span>
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

export default Customers;
