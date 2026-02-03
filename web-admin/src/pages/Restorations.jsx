import React, { useState, useEffect } from 'react';
import { Wand2, Download, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import api from '../services/api';

function Restorations() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/restoration/');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch restoration orders:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div style={{ marginBottom: '2rem' }}>
                <h1>Photo Restoration</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Restore and enhance old or damaged memories</p>
            </div>

            {loading ? (
                <div className="animate-pulse">Loading orders...</div>
            ) : orders.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                    <Wand2 size={64} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <h3>No Orders Yet</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Restoration requests from the mobile app will appear here.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map((order) => (
                        <div key={order.id} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
                            {/* Image Preview */}
                            <div style={{ width: '100%', height: 120, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                <img
                                    src={order.images?.find(img => img.image_type === 'original')?.image}
                                    alt="Original"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Order Info */}
                            <div>
                                <h3 style={{ marginBottom: '0.25rem' }}>{order.title}</h3>
                                <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.5rem', background: 'var(--bg-tertiary)', borderRadius: 4 }}>
                                        {order.service_type.toUpperCase()}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: order.priority === 'urgent' ? 'var(--error)' : 'var(--text-secondary)' }}>
                                        {order.priority.toUpperCase()} PRIORITY
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <Clock size={14} /> Request from {order.customer_name}
                                </div>
                            </div>

                            {/* Status & Actions */}
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <span className={`badge badge-${order.status === 'completed' ? 'success' :
                                        order.status === 'pending' ? 'warning' : 'info'
                                        }`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-secondary" style={{ padding: '0.5rem' }}>
                                        <Download size={16} />
                                    </button>
                                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                                        Upload Result
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Restorations;
