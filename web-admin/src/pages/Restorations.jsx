import React, { useState, useEffect } from 'react';
import { Wand2, Download, CheckCircle2, AlertCircle, Clock, Sparkles, UploadCloud, Eye, Sliders, ArrowRight } from 'lucide-react';
import api from '../services/api';

const defaultShowcaseRestorations = [
    {
        id: 'rst-001',
        title: '1947 Vintage Wedding Portrait Restoration',
        service_type: 'colorization',
        priority: 'urgent',
        status: 'in_progress',
        customer_name: 'Col. Rajesh Bakshi',
        estimated_price: 6500,
        original_image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        restored_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        created_at: '2026-08-30'
    },
    {
        id: 'rst-002',
        title: 'Torn & Water Damaged Black & White Family Archive',
        service_type: 'reconstruction',
        priority: 'normal',
        status: 'completed',
        customer_name: 'Meenakshi Sundaram',
        estimated_price: 4800,
        original_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        restored_image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        created_at: '2026-08-28'
    },
    {
        id: 'rst-003',
        title: 'Faded 1980 School Graduation Photo AI Upscaling',
        service_type: 'enhancement',
        priority: 'express',
        status: 'pending',
        customer_name: 'Arjun Swaminathan',
        estimated_price: 3200,
        original_image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        restored_image: null,
        created_at: '2026-08-29'
    }
];

function Restorations() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/restoration/');
            const data = response.data;
            const fetched = Array.isArray(data) ? data : (data.results || []);
            setOrders(fetched.length > 0 ? fetched : defaultShowcaseRestorations);
        } catch (error) {
            console.error('Using default showcase restorations:', error);
            setOrders(defaultShowcaseRestorations);
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="gradient-text">AI Photo Restoration Lab</h1>
                        <Sparkles size={20} color="#ec4899" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Colorize, repair torn physical prints, and upscale heritage memories.
                    </p>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={() => alert('Opening AI Batch Restoration Uploader...')}
                >
                    <UploadCloud size={18} /> Upload Photo for Restoration
                </button>
            </div>

            {/* Orders Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order) => {
                    const originalImg = order.original_image || order.images?.find(i => i.image_type === 'original')?.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80';
                    const restoredImg = order.restored_image || order.images?.find(i => i.image_type === 'restored')?.image;

                    return (
                        <div
                            key={order.id}
                            className="card"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '300px 1fr 220px',
                                gap: '2rem',
                                alignItems: 'center',
                                padding: '1.75rem'
                            }}
                        >
                            {/* Before & After Visual Preview */}
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                <div style={{ flex: 1, height: 130, borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-subtle)' }}>
                                    <img src={originalImg} alt="Original" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <span style={{ position: 'absolute', bottom: 6, left: 6, fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: 4, background: 'rgba(0,0,0,0.75)', color: '#fff' }}>
                                        ORIGINAL
                                    </span>
                                </div>

                                <div style={{ color: 'var(--primary-light)' }}>
                                    <ArrowRight size={18} />
                                </div>

                                <div style={{ flex: 1, height: 130, borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.03)' }}>
                                    {restoredImg ? (
                                        <>
                                            <img src={restoredImg} alt="Restored" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <span style={{ position: 'absolute', bottom: 6, left: 6, fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: 4, background: 'var(--grad-primary)', color: '#fff' }}>
                                                AI RESTORED
                                            </span>
                                        </>
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', textAlign: 'center' }}>
                                            <Wand2 size={24} color="#f59e0b" style={{ marginBottom: '0.25rem' }} />
                                            <span style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 700 }}>In Queue</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details */}
                            <div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <span className="badge badge-purple">
                                        {(order.service_type || 'Restoration').toUpperCase()}
                                    </span>
                                    <span className={`badge ${order.priority === 'urgent' ? 'badge-error' : 'badge-info'}`}>
                                        {(order.priority || 'Normal').toUpperCase()} PRIORITY
                                    </span>
                                </div>

                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>
                                    {order.title}
                                </h3>

                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>Client: <strong style={{ color: 'var(--text-primary)' }}>{order.customer_name || 'Customer'}</strong></span>
                                    <span>•</span>
                                    <span style={{ color: '#34d399', fontWeight: 700 }}>Est. ₹{order.estimated_price || 4500}</span>
                                </p>
                            </div>

                            {/* Actions & Deliverables */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
                                <span className={`badge ${
                                    order.status === 'completed' ? 'badge-success' :
                                    order.status === 'in_progress' ? 'badge-info' : 'badge-warning'
                                }`}>
                                    {order.status === 'completed' ? '● Delivered' :
                                     order.status === 'in_progress' ? '● AI Processing' : '● Awaiting Review'}
                                </span>

                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }}>
                                    <button
                                        className="btn btn-secondary"
                                        style={{ padding: '0.5rem 0.75rem' }}
                                        title="Download Raw Source"
                                        onClick={() => window.open(originalImg, '_blank')}
                                    >
                                        <Download size={15} />
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                                        onClick={() => alert(`Upload enhanced output for Order: ${order.id}`)}
                                    >
                                        Upload Result
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Restorations;
