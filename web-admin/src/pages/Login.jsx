import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, Lock } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('admin@studio.com');
    const [password, setPassword] = useState('StudioPro2024!');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Authentication failed. Please verify credentials.');
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
            {/* Ambient Animated Light Orbs */}
            <div style={{
                position: 'absolute',
                width: 450,
                height: 450,
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                top: '-10%',
                left: '-10%',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                width: 450,
                height: 450,
                background: 'radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%)',
                bottom: '-10%',
                right: '-10%',
                filter: 'blur(80px)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                width: 350,
                height: 350,
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
                top: '50%',
                left: '60%',
                filter: 'blur(90px)',
                pointerEvents: 'none'
            }} />

            {/* Login Card */}
            <div style={{
                width: '100%',
                maxWidth: 460,
                padding: '2.75rem 2.5rem',
                background: 'rgba(20, 24, 48, 0.75)',
                backdropFilter: 'blur(28px)',
                WebkitBackdropFilter: 'blur(28px)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-highlight)',
                boxShadow: 'var(--shadow-lg), 0 0 50px rgba(139, 92, 246, 0.2)',
                position: 'relative',
                zIndex: 10
            }}>
                {/* Brand Badge */}
                <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'var(--grad-cosmic)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1.25rem',
                        boxShadow: '0 0 30px var(--primary-glow)',
                    }}>
                        <Camera size={34} color="#ffffff" />
                    </div>
                    
                    <h1 style={{ fontSize: '1.85rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                        Studio Pro <span className="gradient-text">Portal</span>
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Enterprise Photography & Client Studio Management
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div style={{
                        padding: '0.85rem 1.15rem',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        borderRadius: 'var(--radius-md)',
                        color: '#f87171',
                        marginBottom: '1.5rem',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <Lock size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <label>Admin Work Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@studio.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '1.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                            <label style={{ margin: 0 }}>Password</label>
                            <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', cursor: 'pointer' }}>
                                Studio Protected
                            </span>
                        </div>
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
                        style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}
                    >
                        {loading ? (
                            <span>Authenticating Security Credentials...</span>
                        ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                                Access Admin Dashboard <ArrowRight size={18} />
                            </span>
                        )}
                    </button>
                </form>

                {/* Secure Trust Badge */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '1.25rem'
                }}>
                    <ShieldCheck size={16} color="#34d399" />
                    <span>256-Bit Encrypted Studio Session • Single Sign-On Ready</span>
                </div>
            </div>
        </div>
    );
}

export default Login;
