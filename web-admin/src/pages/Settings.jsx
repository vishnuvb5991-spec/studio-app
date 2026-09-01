import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Save, ShieldCheck, Key, Image, Bell, CheckCircle2, Lock } from 'lucide-react';

function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('general');
    const [savedNotice, setSavedNotice] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
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
                        <h1 className="gradient-text">Studio Configurations</h1>
                        <Sparkles size={20} color="#8b5cf6" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Configure payment gateways, studio branding, watermarks & API webhooks.
                    </p>
                </div>

                {savedNotice && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.25rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        color: '#34d399',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                    }}>
                        <CheckCircle2 size={16} /> Changes saved successfully to live environment!
                    </div>
                )}
            </div>

            {/* Settings Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                background: 'rgba(20, 24, 48, 0.6)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                width: 'fit-content'
            }}>
                {[
                    { id: 'general', label: 'Studio Profile' },
                    { id: 'payments', label: 'Razorpay Gateway' },
                    { id: 'media', label: 'Gallery Watermark & CDN' },
                    { id: 'security', label: 'Security & Access' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.5rem 1.2rem',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeTab === tab.id ? 'var(--grad-primary)' : 'transparent',
                            color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.825rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Contents */}
            <div style={{ maxWidth: 780 }}>
                {activeTab === 'general' && (
                    <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Studio Brand & Contact Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label>Studio Business Name</label>
                                <input type="text" defaultValue="Studio Pro Photography & Films" />
                            </div>
                            <div>
                                <label>GSTIN / Tax ID</label>
                                <input type="text" defaultValue="27AABCS1429B1ZB" />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label>Owner First Name</label>
                                <input type="text" defaultValue={user?.first_name || 'Admin'} />
                            </div>
                            <div>
                                <label>Owner Last Name</label>
                                <input type="text" defaultValue={user?.last_name || 'Owner'} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
                            <div>
                                <label>Registered Business Email</label>
                                <input type="email" defaultValue={user?.email || 'admin@studio.com'} disabled />
                            </div>
                            <div>
                                <label>Studio WhatsApp / Phone</label>
                                <input type="tel" defaultValue="+91 98200 12345" />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                            <Save size={16} /> Save Changes
                        </button>
                    </form>
                )}

                {activeTab === 'payments' && (
                    <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Razorpay Production Credentials
                            <span className="badge badge-success">Live Ready</span>
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                            Configure your API keys from Razorpay Dashboard (Settings → API Keys)
                        </p>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label>Razorpay Key ID</label>
                            <input type="text" defaultValue="rzp_live_xxxxxxxxxxxxxx" placeholder="rzp_live_..." />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label>Razorpay Key Secret</label>
                            <input type="password" defaultValue="••••••••••••••••••••••••" placeholder="Secret Key" />
                        </div>

                        <div style={{
                            padding: '1rem',
                            background: 'rgba(6, 182, 212, 0.08)',
                            border: '1px solid rgba(6, 182, 212, 0.25)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.75rem',
                            fontSize: '0.85rem',
                            color: '#22d3ee'
                        }}>
                            ⚡ Webhook Endpoint: <strong style={{ color: '#ffffff' }}>https://studio-django-api.onrender.com/api/v1/payments/webhook/</strong>
                        </div>

                        <button type="submit" className="btn btn-cyan" style={{ padding: '0.8rem 1.75rem' }}>
                            <Save size={16} /> Update Payment Gateway
                        </button>
                    </form>
                )}

                {activeTab === 'media' && (
                    <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Client Gallery & Watermark Controls</h3>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label>Default Client Watermark Text</label>
                            <input type="text" defaultValue="STUDIO PRO © 2026 - PREVIEW ONLY" />
                        </div>

                        <div style={{ marginBottom: '1.75rem' }}>
                            <label>Max Download Resolution for Free Guests</label>
                            <select defaultValue="2k">
                                <option value="original">Original Full Uncompressed 4K Raw</option>
                                <option value="2k">High Quality Web (2048px)</option>
                                <option value="1080p">Standard HD (1080px)</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                            <Save size={16} /> Update Media Settings
                        </button>
                    </form>
                )}

                {activeTab === 'security' && (
                    <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={18} color="#ec4899" /> Security & Access Controls
                        </h3>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label>Current Admin Password</label>
                            <input type="password" placeholder="Enter current password" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
                            <div>
                                <label>New Password</label>
                                <input type="password" placeholder="Minimum 8 characters" />
                            </div>
                            <div>
                                <label>Confirm New Password</label>
                                <input type="password" placeholder="Repeat new password" />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                            <Save size={16} /> Update Security Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Settings;
