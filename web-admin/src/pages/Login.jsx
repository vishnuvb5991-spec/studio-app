import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Eye, EyeOff, Sparkles, ShieldCheck, ShieldAlert, ArrowRight, Lock, CheckCircle2, Loader2 } from 'lucide-react';

function Login() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
    const [googleLoading, setGoogleLoading] = useState(false);

    const { login, loginWithGoogle, requestAccess, verifyOwnerPin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setError('');
        setPinError('');
        setGoogleLoading(true);
        const result = await loginWithGoogle();
        setGoogleLoading(false);
        if (result.success) {
            navigate('/dashboard');
        } else if (!result.cancelled) {
            setError(result.error || 'Failed to sign in with Google. Please try again.');
        }
    };

    // Quick-role buttons pre-fill from env vars (values never baked into the source)
    const ADMIN_EMAIL = import.meta.env.VITE_STUDIO_EMAIL || '';
    const ADMIN_PASS  = (import.meta.env.VITE_OWNER_PASSWORDS || '').split(',')[0]?.trim() || '';
    const DEMO_EMAIL  = import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || '';

    const handleQuickRole = (role) => {
        setError('');
        setPinError('');
        setShowPinPrompt(false);
        setCustomerPendingApproval(false);
        if (role === 'admin') {
            setEmail(ADMIN_EMAIL);
            setPassword(ADMIN_PASS);
        } else {
            setEmail(DEMO_EMAIL);
            setPassword('');
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
                        Balan Studios <span style={{ color: '#d97706' }}>Portal</span>
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
                                    Private Security Gate • Studio Owner Authorization Only
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
                            To protect client photo privacy, new customer accounts require Balan Studios owner permission before signing in.
                        </p>
                        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.15rem', textAlign: 'left' }}>
                            <p style={{ fontSize: '0.78rem', color: '#92400e', fontWeight: 700, marginBottom: '0.2rem' }}>
                                🔔 Notification Sent to Studio Owner
                            </p>
                            <p style={{ fontSize: '0.74rem', color: '#78350f', lineHeight: 1.4 }}>
                                An access alert was dispatched to Balan (Studio Owner). Once approved in the Owner Admin Dashboard, you can sign in directly.
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
                            Thank you, <strong>{firstName}</strong>! To ensure client privacy, all customer portals require Balan Studios owner approval before entry.
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
                            Need urgent access? WhatsApp or Call us at <strong style={{ color: '#18181b' }}>{import.meta.env.VITE_STUDIO_PHONE || 'our studio'}</strong>
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
                        {mode === 'login' && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={googleLoading || loading}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.75rem',
                                        padding: '0.825rem 1rem',
                                        borderRadius: '10px',
                                        border: '1.5px solid #e2e8f0',
                                        background: '#ffffff',
                                        color: '#18181b',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: googleLoading ? 'wait' : 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                        transition: 'all 0.2s ease',
                                        marginBottom: '1.25rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#cbd5e1';
                                        e.currentTarget.style.background = '#f8fafc';
                                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.background = '#ffffff';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                    }}
                                >
                                    {googleLoading ? (
                                        <Loader2 size={18} className="spin" color="#18181b" />
                                    ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                        </svg>
                                    )}
                                    <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                                </button>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    marginBottom: '1.25rem',
                                    color: '#94a3b8',
                                    fontSize: '0.75rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                                    <span>or sign in with password</span>
                                    <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
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
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickRole('customer')}
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem 0.6rem',
                                            background: email === DEMO_EMAIL ? '#eff6ff' : '#ffffff',
                                            border: email === DEMO_EMAIL ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                                            borderRadius: '6px',
                                            fontSize: '0.74rem',
                                            fontWeight: 700,
                                            color: email === DEMO_EMAIL ? '#1e40af' : '#475569',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.35rem'
                                        }}
                                    >
                                        👤 Client / Customer (Sample Demo)
                                    </button>
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
