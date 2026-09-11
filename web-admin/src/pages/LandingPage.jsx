import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Camera, ArrowRight, X, Eye, EyeOff, Lock, Loader2,
    Wand2, Image as ImageIcon, Smartphone, CheckCircle2
} from 'lucide-react';

/* ─── Unsplash photo tokens (free, no auth needed) ─── */
const GALLERY = [
    {
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80',
        couple: 'Meera & Arjun',
        caption: 'A traditional wedding in Jaipur'
    },
    {
        src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&auto=format&fit=crop&q=80',
        couple: 'Sophie & Daniel',
        caption: 'An intimate garden ceremony'
    },
    {
        src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=80',
        couple: 'Ananya & Vikram',
        caption: 'A coastal celebration in Goa'
    },
];

export default function LandingPage() {
    const { isAuthenticated, isCustomer, login, register } = useAuth();
    const navigate = useNavigate();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Auth form state
    const [email, setEmail] = useState('admin@studio.com');
    const [password, setPassword] = useState('StudioPro2024!');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Warm-up Render backend
    useEffect(() => {
        fetch('https://studio-django-api.onrender.com/api/v1/bookings/dashboard_stats/', {
            method: 'GET', mode: 'cors'
        }).catch(() => {});
    }, []);

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) navigate('/dashboard');
    }, [isAuthenticated]);

    const handleQuickRole = (role) => {
        if (role === 'admin') { setEmail('admin@studio.com'); setPassword('StudioPro2024!'); }
        else { setEmail('ananya.s@gmail.com'); setPassword('Customer2024!'); }
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);
        if (authMode === 'login') {
            const result = await login(email, password);
            if (result.success) { setIsAuthModalOpen(false); navigate('/dashboard'); }
            else setAuthError(result.error || 'Invalid credentials');
        } else {
            if (!firstName || !email || !password) {
                setAuthError('Please fill all required fields');
                setAuthLoading(false);
                return;
            }
            const result = await register({ email, password, firstName, lastName, phone, userType: 'customer' });
            if (result.success) { setIsAuthModalOpen(false); navigate('/dashboard'); }
            else setAuthError(result.error || 'Registration failed');
        }
        setAuthLoading(false);
    };

    /* ── shared button styles ── */
    const btnPrimary = {
        background: '#18181b', color: '#fff', border: 'none',
        padding: '0.85rem 2rem', borderRadius: '8px',
        fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
        fontFamily: 'inherit'
    };
    const btnSecondary = {
        background: 'transparent', color: '#18181b',
        border: '1.5px solid #d1d5db',
        padding: '0.85rem 2rem', borderRadius: '8px',
        fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
        fontFamily: 'inherit'
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f5f5f0',
            color: '#18181b',
            fontFamily: "'Inter', system-ui, sans-serif",
            overflowX: 'hidden'
        }}>

            {/* ── NAV ─────────────────────────────────────────────────── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
                background: 'rgba(245,245,240,0.88)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(0,0,0,0.07)',
            }}>
                <div style={{
                    maxWidth: 1180, margin: '0 auto',
                    padding: '0 32px',
                    height: 64,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
                        <Camera size={18} strokeWidth={2} />
                        Studio Pro
                    </div>

                    {/* Links */}
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', fontWeight: 500 }}>
                        {[['#gallery', 'Gallery'], ['#services', 'Services'], ['#about', 'About']].map(([href, label]) => (
                            <a key={href} href={href} style={{ color: '#444', textDecoration: 'none' }}>{label}</a>
                        ))}
                    </div>

                    {/* CTA */}
                    <div style={{ display: 'flex', gap: '0.65rem' }}>
                        <button
                            onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                            style={{ ...btnSecondary, padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '6px' }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsBookingModalOpen(true)}
                            style={{ ...btnPrimary, padding: '0.55rem 1.25rem', fontSize: '0.85rem', borderRadius: '6px' }}
                        >
                            Book your date
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── HERO (centered, vertical) ────────────────────────────── */}
            <section style={{
                paddingTop: 140, paddingBottom: 72,
                maxWidth: 820, margin: '0 auto', padding: '140px 32px 72px',
                textAlign: 'center'
            }}>
                {/* Tagline pill */}
                <div style={{
                    display: 'inline-block',
                    fontSize: '0.75rem', fontWeight: 700,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: '#92400e',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '999px',
                    padding: '0.3rem 0.9rem',
                    marginBottom: '1.5rem'
                }}>
                    Wedding &amp; Event Photography
                </div>

                <h1 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(2.6rem, 6vw, 4rem)',
                    fontWeight: 500,
                    lineHeight: 1.12,
                    letterSpacing: '-0.02em',
                    color: '#111',
                    marginBottom: '1.35rem'
                }}>
                    Capturing the moments<br />you'll treasure forever
                </h1>

                <p style={{
                    fontSize: '1.05rem', lineHeight: 1.7,
                    color: '#555', maxWidth: 560, margin: '0 auto 2.25rem',
                    fontWeight: 400
                }}>
                    We photograph weddings and life's biggest moments with a candid, timeless eye — so you can relive every emotion of your day for years to come.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => setIsBookingModalOpen(true)} style={btnPrimary}>
                        Book your date
                    </button>
                    <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} style={btnSecondary}>
                        Sign in to portal
                    </button>
                </div>
            </section>

            {/* ── HERO PHOTO ──────────────────────────────────────────── */}
            <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 32px 80px' }}>
                <div style={{
                    width: '100%', aspectRatio: '16/7',
                    borderRadius: '16px', overflow: 'hidden',
                    background: '#d4c5b0',
                    position: 'relative'
                }}>
                    <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop&q=80"
                        alt="Bride and groom at a beautiful wedding ceremony"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        loading="eager"
                    />
                    {/* Overlay badge */}
                    <div style={{
                        position: 'absolute', bottom: 20, left: 20,
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '10px',
                        padding: '0.7rem 1.1rem',
                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '1.4rem' }}>★</div>
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#111' }}>4.9 / 5 Client Rating</div>
                            <div style={{ fontSize: '0.72rem', color: '#666' }}>1,200+ Shoots & AI Restorations</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── STATS BAR ───────────────────────────────────────────── */}
            <section style={{ background: '#18181b', padding: '56px 32px' }}>
                <div style={{
                    maxWidth: 900, margin: '0 auto',
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2rem', textAlign: 'center'
                }}>
                    {[
                        { num: '500+', label: 'Weddings photographed' },
                        { num: '12', label: 'Years behind the lens' },
                        { num: '4.9★', label: 'Average couple rating' }
                    ].map(({ num, label }) => (
                        <div key={label}>
                            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, color: '#fff', lineHeight: 1 }}>
                                {num}
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#9ca3af', marginTop: '0.5rem', fontWeight: 500 }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── SERVICES ────────────────────────────────────────────── */}
            <section id="services" style={{ padding: '96px 32px', maxWidth: 1180, margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#92400e', marginBottom: '0.65rem' }}>
                        What we offer
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 500, letterSpacing: '-0.02em', color: '#111', marginBottom: '0.75rem' }}>
                        Photography for your biggest moments
                    </h2>
                    <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.7, maxWidth: 560 }}>
                        From the proposal to the anniversary, we're there for the moments that matter — with a style that's candid, warm, and timeless.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {[
                        {
                            icon: '💍', title: 'Wedding Photography',
                            desc: 'Full-day coverage capturing every candid, emotional moment — from the first look to the last dance.',
                            bg: '#fff9f0'
                        },
                        {
                            icon: '🌅', title: 'Engagement & Pre-wedding',
                            desc: 'Relaxed, natural shoots that capture your connection before the big day — perfect for save-the-dates.',
                            bg: '#f0fdf4'
                        },
                        {
                            icon: '🎉', title: 'Events & Celebrations',
                            desc: 'Birthdays, anniversaries, and family milestones photographed with the same care as a wedding.',
                            bg: '#faf5ff'
                        },
                        {
                            icon: '✨', title: 'AI Photo Restoration',
                            desc: 'Turn old, scratched, or faded photographs into pristine full-colour heirlooms with autonomous AI upscaling.',
                            bg: '#fff0f5'
                        },
                        {
                            icon: '📱', title: 'Client Web & App Portal',
                            desc: 'Your gallery, invoices, and booking history — accessible on any device, anytime, at full resolution.',
                            bg: '#f0f4ff'
                        },
                        {
                            icon: '🎬', title: '4K Cinematic Films',
                            desc: 'Cinematic wedding films and reels edited with colour grading and original soundtrack for a timeless keepsake.',
                            bg: '#fffbf0'
                        }
                    ].map(({ icon, title, desc, bg }) => (
                        <div key={title} style={{
                            background: bg || '#fff',
                            border: '1px solid rgba(0,0,0,0.06)',
                            borderRadius: '14px',
                            padding: '2rem',
                        }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{icon}</div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.55rem', color: '#111' }}>{title}</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.65 }}>{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── GALLERY GRID ────────────────────────────────────────── */}
            <section id="gallery" style={{ padding: '0 32px 96px', maxWidth: 1180, margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#92400e', marginBottom: '0.65rem' }}>
                        Recent weddings
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 500, letterSpacing: '-0.02em', color: '#111', marginBottom: '0.75rem' }}>
                        Moments we've been honoured to capture
                    </h2>
                    <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.7, maxWidth: 560 }}>
                        A selection of the weddings and celebrations we've been trusted to photograph.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {GALLERY.map(({ src, couple, caption }) => (
                        <div key={couple}>
                            <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '3/2', background: '#ddd', marginBottom: '0.75rem' }}>
                                <img src={src} alt={couple} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                                    onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
                                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                />
                            </div>
                            <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111', marginBottom: '0.15rem' }}>{couple}</p>
                            <p style={{ fontSize: '0.8rem', color: '#888' }}>{caption}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA BANNER ──────────────────────────────────────────── */}
            <section style={{
                background: '#18181b', padding: '88px 32px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h2 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                        fontWeight: 500, color: '#fff',
                        letterSpacing: '-0.02em', marginBottom: '1rem'
                    }}>
                        Ready to book your date?
                    </h2>
                    <p style={{ color: '#9ca3af', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                        Limited dates available each season. Reach out and our lead photographer will get back to you within 2 hours.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setIsBookingModalOpen(true)}
                            style={{ ...btnPrimary, background: '#fff', color: '#18181b' }}
                        >
                            Book your date
                        </button>
                        <button
                            onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                            style={{ ...btnSecondary, borderColor: '#374151', color: '#d1d5db' }}
                        >
                            Client portal sign in
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ──────────────────────────────────────────────── */}
            <footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '40px 32px', textAlign: 'center', color: '#888', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.75rem', marginBottom: '0.75rem', fontWeight: 600, flexWrap: 'wrap' }}>
                    <span onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} style={{ cursor: 'pointer', color: '#444' }}>Studio Login</span>
                    <span onClick={() => { setAuthMode('register'); setIsAuthModalOpen(true); }} style={{ cursor: 'pointer', color: '#444' }}>Client Sign Up</span>
                    <span onClick={() => setIsBookingModalOpen(true)} style={{ cursor: 'pointer', color: '#444' }}>Book an Event</span>
                </div>
                <p>© 2026 Studio Pro Photography & Films. All rights reserved.</p>
            </footer>

            {/* ── AUTH MODAL ──────────────────────────────────────────── */}
            {isAuthModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        width: '100%', maxWidth: 440,
                        background: '#121629', color: '#fff',
                        padding: '2.5rem 2.25rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(139,92,246,0.3)',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.2)',
                        position: 'relative'
                    }}>
                        <button onClick={() => setIsAuthModalOpen(false)} style={{
                            position: 'absolute', top: 18, right: 18,
                            background: 'rgba(255,255,255,0.08)', border: 'none',
                            color: '#fff', width: 32, height: 32, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}>
                            <X size={16} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                            <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem' }}>
                                <Camera size={24} color="#fff" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>
                                Studio Pro <span style={{ background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Portal</span>
                            </h2>
                            <p style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Sign in to access your studio hub</p>
                        </div>

                        {/* Mode Switcher */}
                        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                            {['login', 'register'].map(mode => (
                                <button key={mode} onClick={() => { setAuthMode(mode); setAuthError(''); }} style={{
                                    flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none',
                                    background: authMode === mode ? 'linear-gradient(135deg,#8b5cf6,#ec4899)' : 'transparent',
                                    color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit'
                                }}>
                                    {mode === 'login' ? 'Sign In' : 'New Customer'}
                                </button>
                            ))}
                        </div>

                        {authError && (
                            <div style={{ padding: '0.7rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: '8px', color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={13} />{authError}
                            </div>
                        )}

                        <form onSubmit={handleAuthSubmit}>
                            {authMode === 'register' && (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                                        <div>
                                            <label style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>First Name</label>
                                            <input type="text" placeholder="Priya" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                                        </div>
                                        <div>
                                            <label style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Last Name</label>
                                            <input type="text" placeholder="Patel" value={lastName} onChange={e => setLastName(e.target.value)} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <label style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Phone / WhatsApp</label>
                                        <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                </>
                            )}
                            <div style={{ marginBottom: '0.75rem' }}>
                                <label style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Email Address</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@gmail.com" required />
                            </div>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ color: '#94a3b8', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 44 }} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={authLoading} style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                {authLoading ? <><Loader2 size={16} className="animate-spin" /><span>Authenticating…</span></> : (authMode === 'login' ? 'Sign In to Portal' : 'Create My Account')}
                            </button>
                        </form>

                        {authMode === 'login' && (
                            <div style={{ padding: '0.7rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 600 }}>1-Click Demo Accounts:</p>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button type="button" onClick={() => handleQuickRole('admin')} style={{ flex: 1, padding: '0.35rem', borderRadius: '6px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)', color: '#c084fc', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        👑 Studio Owner
                                    </button>
                                    <button type="button" onClick={() => handleQuickRole('customer')} style={{ flex: 1, padding: '0.35rem', borderRadius: '6px', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.35)', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        👤 Client / Customer
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── BOOKING MODAL ───────────────────────────────────────── */}
            {isBookingModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        width: '100%', maxWidth: 480,
                        background: '#fff', color: '#18181b',
                        padding: '2.5rem', borderRadius: '20px',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
                        position: 'relative'
                    }}>
                        <button onClick={() => setIsBookingModalOpen(false)} style={{ position: 'absolute', top: 18, right: 18, background: '#f4f4f5', border: 'none', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <X size={15} />
                        </button>
                        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.7rem', fontWeight: 500, marginBottom: '0.4rem' }}>Reserve Your Date</h2>
                        <p style={{ color: '#666', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            Our lead photographer will contact you within 2 hours to confirm availability.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <input type="text" placeholder="Your Full Name" style={{ background: '#f8fafc', color: '#1a1a1a', borderColor: '#e2e8f0', fontFamily: 'inherit' }} />
                            <input type="email" placeholder="Email Address" style={{ background: '#f8fafc', color: '#1a1a1a', borderColor: '#e2e8f0', fontFamily: 'inherit' }} />
                            <input type="tel" placeholder="WhatsApp Number" style={{ background: '#f8fafc', color: '#1a1a1a', borderColor: '#e2e8f0', fontFamily: 'inherit' }} />
                            <select style={{ background: '#f8fafc', color: '#1a1a1a', borderColor: '#e2e8f0', fontFamily: 'inherit', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                                <option>Wedding &amp; Reception (4K Cinema)</option>
                                <option>Pre-Wedding Sunset Story</option>
                                <option>Engagement Shoot</option>
                                <option>Birthday / Anniversary</option>
                                <option>Commercial Lookbook</option>
                                <option>AI Photo Restoration Batch</option>
                            </select>
                            <button
                                onClick={() => { alert("Shoot request submitted! We'll reach out on WhatsApp within 2 hours."); setIsBookingModalOpen(false); }}
                                style={{ ...btnPrimary, padding: '0.9rem', borderRadius: '10px', marginTop: '0.25rem' }}
                            >
                                Submit Booking Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
