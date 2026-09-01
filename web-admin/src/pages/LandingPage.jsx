import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Camera,
    Sparkles,
    ArrowRight,
    Play,
    CheckCircle2,
    Image as ImageIcon,
    Calendar,
    Wand2,
    Smartphone,
    Shield,
    X,
    Eye,
    EyeOff,
    Lock,
    ExternalLink,
    Star,
    Layers,
    ChevronRight,
    Loader2
} from 'lucide-react';

export default function LandingPage() {
    const { isAuthenticated, isCustomer, isStudioOwner, login, register, user } = useAuth();
    const navigate = useNavigate();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Auto warm-up Render backend in background as soon as page loads
    useEffect(() => {
        const pingUrl = 'https://studio-django-api.onrender.com/api/v1/bookings/dashboard_stats/';
        fetch(pingUrl, { method: 'GET', mode: 'cors' }).catch(() => {});
    }, []);

    // Auth Form States
    const [email, setEmail] = useState('admin@studio.com');
    const [password, setPassword] = useState('StudioPro2024!');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const handleQuickRole = (role) => {
        if (role === 'admin') {
            setEmail('admin@studio.com');
            setPassword('StudioPro2024!');
        } else {
            setEmail('ananya.s@gmail.com');
            setPassword('Customer2024!');
        }
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        if (authMode === 'login') {
            const result = await login(email, password);
            if (result.success) {
                setIsAuthModalOpen(false);
                navigate('/dashboard');
            } else {
                setAuthError(result.error || 'Invalid credentials');
            }
        } else {
            if (!firstName || !email || !password) {
                setAuthError('Please fill all required fields');
                setAuthLoading(false);
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
                setIsAuthModalOpen(false);
                navigate('/dashboard');
            } else {
                setAuthError(result.error || 'Registration failed');
            }
        }

        setAuthLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#ecebe6',
            color: '#1a1a1a',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            position: 'relative',
            overflowX: 'hidden'
        }}>
            {/* Top Minimalist Floating Pill Navigation Bar (Antimetal Style) */}
            <header style={{
                position: 'fixed',
                top: 24,
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 40px',
                zIndex: 100,
                maxWidth: 1400,
                margin: '0 auto'
            }}>
                {/* Left Links Pill */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    padding: '0.65rem 1.5rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                }}>
                    <a href="#services" style={{ color: '#404040', textDecoration: 'none' }}>Services</a>
                    <a href="#galleries" style={{ color: '#404040', textDecoration: 'none' }}>Galleries</a>
                    <a href="#restoration" style={{ color: '#404040', textDecoration: 'none' }}>AI Restoration</a>
                    <a href="#mobile-app" style={{ color: '#404040', textDecoration: 'none' }}>Mobile App</a>
                </div>

                {/* Center Brand Pill */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.75)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    padding: '0.65rem 1.75rem',
                    borderRadius: '9999px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em'
                }}>
                    <Camera size={18} color="#1a1a1a" />
                    <span>Studio Pro</span>
                </div>

                {/* Right Action Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {isAuthenticated ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: '#18181b',
                                color: '#ffffff',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '9999px',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            <span>Open {isCustomer ? 'Client Portal' : 'Command Center'}</span>
                            <ArrowRight size={15} />
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setAuthMode('login');
                                    setIsAuthModalOpen(true);
                                }}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.75)',
                                    backdropFilter: 'blur(16px)',
                                    color: '#1a1a1a',
                                    border: '1px solid rgba(0, 0, 0, 0.08)',
                                    padding: '0.75rem 1.35rem',
                                    borderRadius: '9999px',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
                                }}
                            >
                                Sign In
                            </button>

                            <button
                                onClick={() => setIsBookingModalOpen(true)}
                                style={{
                                    background: '#18181b',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '0.75rem 1.45rem',
                                    borderRadius: '9999px',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)'
                                }}
                            >
                                Book a Shoot
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                padding: '140px 40px 60px 40px',
                maxWidth: 1400,
                margin: '0 auto',
                position: 'relative'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1.15fr 0.85fr',
                    gap: '4rem',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    {/* Hero Left Content */}
                    <div>
                        <h1 style={{
                            fontSize: '4.25rem',
                            fontWeight: 700,
                            lineHeight: 1.08,
                            letterSpacing: '-0.035em',
                            color: '#121212',
                            marginBottom: '1.5rem',
                            fontFamily: "'Playfair Display', Georgia, serif"
                        }}>
                            Production that runs itself.
                        </h1>

                        <p style={{
                            fontSize: '1.25rem',
                            lineHeight: 1.6,
                            color: '#555555',
                            maxWidth: 540,
                            marginBottom: '2.5rem',
                            fontWeight: 400
                        }}>
                            Studio Pro is the unified platform for luxury photography, 4K client galleries, and autonomous AI photo restoration. Built for seamless web and mobile access.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setIsBookingModalOpen(true)}
                                style={{
                                    background: '#18181b',
                                    color: '#ffffff',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    borderRadius: '9999px',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                                }}
                            >
                                Book a Shoot
                            </button>

                            <button
                                onClick={() => {
                                    setAuthMode('login');
                                    setIsAuthModalOpen(true);
                                }}
                                style={{
                                    background: 'rgba(0, 0, 0, 0.05)',
                                    color: '#1a1a1a',
                                    border: '1px solid rgba(0, 0, 0, 0.12)',
                                    padding: '1rem 1.75rem',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <span>Client & Owner Sign In</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Hero Right Visual Graphic (Antimetal Node Network Inspiration) */}
                    <div style={{
                        position: 'relative',
                        height: 520,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {/* Central Visual Hub */}
                            <svg width="480" height="480" viewBox="0 0 480 480" style={{ maxWidth: '100%' }}>
                                <circle cx="240" cy="240" r="18" fill="#f97316" />
                                <circle cx="240" cy="240" r="30" fill="#f97316" opacity="0.3" />

                                {/* Radiating Nodes */}
                                {[
                                    { cx: 120, cy: 100, r: 16, color: '#18181b' },
                                    { cx: 360, cy: 110, r: 22, color: '#f59e0b' },
                                    { cx: 390, cy: 260, r: 28, color: '#18181b' },
                                    { cx: 330, cy: 380, r: 18, color: '#f97316' },
                                    { cx: 150, cy: 370, r: 24, color: '#eab308' },
                                    { cx: 80, cy: 240, r: 20, color: '#18181b' },
                                    { cx: 200, cy: 60, r: 12, color: '#f59e0b' },
                                    { cx: 290, cy: 70, r: 14, color: '#18181b' },
                                    { cx: 420, cy: 180, r: 12, color: '#ea580c' },
                                    { cx: 380, cy: 320, r: 10, color: '#f59e0b' },
                                    { cx: 230, cy: 430, r: 15, color: '#18181b' },
                                    { cx: 100, cy: 320, r: 14, color: '#f97316' },
                                    { cx: 140, cy: 180, r: 10, color: '#ca8a04' },
                                ].map((node, i) => (
                                    <g key={i}>
                                        <line
                                            x1="240"
                                            y1="240"
                                            x2={node.cx}
                                            y2={node.cy}
                                            stroke="rgba(0, 0, 0, 0.18)"
                                            strokeWidth="1.2"
                                            strokeDasharray={i % 3 === 0 ? "4 3" : "none"}
                                        />
                                        <circle cx={node.cx} cy={node.cy} r={node.r} fill={node.color} />
                                    </g>
                                ))}
                            </svg>

                            {/* Floating Floating Stat Badge */}
                            <div style={{
                                position: 'absolute',
                                bottom: 20,
                                left: 10,
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(16px)',
                                padding: '1rem 1.5rem',
                                borderRadius: '16px',
                                border: '1px solid rgba(0,0,0,0.08)',
                                boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#18181b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={20} color="#f97316" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#18181b' }}>4.9/5 Client Rating</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666' }}>1,200+ Shoots & AI Restorations</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights Grid */}
            <section id="services" style={{ padding: '80px 40px', maxWidth: 1400, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f97316', marginBottom: '0.5rem' }}>
                        Enterprise Capabilities
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Everything your studio needs to thrive.
                    </h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Feature 1 */}
                    <div style={{
                        background: '#ffffff',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ width: 50, height: 50, borderRadius: '14px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <ImageIcon size={24} color="#d97706" />
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                            Ultra-HD Client Galleries
                        </h3>
                        <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>
                            Deliver beautiful, pin-protected web galleries. Clients can favorite, share with family, and download full raw originals in seconds.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{
                        background: '#ffffff',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ width: 50, height: 50, borderRadius: '14px', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Wand2 size={24} color="#ea580c" />
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                            AI Heritage Photo Restoration
                        </h3>
                        <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>
                            Turn old black-and-white, scratched, or water-damaged photographs into pristine full-color heirlooms with autonomous AI upscaling.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{
                        background: '#ffffff',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ width: 50, height: 50, borderRadius: '14px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                            <Smartphone size={24} color="#4f46e5" />
                        </div>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                            Unified Mobile & Web Sync
                        </h3>
                        <p style={{ color: '#666', lineHeight: 1.6, fontSize: '0.95rem' }}>
                            Clients can open the website on their Mac/PC or use the iOS/Android mobile app with the exact same account. Zero friction.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                borderTop: '1px solid rgba(0,0,0,0.08)',
                padding: '40px',
                textAlign: 'center',
                color: '#666',
                fontSize: '0.85rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>
                    <span onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} style={{ cursor: 'pointer' }}>Studio Login</span>
                    <span>•</span>
                    <span onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }} style={{ cursor: 'pointer' }}>Client Sign Up</span>
                    <span>•</span>
                    <span onClick={() => setIsBookingModalOpen(true)} style={{ cursor: 'pointer' }}>Book an Event</span>
                </div>
                <p>© 2026 Studio Pro Technologies. All rights reserved.</p>
            </footer>

            {/* =========================================================
                IN-WEBSITE AUTHENTICATION MODAL (Customer & Studio Owner)
               ========================================================= */}
            {isAuthModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: 460,
                        background: '#121629',
                        color: '#ffffff',
                        padding: '2.5rem 2.25rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.35)',
                        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.25)',
                        position: 'relative'
                    }}>
                        {/* Close Button */}
                        <button
                            onClick={() => setIsAuthModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: 20,
                                right: 20,
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: 'none',
                                color: '#ffffff',
                                width: 34,
                                height: 34,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={18} />
                        </button>

                        {/* Title */}
                        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                            <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
                                <Camera size={26} color="#ffffff" />
                            </div>
                            <h2 style={{ fontSize: '1.65rem', marginBottom: '0.2rem', color: '#ffffff' }}>
                                Studio Pro <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portal</span>
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                Sign in from inside the website to access your hub
                            </p>
                        </div>

                        {/* Mode Switcher */}
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
                            <button
                                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.55rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: authMode === 'login' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'transparent',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                                style={{
                                    flex: 1,
                                    padding: '0.55rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: authMode === 'register' ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'transparent',
                                    color: '#ffffff',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: 'pointer'
                                }}
                            >
                                New Customer Sign Up
                            </button>
                        </div>

                        {/* Error Alert */}
                        {authError && (
                            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={14} />
                                <span>{authError}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleAuthSubmit}>
                            {authMode === 'register' && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                                        <div>
                                            <label style={{ color: '#94a3b8', fontSize: '0.75rem' }}>First Name</label>
                                            <input
                                                type="text"
                                                placeholder="Priya"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="Patel"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '0.85rem' }}>
                                        <label style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Phone / WhatsApp</label>
                                        <input
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}

                            <div style={{ marginBottom: '0.85rem' }}>
                                <label style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@gmail.com"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        required
                                        style={{ paddingRight: 45 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={authLoading}
                                style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                {authLoading ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Authenticating with Supabase...</span>
                                    </>
                                ) : (authMode === 'login' ? 'Sign In to Portal' : 'Create My Account')}
                            </button>

                            {authLoading && (
                                <p style={{ fontSize: '0.75rem', color: '#34d399', textAlign: 'center', marginBottom: '1rem' }}>
                                    🔒 Direct Supabase Cloud Auth • Instant Verification
                                </p>
                            )}
                        </form>

                        {/* Quick Test Accounts */}
                        {authMode === 'login' && (
                            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>
                                    1-Click Demo Accounts:
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickRole('admin')}
                                        style={{ flex: 1, padding: '0.35rem', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)', color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        👑 Studio Owner
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleQuickRole('customer')}
                                        style={{ flex: 1, padding: '0.35rem', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.4)', color: '#22d3ee', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        👤 Client / Customer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Book a Shoot Modal */}
            {isBookingModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.65)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1.5rem'
                }}>
                    <div style={{
                        width: '100%',
                        maxWidth: 480,
                        background: '#ffffff',
                        color: '#1a1a1a',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setIsBookingModalOpen(false)}
                            style={{ position: 'absolute', top: 20, right: 20, background: '#f4f4f5', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <X size={16} />
                        </button>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
                            Reserve Your Shoot
                        </h2>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Fill in your event details and our lead cinematographer will contact you within 2 hours.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input type="text" placeholder="Your Full Name" style={{ background: '#f8fafc', color: '#1a1a1a', borderColor: '#e2e8f0' }} />
                            <input type="email" placeholder="Email Address" style={{ background: '#f8fafc', color: '#1a1a1a', borderColor: '#e2e8f0' }} />
                            <input type="tel" placeholder="WhatsApp Phone Number" style={{ background: '#f8fafc', color: '#1a1a1a', borderColor: '#e2e8f0' }} />
                            <select style={{ background: '#f8fafc', color: '#1a1a1a', borderColor: '#e2e8f0' }}>
                                <option>Wedding & Reception (4K Cinema)</option>
                                <option>Pre-Wedding Sunset Story</option>
                                <option>Commercial Lookbook</option>
                                <option>Photo Restoration Batch</option>
                            </select>
                            <button
                                onClick={() => {
                                    alert('Shoot request submitted! We will reach out on WhatsApp.');
                                    setIsBookingModalOpen(false);
                                }}
                                style={{ background: '#18181b', color: '#ffffff', border: 'none', padding: '0.9rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Submit Shoot Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
