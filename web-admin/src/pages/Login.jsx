import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, Lock, User, Mail, Phone, CheckCircle2 } from 'lucide-react';

function Login() {
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [email, setEmail] = useState('admin@studio.com');
    const [password, setPassword] = useState('StudioPro2024!');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleQuickRole = (role) => {
        if (role === 'admin') {
            setEmail('admin@studio.com');
            setPassword('StudioPro2024!');
        } else {
            setEmail('ananya.s@gmail.com');
            setPassword('Customer2024!');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (mode === 'login') {
            const result = await login(email, password);
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Authentication failed. Please check credentials.');
            }
        } else {
            if (!firstName || !email || !password) {
                setError('Please fill all required fields');
                setLoading(false);
                return;
            }
            const result = await register({
                email,
                password,
                firstName,
                lastName,
                phone,
                userType: 'customer'
            });
            if (result.success) {
                navigate('/');
            } else {
                setError(result.error || 'Registration failed.');
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
            background: 'var(--bg-main)'
        }}>
            {/* Ambient Background Lights */}
            <div style={{
                position: 'absolute',
                width: 500,
                height: 500,
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.28) 0%, transparent 70%)',
                top: '-10%',
                left: '-10%',
                filter: 'blur(90px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                width: 500,
                height: 500,
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.22) 0%, transparent 70%)',
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
                background: 'rgba(20, 24, 48, 0.8)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-highlight)',
                boxShadow: 'var(--shadow-lg), 0 0 50px rgba(139, 92, 246, 0.25)',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Brand Logo & Title */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        width: 58,
                        height: 58,
                        background: 'var(--grad-cosmic)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 0 28px var(--primary-glow)',
                    }}>
                        <Camera size={30} color="#ffffff" />
                    </div>
                    
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                        Preetha Studio <span className="gradient-text">Portal</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        Access Photos, Bookings & Restorations on Web or Mobile
                    </p>
                </div>

                {/* Mode Selector Tabs (Sign In vs New Client Register) */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(15, 17, 35, 0.8)',
                    padding: '0.3rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '1.5rem'
                }}>
                    <button
                        type="button"
                        onClick={() => { setMode('login'); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '0.6rem',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            background: mode === 'login' ? 'var(--grad-primary)' : 'transparent',
                            color: mode === 'login' ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.825rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        Client & Studio Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => { setMode('register'); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '0.6rem',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            background: mode === 'register' ? 'var(--grad-primary)' : 'transparent',
                            color: mode === 'register' ? '#ffffff' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.825rem',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        New Customer Sign Up
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        borderRadius: 'var(--radius-md)',
                        color: '#f87171',
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

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1rem' }}>
                                <div>
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Priya"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Patel"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label>Phone / WhatsApp Number</label>
                                <input
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@gmail.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                required
                                style={{ paddingRight: 48 }}
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
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', marginBottom: '1.25rem' }}
                    >
                        {loading ? (
                            <span>Authenticating...</span>
                        ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                {mode === 'login' ? 'Access Portal' : 'Create My Customer Account'} <ArrowRight size={17} />
                            </span>
                        )}
                    </button>
                </form>

                {/* Quick Role Fillers for Demonstration */}
                {mode === 'login' && (
                    <div style={{
                        padding: '0.85rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '1.25rem'
                    }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
                            Quick Fill Test Accounts:
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => handleQuickRole('admin')}
                                style={{
                                    flex: 1,
                                    padding: '0.4rem',
                                    borderRadius: 'var(--radius-xs)',
                                    background: 'rgba(139, 92, 246, 0.15)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    color: '#c084fc',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                👑 Studio Owner
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickRole('customer')}
                                style={{
                                    flex: 1,
                                    padding: '0.4rem',
                                    borderRadius: 'var(--radius-xs)',
                                    background: 'rgba(6, 182, 212, 0.15)',
                                    border: '1px solid rgba(6, 182, 212, 0.3)',
                                    color: '#22d3ee',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                }}
                            >
                                👤 Client / Customer
                            </button>
                        </div>
                    </div>
                )}

                {/* Device sync note */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                }}>
                    <ShieldCheck size={16} color="#34d399" />
                    <span>Works with Mobile App & Web Browser</span>
                </div>
            </div>
        </div>
    );
}

export default Login;
