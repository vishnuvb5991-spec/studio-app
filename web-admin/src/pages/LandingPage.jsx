import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    Camera, ArrowRight, X, Eye, EyeOff, Lock, Loader2,
    Wand2, Image as ImageIcon, Smartphone, CheckCircle2, Sparkles, Menu, ShieldCheck
} from 'lucide-react';
import Hero3DCanvas from '../components/3d/Hero3DCanvas';
import Tilt3DCard from '../components/3d/Tilt3DCard';
import Gallery3DCarousel from '../components/3d/Gallery3DCarousel';

/* ─── Unsplash photo tokens (free, no auth needed) ─── */
const GALLERY = [
    {
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80',
        title: 'Traditional Wedding',
        caption: 'A traditional wedding celebration'
    },
    {
        src: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&auto=format&fit=crop&q=80',
        title: 'Garden Ceremony',
        caption: 'An intimate garden ceremony'
    },
    {
        src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=80',
        title: 'Coastal Celebration',
        caption: 'A coastal celebration in Goa'
    },
];

export default function LandingPage() {
    const { isAuthenticated, isCustomer, login, requestAccess } = useAuth();
    const navigate = useNavigate();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    // Auth form state — clean credentials, no demo defaults
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [eventType, setEventType] = useState('Wedding Photography');
    const [accessMessage, setAccessMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [requestSuccess, setRequestSuccess] = useState(false);

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
                setAuthError(result.error || 'Authentication failed. Please verify credentials.');
            }
        } else {
            // Customer Access Request requiring studio owner approval
            if (!firstName.trim() || !email.trim() || !phone.trim()) {
                setAuthError('Please provide your name, email, and phone/WhatsApp number.');
                setAuthLoading(false);
                return;
            }
            const result = await requestAccess({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                eventType,
                message: accessMessage.trim()
            });

            if (result.success) {
                setRequestSuccess(true);
            } else {
                setAuthError(result.error || 'Failed to submit access request. Please try again.');
            }
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
                background: 'rgba(245,245,240,0.92)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(0,0,0,0.07)',
            }}>
                <div className="landing-nav-container">
                    {/* Logo */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.01em', flexShrink: 0 }}>
                        <Camera size={18} strokeWidth={2} />
                        Preetha Studio
                    </div>

                    {/* Desktop Links */}
                    <div className="landing-nav-links">
                        {[['#gallery', 'Gallery'], ['#services', 'Services'], ['#about', 'About']].map(([href, label]) => (
                            <a key={href} href={href} style={{ color: '#444', textDecoration: 'none' }}>{label}</a>
                        ))}
                    </div>

                    {/* CTA / Mobile Controls */}
                    <div className="landing-nav-cta">
                        <button
                            onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                            style={{ ...btnSecondary, padding: '0.45rem 0.95rem', fontSize: '0.825rem', borderRadius: '6px', whiteSpace: 'nowrap' }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setIsBookingModalOpen(true)}
                            className="landing-nav-book-btn"
                            style={{ ...btnPrimary, padding: '0.45rem 1.15rem', fontSize: '0.825rem', borderRadius: '6px', whiteSpace: 'nowrap' }}
                        >
                            Book your date
                        </button>
                        {/* Hamburger Button for Mobile */}
                        <button
                            className="landing-nav-hamburger"
                            onClick={() => setMobileNavOpen(!mobileNavOpen)}
                            aria-label="Toggle navigation menu"
                        >
                            {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Drawer */}
                {mobileNavOpen && (
                    <div style={{
                        background: '#ffffff',
                        borderBottom: '1px solid #e5e7eb',
                        padding: '1rem 1.25rem 1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                    }}>
                        {[['#gallery', 'Gallery'], ['#services', 'Services'], ['#about', 'About']].map(([href, label]) => (
                            <a
                                key={href}
                                href={href}
                                onClick={() => setMobileNavOpen(false)}
                                style={{
                                    fontSize: '0.95rem',
                                    fontWeight: 600,
                                    color: '#18181b',
                                    textDecoration: 'none',
                                    padding: '0.4rem 0'
                                }}
                            >
                                {label}
                            </a>
                        ))}
                        <button
                            onClick={() => { setMobileNavOpen(false); setIsBookingModalOpen(true); }}
                            style={{
                                ...btnPrimary,
                                width: '100%',
                                padding: '0.75rem',
                                fontSize: '0.9rem',
                                borderRadius: '6px',
                                textAlign: 'center',
                                marginTop: '0.35rem'
                            }}
                        >
                            Book your date
                        </button>
                    </div>
                )}
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

            {/* ── 3D HERO SHOWCASE ────────────────────────────────────── */}
            <div className="hero-3d-container">
                <div className="hero-3d-grid">
                    {/* Left: 3D Tilt Photo Card with Floating Rating Badge */}
                    <Tilt3DCard
                        maxTilt={9}
                        style={{
                            borderRadius: '20px',
                            background: '#d4c5b0',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            aspectRatio: '4/3',
                            position: 'relative'
                        }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop&q=80"
                            alt="Bride and groom at a beautiful wedding ceremony"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            loading="eager"
                        />
                        {/* 3D Floating Rating Badge */}
                        <div style={{
                            position: 'absolute', bottom: 16, left: 16,
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(16px)',
                            borderRadius: '12px',
                            padding: '0.65rem 1rem',
                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                            transform: 'translateZ(30px)',
                            border: '1px solid rgba(255,255,255,0.6)',
                            maxWidth: 'calc(100% - 32px)'
                        }}>
                            <div style={{ fontSize: '1.35rem', color: '#d97706' }}>★</div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#111' }}>4.9 / 5 Client Rating</div>
                                <div style={{ fontSize: '0.72rem', color: '#666' }}>1,200+ Shoots &amp; AI Restorations</div>
                            </div>
                        </div>
                    </Tilt3DCard>

                    {/* Right: Three.js Interactive 3D Camera Lens Canvas */}
                    <div style={{
                        position: 'relative',
                        background: 'linear-gradient(145deg, #18181b 0%, #0d0d11 100%)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        aspectRatio: '4/3',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* 3D Indicator Top Banner */}
                        <div style={{
                            position: 'absolute', top: 12, left: 14, right: 14,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            zIndex: 10, pointerEvents: 'none', flexWrap: 'wrap', gap: '0.35rem'
                        }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                                padding: '0.25rem 0.65rem', borderRadius: '999px',
                                fontSize: '0.68rem', fontWeight: 700, color: '#fde68a',
                                border: '1px solid rgba(253, 230, 138, 0.25)',
                                textTransform: 'uppercase', letterSpacing: '0.08em'
                            }}>
                                <Sparkles size={11} /> Interactive 3D Lens
                            </div>
                            <div style={{
                                fontSize: '0.65rem', color: '#9ca3af',
                                background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.55rem',
                                borderRadius: '6px'
                            }}>
                                Drag to rotate
                            </div>
                        </div>

                        {/* Three.js WebGL Canvas */}
                        <Hero3DCanvas />
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
                        { num: '26+', label: 'Years behind the lens' },
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
                        <Tilt3DCard
                            key={title}
                            maxTilt={12}
                            scale={1.03}
                            glare={true}
                            style={{
                                background: bg || '#fff',
                                border: '1px solid rgba(0,0,0,0.06)',
                                borderRadius: '16px',
                                padding: '2.25rem 2rem',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                            }}
                        >
                            <div style={{ fontSize: '2rem', marginBottom: '1.1rem' }}>{icon}</div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.6rem', color: '#111' }}>{title}</h3>
                            <p style={{ color: '#666', fontSize: '0.92rem', lineHeight: 1.65 }}>{desc}</p>
                        </Tilt3DCard>
                    ))}
                </div>
            </section>

            {/* ── 3D SPATIAL GALLERY CAROUSEL ─────────────────────────── */}
            <Gallery3DCarousel />

            {/* ── OUR APPROACH ────────────────────────────────────────── */}
            <section style={{
                background: '#7d4f5b',
                padding: '110px 32px 100px',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: 680, margin: '0 auto', marginBottom: '3.5rem' }}>
                    {/* Tagline */}
                    <div style={{
                        fontSize: '0.7rem', fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '1.1rem'
                    }}>
                        Our Approach
                    </div>

                    {/* Heading */}
                    <h2 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(2.2rem, 5vw, 3.25rem)',
                        fontWeight: 500,
                        lineHeight: 1.15,
                        letterSpacing: '-0.02em',
                        color: '#fff',
                        marginBottom: '1.5rem'
                    }}>
                        We photograph the real moments
                    </h2>

                    {/* Body */}
                    <p style={{
                        fontSize: '1.05rem', lineHeight: 1.75,
                        color: 'rgba(255,255,255,0.85)',
                        maxWidth: 560, margin: '0 auto'
                    }}>
                        We believe the best photographs are the ones you didn't pose for. We blend into your day, stay present, and capture the laughter, the tears, and the quiet in-between moments that tell your story.
                    </p>
                </div>

                {/* Complete, beautiful full photograph with 3D Tilt */}
                <Tilt3DCard
                    maxTilt={7}
                    scale={1.01}
                    glare={true}
                    style={{
                        maxWidth: 1060,
                        margin: '0 auto',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.3)',
                        aspectRatio: '16 / 9',
                        background: '#5a343e'
                    }}
                >
                    <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop&q=80"
                        alt="Candid wedding celebration moment"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center 40%',
                            display: 'block'
                        }}
                    />
                </Tilt3DCard>
            </section>

            {/* ── CTA BANNER — "Your date is waiting" ─────────────────── */}
            <section style={{
                background: '#0a0a0a',
                padding: '120px 32px 140px',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: 680, margin: '0 auto' }}>
                    {/* Rose tagline */}
                    <div style={{
                        fontSize: '0.72rem', fontWeight: 700,
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                        color: '#e07070',
                        marginBottom: '1.25rem'
                    }}>
                        Let's plan your day
                    </div>

                    <h2 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: 'clamp(2.4rem, 6vw, 3.75rem)',
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        color: '#fff',
                        marginBottom: '1.25rem'
                    }}>
                        Your date is waiting
                    </h2>

                    <p style={{
                        color: '#9ca3af', fontSize: '1rem',
                        lineHeight: 1.75, marginBottom: '2.5rem',
                        maxWidth: 520, margin: '0 auto 2.5rem'
                    }}>
                        Tell us about your wedding or event. We'll get back to you within two business days to check availability and start planning.
                    </p>

                    <button
                        onClick={() => setIsBookingModalOpen(true)}
                        style={{
                            background: '#fff', color: '#0a0a0a',
                            border: '2px solid #fff',
                            padding: '0.9rem 2.25rem',
                            borderRadius: '8px',
                            fontWeight: 700, fontSize: '0.95rem',
                            cursor: 'pointer', fontFamily: 'inherit'
                        }}
                    >
                        Check availability
                    </button>
                </div>
            </section>

            {/* ── FOOTER ──────────────────────────────────────────────── */}
            <footer style={{
                background: '#0a0a0a',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                padding: '64px 32px 40px'
            }}>
                <div style={{
                    maxWidth: 1180, margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '2.5rem',
                    marginBottom: '3rem'
                }}>
                    {/* Studio col */}
                    <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1.1rem' }}>Studio</p>
                        {[
                            { label: 'Gallery', action: () => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' }) },
                            { label: 'Services', action: () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }) },
                            { label: 'About', action: () => {} },
                        ].map(({ label, action }) => (
                            <p key={label} onClick={action} style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.65rem', cursor: 'pointer' }}>{label}</p>
                        ))}
                    </div>

                    {/* Services col */}
                    <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1.1rem' }}>Services</p>
                        {['Wedding Photography', 'Engagement & Pre-wedding', 'Events & Celebrations', 'AI Photo Restoration'].map(s => (
                            <p key={s} style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.65rem' }}>{s}</p>
                        ))}
                    </div>

                    {/* Get in touch col */}
                    <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '1.1rem' }}>Get in touch</p>
                        <p style={{ marginBottom: '0.65rem' }}>
                            <a href="mailto:StudiofotoFXammadam@Gmail.com" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                                StudiofotoFXammadam@Gmail.com
                            </a>
                        </p>
                        <p style={{ marginBottom: '0.65rem' }}>
                            <a href="tel:+918129788272" style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#fff'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>
                                +91 8129788272
                            </a>
                        </p>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Thrissur, Kerala, India</p>
                    </div>

                    {/* Have a project col */}
                    <div>
                        <p style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Have a project in mind?</p>
                        <p style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>
                            Let's create something memorable together.
                        </p>
                        <button
                            onClick={() => setIsBookingModalOpen(true)}
                            style={{
                                background: '#fff', color: '#0a0a0a',
                                border: 'none', padding: '0.65rem 1.4rem',
                                borderRadius: '7px', fontWeight: 700,
                                fontSize: '0.85rem', cursor: 'pointer',
                                fontFamily: 'inherit'
                            }}
                        >
                            Book your date
                        </button>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.8rem' }}>
                    © 2026 Preetha Studio Photography &amp; Films. All rights reserved.
                </div>
            </footer>

            {/* ── AUTH MODAL ──────────────────────────────────────────── */}
            {isAuthModalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1.5rem'
                }}>
                    <div style={{
                        width: '100%', maxWidth: 440,
                        maxHeight: '90vh', overflowY: 'auto',
                        background: '#ffffff', color: '#18181b',
                        padding: '2.5rem 2.25rem',
                        borderRadius: '20px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.18), 0 0 30px rgba(217,119,6,0.06)',
                        position: 'relative'
                    }}>
                        <button onClick={() => setIsAuthModalOpen(false)} style={{
                            position: 'absolute', top: 18, right: 18,
                            background: '#f4f4f5', border: 'none',
                            color: '#71717a', width: 32, height: 32, borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }}>
                            <X size={16} />
                        </button>

                        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                            <div style={{ width: 48, height: 48, background: '#18181b', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.8rem', boxShadow: '0 4px 14px rgba(24,24,27,0.2)' }}>
                                <Camera size={24} color="#fde68a" />
                            </div>
                            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.55rem', fontWeight: 600, color: '#18181b', marginBottom: '0.2rem' }}>
                                Preetha Studio <span style={{ color: '#d97706' }}>Portal</span>
                            </h2>
                            <p style={{ color: '#52525b', fontSize: '0.82rem' }}>Sign in to access your studio hub</p>
                        </div>

                        {/* Mode Switcher */}
                        <div style={{ display: 'flex', background: '#f4f4f5', padding: '0.25rem', borderRadius: '10px', marginBottom: '1.25rem', border: '1px solid #e4e4e7' }}>
                            <button
                                type="button"
                                onClick={() => { setAuthMode('login'); setAuthError(''); setRequestSuccess(false); }}
                                style={{
                                    flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none',
                                    background: authMode === 'login' ? '#18181b' : 'transparent',
                                    color: authMode === 'login' ? '#ffffff' : '#52525b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit'
                                }}
                            >
                                Sign In
                            </button>
                            <button
                                type="button"
                                onClick={() => { setAuthMode('register'); setAuthError(''); setRequestSuccess(false); }}
                                style={{
                                    flex: 1, padding: '0.5rem', borderRadius: '8px', border: 'none',
                                    background: authMode === 'register' ? '#18181b' : 'transparent',
                                    color: authMode === 'register' ? '#ffffff' : '#52525b', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit'
                                }}
                            >
                                Request Client Access
                            </button>
                        </div>

                        {authError && (
                            <div style={{ padding: '0.7rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Lock size={13} />{authError}
                            </div>
                        )}

                        {requestSuccess ? (
                            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
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
                                        The studio has received your access request for <strong>{eventType}</strong>. You will be granted access once approved by management.
                                    </p>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '1.25rem' }}>
                                    Need urgent access? WhatsApp or Call us at <strong style={{ color: '#18181b' }}>+91 8129788272</strong>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => { setRequestSuccess(false); setIsAuthModalOpen(false); }}
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '0.75rem', background: '#18181b', color: '#ffffff', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleAuthSubmit}>
                                {authMode === 'register' && (
                                    <>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                                            <div>
                                                <label style={{ color: '#52525b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>First Name *</label>
                                                <input type="text" placeholder="Priya" value={firstName} onChange={e => setFirstName(e.target.value)} required style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }} />
                                            </div>
                                            <div>
                                                <label style={{ color: '#52525b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Last Name</label>
                                                <input type="text" placeholder="Patel" value={lastName} onChange={e => setLastName(e.target.value)} style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }} />
                                            </div>
                                        </div>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <label style={{ color: '#52525b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Phone / WhatsApp *</label>
                                            <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} required style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }} />
                                        </div>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <label style={{ color: '#52525b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Event / Shoot Type</label>
                                            <select
                                                value={eventType}
                                                onChange={e => setEventType(e.target.value)}
                                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b', fontSize: '0.82rem' }}
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
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <label style={{ color: '#52525b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Email Address *</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@gmail.com" required style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }} />
                                </div>
                                {authMode === 'login' && (
                                    <div style={{ marginBottom: '1.25rem' }}>
                                        <label style={{ color: '#52525b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Password *</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 44, background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#71717a', cursor: 'pointer' }}>
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {authMode === 'register' && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ color: '#52525b', fontSize: '0.72rem', display: 'block', marginBottom: '0.3rem' }}>Note for Studio (Optional)</label>
                                        <input type="text" placeholder="e.g. Wedding date on Dec 12 in Thrissur" value={accessMessage} onChange={e => setAccessMessage(e.target.value)} style={{ background: '#f8fafc', borderColor: '#e2e8f0', color: '#18181b' }} />
                                    </div>
                                )}
                                <button type="submit" className="btn btn-primary" disabled={authLoading} style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#18181b', color: '#ffffff' }}>
                                    {authLoading ? <><Loader2 size={16} className="animate-spin" /><span>Processing…</span></> : (authMode === 'login' ? 'Sign In to Portal' : 'Submit Access Request')}
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#71717a', fontSize: '0.72rem' }}>
                                    <ShieldCheck size={14} color="#059669" />
                                    <span>
                                        {authMode === 'login'
                                            ? 'Preetha Studio secure login • Customer portals require studio approval'
                                            : 'Protected Portal • Owner approval required before account activation'}
                                    </span>
                                </div>
                            </form>
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
                        maxHeight: '90vh', overflowY: 'auto',
                        background: '#fff', color: '#18181b',
                        padding: '2rem 1.75rem', borderRadius: '20px',
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
