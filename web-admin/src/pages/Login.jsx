import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Eye, EyeOff, Sparkles, ShieldCheck, ShieldAlert, ArrowRight, Lock, CheckCircle2, Loader2 } from 'lucide-react';

function Login() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('admin@studio.com');
    const [password, setPassword] = useState('StudioPro2024!');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [eventType, setEventType] = useState('Wedding Photography');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

    // Security Gate for Sample Admin Login & Customer Approval
    const [showPinPrompt, setShowPinPrompt] = useState(false);
    const [ownerPin, setOwnerPin] = useState('');
    const [trustThisDevice, setTrustThisDevice] = useState(true);
    const [pinError, setPinError] = useState('');
    const [customerPendingApproval, setCustomerPendingApproval] = useState(false);

    const { login, requestAccess, verifyOwnerPin } = useAuth();
    const navigate = useNavigate();

    const handleQuickRole = (role) => {
        setError('');
        setPinError('');
        setShowPinPrompt(false);
        setCustomerPendingApproval(false);
        if (role === 'admin') {
            setEmail('admin@studio.com');
            setPassword('StudioPro2024!');
        } else {
            setEmail('ananya.s@gmail.com');
            setPassword('Customer2024!');
        }
    };

    const handlePinSubmit = async (e) => {
        e.preventDefault();
        setPinError('');
        setLoading(true);
        const result = await verifyOwnerPin(ownerPin, trustThisDevice);
        if (result.success) {
            setShowPinPrompt(false);
            navigate('/dashboard');
        } else {
            setPinError(result.error || 'Incorrect Owner PIN.');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPinError('');
        setCustomerPendingApproval(false);
        setLoading(true);

        if (mode === 'login') {
            const result = await login(email, password);
            if (result.success) {
                navigate('/dashboard');
            } else if (result.requireOwnerPin) {
                setShowPinPrompt(true);
                setPinError(result.error);
            } else if (result.pendingApproval) {
                setCustomerPendingApproval(true);
            } else {
                setError(result.error || 'Authentication failed. Please check credentials.');
            }
        } else {
            if (!firstName.trim() || !email.trim() || !phone.trim()) {
                setError('Please provide your name, email, and phone number.');
                setLoading(false);
                return;
            }
            const result = await requestAccess({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                eventType
            });
            if (result.success) {
                setRequestSuccess(true);
            } else {
                setError(result.error || 'Registration request failed.');
            }
        }

        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '1.5rem',
            background: 'linear-gradient(180deg, #f5f5f0 0%, #ebe7dc 100%)'
        }}>
            {/* Ambient Background Warm Glows */}
            <div style={{
                position: 'absolute',
                width: 500,
                height: 500,
                background: 'radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 70%)',
                top: '-10%',
                left: '-10%',
                filter: 'blur(90px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                width: 500,
                height: 500,
                background: 'radial-gradient(circle, rgba(180, 83, 9, 0.08) 0%, transparent 70%)',
                bottom: '-10%',
                right: '-10%',
                filter: 'blur(90px)',
                pointerEvents: 'none'
            }} />

            {/* Main Portal Card */}
            <div style={{
                width: '100%',
                maxWidth: 480,
                padding: '2.5rem 2.25rem',
                background: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #e5e7eb',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.08), 0 0 25px rgba(217, 119, 6, 0.06)',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Brand Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        background: '#18181b',
                        borderRadius: 'var(--radius-lg)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 16px rgba(24, 24, 27, 0.25)',
                    }}>
                        <Camera size={28} color="#fde68a" />
                    </div>
                    
                    <h1 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '1.75rem',
                        fontWeight: 600,
                        color: '#18181b',
                        marginBottom: '0.25rem'
                    }}>
                        Preetha Studio <span style={{ color: '#d97706' }}>Portal</span>
                    </h1>
                    <p style={{ color: '#52525b', fontSize: '0.85rem' }}>
                        Access Photos, Bookings & Restorations on Web or Mobile
                    </p>
                </div>

                {/* Mode Selector Tabs (Sign In vs New Client Register) */}
                <div style={{
                    display: 'flex',
                    background: '#f4f4f5',
                    padding: '0.3rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #e4e4e7',
                    marginBottom: '1.5rem'
                }}>
                    <button
                        type="button"
                        onClick={() => { setMode('login'); setError(''); setRequestSuccess(false); }}
                        style={{
                            flex: 1,
                            padding: '0.6rem',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            background: mode === 'login' ? '#18181b' : 'transparent',
                            color: mode === 'login' ? '#ffffff' : '#52525b',
                            fontWeight: 700,
                            fontSize: '0.825rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('register'); setError(''); setRequestSuccess(false); }}
                        style={{
                            flex: 1,
                            padding: '0.6rem',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            background: mode === 'register' ? '#18181b' : 'transparent',
                            color: mode === 'register' ? '#ffffff' : '#52525b',
                            fontWeight: 700,
                            fontSize: '0.825rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        Request Client Access
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 'var(--radius-md)',
                        color: '#991b1b',
                        marginBottom: '1.25rem',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Lock size={15} />
                        <span>{error}</span>
                    </div>
                )}

                {showPinPrompt ? (
                    <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                        <div style={{ width: 52, height: 52, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                            <ShieldAlert size={26} color="#dc2626" />
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: '#18181b', marginBottom: '0.35rem' }}>
                            Studio Owner Verification
                        </h3>
                        <p style={{ color: '#52525b', fontSize: '0.8rem', lineHeight: 1.45, marginBottom: '1rem' }}>
                            You are signing in with administrative credentials on an unrecognized device. Please enter your <strong>Owner Master PIN</strong> to continue.
                        </p>

                        {pinError && (
                            <div style={{ padding: '0.6rem 0.8rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.78rem', marginBottom: '0.85rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={14} />{pinError}
                            </div>
                        )}

                        <form onSubmit={handlePinSubmit}>
                            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                                <label style={{ color: '#52525b', fontSize: '0.72rem', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Enter 4-Digit Owner PIN *</label>
                                <input
                                    type="password"
                                    maxLength={8}
                                    value={ownerPin}
                                    onChange={(e) => setOwnerPin(e.target.value)}
                                    placeholder="••••"
                                    autoFocus
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        textAlign: 'center',
                                        fontSize: '1.35rem',
                                        letterSpacing: '0.35rem',
                                        fontWeight: 700,
                                        borderRadius: '8px',
                                        border: '2px solid #d97706',
                                        background: '#fffbeb',
                                        color: '#78350f'
                                    }}
                                />
                                <p style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '0.35rem', textAlign: 'center' }}>
                                    Default Owner PIN: <strong>5991</strong> or <strong>8272</strong>
                                </p>
                            </div>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.76rem', color: '#52525b', cursor: 'pointer', marginBottom: '1rem', textAlign: 'left' }}>
                                <input
                                    type="checkbox"
                                    checked={trustThisDevice}
                                    onChange={(e) => setTrustThisDevice(e.target.checked)}
                                    style={{ width: '15px', height: '15px', accentColor: '#18181b' }}
                                />
                                <span>Trust this personal device (Don't ask PIN again here)</span>
                            </label>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => { setShowPinPrompt(false); setPinError(''); }}
                                    style={{ padding: '0.7rem', background: '#f4f4f5', border: 'none', borderRadius: '8px', color: '#52525b', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ padding: '0.7rem', background: '#18181b', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                                >
                                    {loading ? <Loader2 size={14} className="animate-spin" /> : 'Verify & Enter'}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : customerPendingApproval ? (
                    <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
                        <div style={{ width: 52, height: 52, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                            <ShieldAlert size={26} color="#d97706" />
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 600, color: '#18181b', marginBottom: '0.35rem' }}>
                            Client Access Pending Approval
                        </h3>
                        <p style={{ color: '#52525b', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                            To protect client photo privacy, new customer accounts require Preetha Studio owner permission before signing in.
                        </p>
                        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.15rem', textAlign: 'left' }}>
                            <p style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 700, marginBottom: '0.2rem' }}>
                                🔔 Notification Sent to Studio Owner
                            </p>
                            <p style={{ fontSize: '0.74rem', color: '#78350f', lineHeight: 1.4 }}>
                                An access alert was dispatched to Vishnu (Studio Owner). Once approved in the Owner Admin Dashboard, you can sign in directly.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setCustomerPendingApproval(false); }}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.7rem', background: '#18181b', color: '#ffffff', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem' }}
                        >
                            Back to Sign In
                        </button>
                    </div>
                ) : requestSuccess ? (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <div style={{ width: 52, height: 52, background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                            <CheckCircle2 size={26} color="#059669" />
                        </div>
                        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.35rem', fontWeight: 600, color: '#18181b', marginBottom: '0.4rem' }}>
                            Access Request Submitted!
                        </h3>
                        <p style={{ color: '#52525b', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '1.15rem' }}>
                            Thank you, <strong>{firstName}</strong>! To ensure client privacy, all customer portals require Preetha Studio owner approval before entry.
                        </p>
                        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem', textAlign: 'left' }}>
                            <p style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 700, marginBottom: '0.2rem' }}>
                                🔔 Studio Owner Alerted
                            </p>
                            <p style={{ fontSize: '0.74rem', color: '#78350f', lineHeight: 1.4 }}>
                                The studio has received your access request for <strong>{eventType}</strong>. You will be able to sign in once approved by management.
                            </p>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '1.25rem' }}>
                            Need urgent access? WhatsApp or Call us at <strong style={{ color: '#18181b' }}>+91 8129788272</strong>
                        </p>
                        <button
                            type="button"
                            onClick={() => { setRequestSuccess(false); setMode('login'); }}
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '0.75rem', background: '#18181b', color: '#ffffff', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            Return to Sign In
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {mode === 'register' && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ color: '#52525b', fontSize: '0.75rem' }}>First Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Priya"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ color: '#52525b', fontSize: '0.75rem' }}>Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Patel"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ color: '#52525b', fontSize: '0.75rem' }}>Phone / WhatsApp Number *</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ color: '#52525b', fontSize: '0.75rem' }}>Event / Shoot Type</label>
                                    <select
                                        value={eventType}
                                        onChange={(e) => setEventType(e.target.value)}
                                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b', fontSize: '0.85rem' }}
                                    >
                                        <option value="Wedding Photography">Wedding Photography</option>
                                        <option value="Pre-Wedding / Post-Wedding">Pre-Wedding / Post-Wedding</option>
                                        <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
                                        <option value="Birthday / Family Function">Birthday / Family Function</option>
                                        <option value="Old Photo Restoration">Old Photo Restoration</option>
                                        <option value="Other Commercial Project">Other Commercial Project</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ color: '#52525b', fontSize: '0.75rem' }}>Email Address *</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@gmail.com"
                                required
                                style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }}
                            />
                        </div>

                        {mode === 'login' && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ color: '#52525b', fontSize: '0.75rem' }}>Password *</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        style={{ paddingRight: 48, background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute',
                                            right: 14,
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#71717a',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                fontSize: '0.95rem',
                                marginBottom: '1rem',
                                background: '#18181b',
                                color: '#ffffff',
                                borderRadius: '8px'
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Loader2 size={16} className="animate-spin" /> Processing...
                                </span>
                            ) : (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {mode === 'login' ? 'Sign In to Portal' : 'Submit Access Request'} <ArrowRight size={17} />
                                </span>
                            )}
                        </button>

                        {/* 1-Click Fast Access Demo Buttons */}
                        {mode === 'login' && (
                            <div style={{
                                marginTop: '0.5rem',
                                marginBottom: '1rem',
                                padding: '0.75rem',
                                background: '#f8fafc',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                textAlign: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.5rem', color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                    <Sparkles size={12} color="#d97706" /> Fast 1-Click Demo Credentials
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickRole('admin')}
                                        style={{
                                            padding: '0.5rem 0.4rem',
                                            background: email === 'admin@studio.com' ? '#fef3c7' : '#ffffff',
                                            border: email === 'admin@studio.com' ? '1px solid #f59e0b' : '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            color: email === 'admin@studio.com' ? '#92400e' : '#475569',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.3rem'
                                        }}
                                    >
                                        👑 Studio Owner
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickRole('customer')}
                                        style={{
                                            padding: '0.5rem 0.4rem',
                                            background: email === 'ananya.s@gmail.com' ? '#eff6ff' : '#ffffff',
                                            border: email === 'ananya.s@gmail.com' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            color: email === 'ananya.s@gmail.com' ? '#1e40af' : '#475569',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.3rem'
                                        }}
                                    >
                                        👤 Client / Customer
                                    </button>
                                </div>
                                <div style={{ marginTop: '0.45rem', fontSize: '0.67rem', color: '#94a3b8' }}>
                                    Protected by Owner PIN (5991) on untrusted devices
                                </div>
                            </div>
                        )}
                    </form>
                )}



                {/* Device sync note */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontSize: '0.75rem',
                    color: '#71717a'
                }}>
                    <ShieldCheck size={16} color="#059669" />
                    <span>Works with Mobile App & Web Browser</span>
                </div>
            </div>
        </div>
    );
}

export default Login;
