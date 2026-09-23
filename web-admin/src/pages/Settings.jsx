import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Sparkles, Save, Lock, CheckCircle2, User, Phone,
    Mail, Bell, Smartphone, ShieldCheck, Key, Image
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER profile settings — only personal info, no studio config
// ─────────────────────────────────────────────────────────────────────────────
function CustomerProfileSettings({ user, handleSave, savedNotice }) {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h1 className="gradient-text">Profile Settings</h1>
                        <User size={20} color="#d97706" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Manage your personal details, notifications and account security.
                    </p>
                </div>
                {savedNotice && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.65rem 1.25rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        color: '#059669', fontWeight: 700, fontSize: '0.85rem'
                    }}>
                        <CheckCircle2 size={16} /> Saved successfully!
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap',
                background: '#fafaf9', padding: '0.35rem',
                borderRadius: 'var(--radius-lg)', border: '1px solid #e5e7eb',
                width: 'fit-content'
            }}>
                {[
                    { id: 'profile', label: '👤 My Profile' },
                    { id: 'notifications', label: '🔔 Notifications' },
                    { id: 'security', label: '🔒 Change Password' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.5rem 1.2rem', borderRadius: 'var(--radius-md)', border: 'none',
                            background: activeTab === tab.id ? 'var(--grad-primary)' : 'transparent',
                            color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ maxWidth: 620 }}>
                {/* ── Profile Tab ── */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                        {/* Avatar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem' }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: '50%',
                                background: 'var(--grad-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.75rem', fontWeight: 800, color: '#fff',
                                boxShadow: '0 8px 24px var(--primary-glow)'
                            }}>
                                {(user?.first_name?.[0] || user?.email?.[0] || 'A').toUpperCase()}
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-pure)' }}>
                                    {user?.first_name || 'Valued'} {user?.last_name || 'Client'}
                                </p>
                                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{user?.email}</p>
                                <span style={{ fontSize: '0.72rem', background: 'rgba(6,182,212,0.15)', color: '#22d3ee', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 700 }}>
                                    CLIENT ACCOUNT
                                </span>
                            </div>
                        </div>

                        <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Personal Information</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <User size={13} /> First Name
                                </label>
                                <input type="text" defaultValue={user?.first_name || ''} placeholder="Your first name" />
                            </div>
                            <div>
                                <label>Last Name</label>
                                <input type="text" defaultValue={user?.last_name || ''} placeholder="Your last name" />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Mail size={13} /> Email Address
                            </label>
                            <input type="email" defaultValue={user?.email || ''} disabled
                                style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                                Email cannot be changed. Contact the studio if needed.
                            </p>
                        </div>

                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Phone size={13} /> WhatsApp / Phone Number
                            </label>
                            <input type="tel" placeholder="+91 98765 43210" />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem' }}>
                            <Save size={16} /> Save Profile
                        </button>
                    </form>
                )}

                {/* ── Notifications Tab ── */}
                {activeTab === 'notifications' && (
                    <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Bell size={18} color="#d97706" /> Notification Preferences
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.75rem' }}>
                            Choose how Preetha Studio contacts you about your bookings and album deliveries.
                        </p>

                        {[
                            { label: 'Booking Confirmation', desc: 'Get notified when your shoot is confirmed by the studio', defaultChecked: true },
                            { label: 'Album Ready to Download', desc: 'Instant notification when your event gallery is delivered', defaultChecked: true },
                            { label: 'Payment Receipt', desc: 'Receive email/SMS receipt after every successful payment', defaultChecked: true },
                            { label: 'Shoot Reminders', desc: 'Reminder 24 hrs and 2 hrs before your scheduled shoot', defaultChecked: false },
                            { label: 'Studio Offers & Packages', desc: 'Seasonal offers, festival packages and referral discounts', defaultChecked: false },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '1rem 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                            }}>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-pure)', marginBottom: '0.2rem' }}>
                                        {item.label}
                                    </p>
                                    <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: 42, height: 24, flexShrink: 0, marginLeft: '1rem' }}>
                                    <input type="checkbox" defaultChecked={item.defaultChecked} style={{ opacity: 0, width: 0, height: 0 }} />
                                    <span style={{
                                        position: 'absolute', cursor: 'pointer', inset: 0,
                                        background: item.defaultChecked ? 'var(--grad-primary)' : 'rgba(255,255,255,0.1)',
                                        borderRadius: '999px', transition: '0.3s'
                                    }}>
                                        <span style={{
                                            position: 'absolute', width: 18, height: 18,
                                            borderRadius: '50%', background: '#fff',
                                            top: 3, left: item.defaultChecked ? 21 : 3, transition: '0.3s'
                                        }} />
                                    </span>
                                </label>
                            </div>
                        ))}

                        <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.75rem', marginTop: '1.5rem' }}>
                            <Save size={16} /> Save Preferences
                        </button>
                    </form>
                )}

                {/* ── Security Tab ── */}
                {activeTab === 'security' && (
                    <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={18} color="#d97706" /> Change Password
                        </h3>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label>Current Password</label>
                            <input type="password" placeholder="Enter your current password" />
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
                            <ShieldCheck size={16} /> Update Password
                        </button>

                        {/* Danger Zone */}
                        <div style={{
                            marginTop: '2.5rem', padding: '1.25rem',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 'var(--radius-md)',
                            background: 'rgba(239,68,68,0.05)'
                        }}>
                            <p style={{ fontWeight: 700, color: '#f87171', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
                                ⚠️ Deactivate My Account
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Permanently removes your account and all associated data. This cannot be undone.
                            </p>
                            <button
                                type="button"
                                className="btn"
                                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.35)', padding: '0.55rem 1.1rem', fontSize: '0.82rem', fontWeight: 700 }}
                                onClick={() => alert('Please contact the studio at admin@studio.com to deactivate your account.')}
                            >
                                Request Account Deletion
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// OWNER studio configuration — full admin panel
// ─────────────────────────────────────────────────────────────────────────────
function OwnerStudioSettings({ user, handleSave, savedNotice }) {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h1 className="gradient-text">Studio Configurations</h1>
                        <Sparkles size={20} color="#d97706" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Configure payment gateways, studio branding, watermarks &amp; API webhooks.
                    </p>
                </div>
                {savedNotice && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.65rem 1.25rem',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        borderRadius: 'var(--radius-md)',
                        color: '#059669', fontWeight: 700, fontSize: '0.85rem'
                    }}>
                        <CheckCircle2 size={16} /> Changes saved successfully to live environment!
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap',
                background: '#fafaf9', padding: '0.35rem',
                borderRadius: 'var(--radius-lg)', border: '1px solid #e5e7eb',
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
                            padding: '0.5rem 1.2rem', borderRadius: 'var(--radius-md)', border: 'none',
                            background: activeTab === tab.id ? 'var(--grad-primary)' : 'transparent',
                            color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div style={{ maxWidth: 780 }}>
                {activeTab === 'general' && (
                    <form onSubmit={handleSave} className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            Studio Brand &amp; Contact Details
                        </h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                            <div>
                                <label>Studio Business Name</label>
                                <input type="text" defaultValue="Preetha Studio Photography & Films" />
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
                                <input type="tel" defaultValue="+91 8129788272" />
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
                            padding: '1rem', background: 'rgba(6,182,212,0.08)',
                            border: '1px solid rgba(6,182,212,0.25)', borderRadius: 'var(--radius-md)',
                            marginBottom: '1.75rem', fontSize: '0.85rem', color: '#22d3ee'
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
                        <h3 style={{ marginBottom: '1.5rem' }}>Client Gallery &amp; Watermark Controls</h3>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label>Default Client Watermark Text</label>
                            <input type="text" defaultValue="PREETHA STUDIO © 2026 - PREVIEW ONLY" />
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
                            <Lock size={18} color="#d97706" /> Security &amp; Access Controls
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

// ─────────────────────────────────────────────────────────────────────────────
// Root export — switches view based on role
// ─────────────────────────────────────────────────────────────────────────────
function Settings() {
    const { user, isStudioOwner, viewMode } = useAuth();
    const [savedNotice, setSavedNotice] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    // Customer sees personal profile; owner always sees studio config
    const isCustomerView = !isStudioOwner || viewMode === 'customer';

    if (isCustomerView) {
        return <CustomerProfileSettings user={user} handleSave={handleSave} savedNotice={savedNotice} />;
    }
    return <OwnerStudioSettings user={user} handleSave={handleSave} savedNotice={savedNotice} />;
}

export default Settings;
