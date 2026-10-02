import React, { useState, useEffect, useRef } from 'react';
import {
    Camera, ZoomIn, ZoomOut, Maximize2, Sparkles,
    ChevronLeft, ChevronRight, Eye, Aperture, Sliders, RefreshCw, Volume2, VolumeX
} from 'lucide-react';

// Cinematic photography scenes viewed "Through The Lens"
const PORTFOLIO_SCENES = [
    {
        id: 1,
        title: "Royal Destination Wedding",
        subtitle: "Sunset Vows at Palace Grounds",
        focal: "35mm T1.4",
        iso: "200",
        shutter: "1/500s",
        fStop: "f/1.4",
        location: "The Leela Palace, Udaipur",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=85"
    },
    {
        id: 2,
        title: "Candid Sangeet Celebrations",
        subtitle: "Golden Hour Couple Portrait",
        focal: "50mm T1.2",
        iso: "400",
        shutter: "1/250s",
        fStop: "f/1.8",
        location: "Kochi Waterside Lawn",
        image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1600&auto=format&fit=crop&q=85"
    },
    {
        id: 3,
        title: "Cinematic Garland Exchange",
        subtitle: "Traditional South Indian Wedding",
        focal: "85mm T1.4",
        iso: "320",
        shutter: "1/400s",
        fStop: "f/2.0",
        location: "Heritage Temple Mandapam",
        image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1600&auto=format&fit=crop&q=85"
    },
    {
        id: 4,
        title: "Bridal Fine Art Portrait",
        subtitle: "Studio Lighting & Silk Heirlooms",
        focal: "135mm T2.0",
        iso: "100",
        shutter: "1/160s",
        fStop: "f/2.8",
        location: "Balan Studios Floor 1",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1600&auto=format&fit=crop&q=85"
    }
];

const FOCAL_PRESETS = [
    { label: '24mm', zoom: 0.85, fStop: 'f/2.8', name: 'Ultra-Wide' },
    { label: '35mm', zoom: 1.15, fStop: 'f/1.4', name: 'Cine Standard' },
    { label: '50mm', zoom: 1.65, fStop: 'f/1.2', name: 'Master Prime' },
    { label: '85mm', zoom: 2.35, fStop: 'f/1.4', name: 'Portrait Tele' },
    { label: '135mm', zoom: 3.20, fStop: 'f/2.0', name: 'Cinematic Depth' }
];

export default function CameraLensPortal({ onBookClick }) {
    const containerRef = useRef(null);
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [zoom, setZoom] = useState(1.15); // Start at 35mm
    const [selectedFocal, setSelectedFocal] = useState('35mm');
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isShutterFlashing, setIsShutterFlashing] = useState(false);
    const [isZoomThroughOpen, setIsZoomThroughOpen] = useState(false);
    const [zoomThroughProgress, setZoomThroughProgress] = useState(0);
    const [showHud, setShowHud] = useState(true);
    const [apertureSize, setApertureSize] = useState(0.85); // 0.2 (closed) to 1.0 (wide open)

    // Touch gesture tracking for mobile devices
    const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
    const isTouchingRef = useRef(false);

    const scene = PORTFOLIO_SCENES[currentSceneIndex];

    // Smooth 3D tilt tracking (desktop mouse perspective)
    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: x * 14, y: -y * 14 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    // Touch handling for mobile tilt & swipe gesture
    const handleTouchStart = (e) => {
        if (e.touches && e.touches.length === 1) {
            const touch = e.touches[0];
            touchStartRef.current = {
                x: touch.clientX,
                y: touch.clientY,
                time: Date.now()
            };
            isTouchingRef.current = true;
        }
    };

    const handleTouchMove = (e) => {
        if (!containerRef.current || !e.touches || e.touches.length !== 1) return;
        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width - 0.5;
        const y = (touch.clientY - rect.top) / rect.height - 0.5;
        // Interactive 3D tilt tracking on mobile
        setTilt({
            x: Math.max(-14, Math.min(14, x * 22)),
            y: Math.max(-14, Math.min(14, -y * 22))
        });
    };

    const handleTouchEnd = (e) => {
        if (isTouchingRef.current && e.changedTouches && e.changedTouches.length === 1) {
            const touch = e.changedTouches[0];
            const diffX = touch.clientX - touchStartRef.current.x;
            const diffY = touch.clientY - touchStartRef.current.y;
            const duration = Date.now() - touchStartRef.current.time;

            // Detect horizontal swipe gesture (min 45px swipe, faster than 400ms)
            if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.3 && duration < 400) {
                if (diffX < 0) {
                    nextScene(); // Swipe left -> next photo
                } else {
                    prevScene(); // Swipe right -> prev photo
                }
            }
        }
        isTouchingRef.current = false;
        // Smoothly return tilt to center
        setTilt({ x: 0, y: 0 });
    };

    // Shutter snap animation
    const triggerShutter = () => {
        setIsShutterFlashing(true);
        setTimeout(() => setIsShutterFlashing(false), 260);
    };

    // Set focal length preset with smooth zoom transition
    const handleFocalSelect = (preset) => {
        setSelectedFocal(preset.label);
        setZoom(preset.zoom);
        // Animate aperture blades slightly to simulate mechanical adjustment
        setApertureSize(Math.max(0.4, Math.min(1.0, 1.4 / preset.zoom)));
        triggerShutter();
    };

    // Next / Prev Scene with focus rack transition
    const nextScene = () => {
        setCurrentSceneIndex((prev) => (prev + 1) % PORTFOLIO_SCENES.length);
        triggerShutter();
    };

    const prevScene = () => {
        setCurrentSceneIndex((prev) => (prev - 1 + PORTFOLIO_SCENES.length) % PORTFOLIO_SCENES.length);
        triggerShutter();
    };

    // "Zoom Through Lens" Jesko Jets style portal transition
    const startZoomThroughTransition = () => {
        setIsZoomThroughOpen(true);
        setZoomThroughProgress(0);

        // Multi-stage cinematic zoom through optics
        let p = 0;
        const interval = setInterval(() => {
            p += 0.04;
            setZoomThroughProgress(Math.min(1, p));
            if (p >= 1) {
                clearInterval(interval);
            }
        }, 25);
    };

    const closeZoomThrough = () => {
        setIsZoomThroughOpen(false);
        setZoomThroughProgress(0);
    };

    return (
        <div className="cine-lens-wrapper">
            {/* Header Badge & Context: Reference to Jesko Jets-style Camera Portal */}
            <div className="cine-lens-top-bar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
                        color: '#fef3c7',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: 'clamp(0.68rem, 2vw, 0.75rem)',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <Aperture size={13} color="#f59e0b" />
                        Through The Lens • Cine Optics
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }} className="hidden sm:inline">
                        Optical Zoom &amp; Transition
                    </span>
                </div>

                {/* HUD toggle & Zoom Through CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                        onClick={() => setShowHud(!showHud)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            background: showHud ? '#f4f4f5' : '#ffffff',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            padding: '0.35rem 0.65rem',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: '#374151',
                            cursor: 'pointer'
                        }}
                    >
                        <Eye size={12} /> {showHud ? 'Hide HUD' : 'Show HUD'}
                    </button>

                    <button
                        onClick={startZoomThroughTransition}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.38rem 0.85rem',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
                        }}
                    >
                        <Maximize2 size={12} /> Zoom Through
                    </button>
                </div>
            </div>

            {/* ── MAIN CINE CAMERA LENS PORTAL CONTAINER ──────────────── */}
            <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                className="cine-lens-viewport-box"
            >
                {/* Background Optical Flares & Bokeh Grid */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.15,
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #f59e0b 0%, transparent 65%)',
                    pointerEvents: 'none'
                }} />

                {/* ── 3D TILTED LENS BARREL ASSEMBLY ─────────────────────── */}
                <div
                    className="cine-lens-barrel"
                    style={{
                        transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                    }}
                >
                    {/* Outer Barrel Ring (Knurled Matte Black Metal) */}
                    <div className="cine-lens-outer-ring">
                        {/* Mechanical Knurling Texture */}
                        <div style={{
                            position: 'absolute',
                            inset: '4px',
                            borderRadius: '50%',
                            border: '2px dashed rgba(255,255,255,0.1)',
                            opacity: 0.7
                        }} />
                    </div>

                    {/* Luxury Red Cine Ring (Iconic Cinema Lens Accent) */}
                    <div className="cine-lens-red-ring" />

                    {/* Precision Engraved Gold Markings Ring */}
                    <div className="cine-lens-gold-ring">
                        {/* Circular Text / Lens Engravings */}
                        <div className="cine-lens-engraving-top">
                            BALAN MASTER CINE • {selectedFocal} • T1.4 Ø114mm
                        </div>

                        <div className="cine-lens-engraving-bottom">
                            OPTICAL MULTI-COATED • 8K RESOLUTION
                        </div>
                    </div>

                    {/* ── THE OPTICAL APERTURE VIEWPORT (Looking Through The Lens) ── */}
                    <div style={{
                        position: 'relative',
                        width: '78%',
                        height: '78%',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: '#000',
                        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.95), 0 0 25px rgba(0,0,0,0.6)',
                        cursor: 'grab'
                    }}>
                        {/* THE CINEMATIC IMAGE WITH OPTICAL ZOOM EFFECT */}
                        <div style={{
                            position: 'absolute',
                            inset: '-20%',
                            backgroundImage: `url(${scene.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transform: `scale(${zoom}) translate(${-tilt.x * 2.5}px, ${tilt.y * 2.5}px)`,
                            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), background-image 0.5s ease',
                            filter: 'contrast(1.08) saturate(1.12)'
                        }} />

                        {/* Aperture Blades Overlay (Expands & contracts with zoom/f-stop) */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            boxShadow: `inset 0 0 0 ${Math.round((1 - apertureSize) * 35)}px rgba(18, 18, 22, 0.92)`,
                            pointerEvents: 'none',
                            transition: 'box-shadow 0.35s ease'
                        }} />

                        {/* Curved Glass Optical Multi-Coating Flare (Cyan / Emerald / Magenta) */}
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            background: `radial-gradient(circle at ${40 + tilt.x * 1.5}% ${35 - tilt.y * 1.5}%, rgba(56, 189, 248, 0.32) 0%, rgba(16, 185, 129, 0.16) 35%, rgba(168, 85, 247, 0.12) 65%, transparent 80%)`,
                            pointerEvents: 'none',
                            mixBlendMode: 'screen',
                            transition: 'background 0.15s ease'
                        }} />

                        {/* Glass Convex Highlight Arc */}
                        <div style={{
                            position: 'absolute',
                            top: '8%',
                            left: '14%',
                            width: '45%',
                            height: '25%',
                            borderRadius: '50%',
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
                            transform: 'rotate(-25deg)',
                            filter: 'blur(3px)',
                            pointerEvents: 'none'
                        }} />

                        {/* Viewfinder HUD Overlay */}
                        {showHud && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                pointerEvents: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                padding: 'clamp(0.75rem, 3vw, 1.25rem)',
                                color: '#ffffff',
                                fontFamily: "'Courier New', Courier, monospace",
                                fontSize: 'clamp(0.62rem, 1.8vw, 0.72rem)',
                                textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                            }}>
                                {/* Top HUD: Recording status & Exposure */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444' }} />
                                        <span style={{ fontWeight: 800, letterSpacing: '0.1em' }}>4K RAW</span>
                                    </div>
                                    <div>[+0.3 EV]</div>
                                </div>

                                {/* Center Crosshair */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 36,
                                    height: 36,
                                    border: '1px solid rgba(255, 255, 255, 0.35)',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <div style={{ width: 6, height: 1, background: '#f59e0b' }} />
                                    <div style={{ height: 6, width: 1, background: '#f59e0b', position: 'absolute' }} />
                                </div>

                                {/* Bottom HUD: ISO, Shutter, Focal */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 'clamp(0.58rem, 1.6vw, 0.68rem)', fontWeight: 700 }}>
                                    <div>
                                        <div>ISO {scene.iso}</div>
                                        <div>{scene.shutter}</div>
                                    </div>
                                    <div style={{ textAlign: 'right', color: '#fde68a' }}>
                                        <div>{selectedFocal}</div>
                                        <div>{scene.fStop}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shutter Click Flash Recoil */}
                        {isShutterFlashing && (
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: '#ffffff',
                                opacity: 0.85,
                                pointerEvents: 'none',
                                animation: 'shutterFade 0.25s ease-out forwards'
                            }} />
                        )}
                    </div>
                </div>

                {/* Left/Right Scene Cycling Arrows */}
                <button
                    onClick={prevScene}
                    aria-label="Previous scene"
                    className="cine-lens-arrow-btn"
                    style={{ left: 'clamp(0.4rem, 2vw, 1.25rem)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    onClick={nextScene}
                    aria-label="Next scene"
                    className="cine-lens-arrow-btn"
                    style={{ right: 'clamp(0.4rem, 2vw, 1.25rem)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                >
                    <ChevronRight size={20} />
                </button>

                {/* Bottom Scene Info Bar */}
                <div className="cine-lens-info-pill">
                    <div style={{ fontSize: 'clamp(0.72rem, 2vw, 0.82rem)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {scene.title}
                    </div>
                    <div className="cine-lens-info-pill-divider" style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.25)' }} />
                    <div className="cine-lens-info-pill-location" style={{ fontSize: '0.75rem', color: '#d1d5db' }}>
                        {scene.location}
                    </div>
                    <div className="cine-lens-info-pill-divider" style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.25)' }} />
                    <div style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 600, flexShrink: 0 }}>
                        {currentSceneIndex + 1} / {PORTFOLIO_SCENES.length}
                    </div>
                </div>
            </div>

            {/* Mobile Touch & Gesture Hint */}
            <div className="cine-lens-mobile-hint" style={{ marginTop: '0.5rem' }}>
                <span>👆 Drag to tilt 3D lens • 👈 Swipe left/right to change scenes 👉</span>
            </div>

            {/* ── OPTICAL ZOOM & FOCAL LENGTH CONTROLLER ────────────────── */}
            <div className="cine-lens-controller-card">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                }}>
                    <div>
                        <div style={{ fontSize: 'clamp(0.82rem, 2vw, 0.88rem)', fontWeight: 800, color: '#111827' }}>
                            Optical Focal Length &amp; Zoom
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                            Simulates master cine primes with real-time barrel magnification
                        </div>
                    </div>

                    {/* Current Zoom Magnification Badge */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '0.28rem 0.65rem',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: 'clamp(0.74rem, 2vw, 0.82rem)'
                    }}>
                        <ZoomIn size={13} /> {zoom.toFixed(2)}x
                    </div>
                </div>

                {/* Focal Presets (24mm, 35mm, 50mm, 85mm, 135mm) */}
                <div className="cine-lens-presets-grid">
                    {FOCAL_PRESETS.map((preset) => {
                        const isSelected = selectedFocal === preset.label;
                        return (
                            <button
                                key={preset.label}
                                onClick={() => handleFocalSelect(preset)}
                                className="cine-lens-preset-btn"
                                style={{
                                    border: isSelected ? '2px solid #d97706' : '1px solid #e5e7eb',
                                    background: isSelected ? '#fffbeb' : '#fafafa',
                                    boxShadow: isSelected ? '0 4px 12px rgba(217, 119, 6, 0.18)' : 'none'
                                }}
                            >
                                <span style={{
                                    fontSize: 'clamp(0.78rem, 2.4vw, 0.95rem)',
                                    fontWeight: 800,
                                    color: isSelected ? '#b45309' : '#18181b'
                                }}>
                                    {preset.label}
                                </span>
                                <span style={{
                                    fontSize: 'clamp(0.58rem, 1.8vw, 0.7rem)',
                                    color: '#6b7280',
                                    marginTop: '0.1rem',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {preset.name}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Continuous Optical Zoom Slider & Click Shutter */}
                <div className="cine-lens-slider-row">
                    <div className="cine-lens-slider-inner">
                        <ZoomOut size={15} color="#6b7280" style={{ flexShrink: 0 }} />
                        <input
                            type="range"
                            min="0.75"
                            max="3.5"
                            step="0.05"
                            value={zoom}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setZoom(val);
                                setSelectedFocal(`${Math.round(val * 35)}mm`);
                            }}
                            style={{
                                flex: 1,
                                accentColor: '#d97706',
                                height: '6px',
                                cursor: 'pointer'
                            }}
                        />
                        <ZoomIn size={15} color="#6b7280" style={{ flexShrink: 0 }} />
                    </div>

                    {/* Snap Shutter Button */}
                    <button
                        onClick={triggerShutter}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            background: '#18181b',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.55rem 1.1rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        <Camera size={13} /> Click Shutter
                    </button>
                </div>
            </div>

            {/* ── FULL-SCREEN "ZOOM THROUGH LENS" MODAL TRANSITION ─────── */}
            {isZoomThroughOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: '#0a0a0d',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {/* Expanding Optical Tunnel Animation (Jesko Jets airplane window zoom-through) */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${scene.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: `scale(${1 + zoomThroughProgress * 2.5})`,
                        transition: 'transform 0.08s linear',
                        filter: `contrast(${1 + zoomThroughProgress * 0.1}) saturate(${1 + zoomThroughProgress * 0.15})`
                    }} />

                    {/* Expanding Lens Bezel Ring that dilates outwards */}
                    <div style={{
                        position: 'absolute',
                        width: '100vmin',
                        height: '100vmin',
                        borderRadius: '50%',
                        border: `${40 - zoomThroughProgress * 35}px solid #18181b`,
                        boxShadow: `0 0 0 2000px #0a0a0d`,
                        transform: `scale(${1 + zoomThroughProgress * 3.8})`,
                        opacity: 1 - zoomThroughProgress * 0.85,
                        pointerEvents: 'none'
                    }} />

                    {/* Optical Flare Flash during zoom */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at 50% 50%, rgba(254, 243, 199, 0.4) 0%, transparent 70%)',
                        opacity: zoomThroughProgress > 0.5 ? (1 - zoomThroughProgress) * 2 : zoomThroughProgress * 1.5,
                        pointerEvents: 'none',
                        mixBlendMode: 'screen'
                    }} />

                    {/* Top Bar with Close button */}
                    <div style={{
                        position: 'absolute',
                        top: 'clamp(0.85rem, 3vw, 1.5rem)',
                        left: 'clamp(0.85rem, 3vw, 1.5rem)',
                        right: 'clamp(0.85rem, 3vw, 1.5rem)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        zIndex: 20
                    }}>
                        <div style={{
                            color: '#ffffff',
                            fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
                            fontWeight: 800,
                            fontFamily: "'Playfair Display', Georgia, serif"
                        }}>
                            {scene.title}
                        </div>
                        <button
                            onClick={closeZoomThrough}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                color: '#ffffff',
                                border: '1px solid rgba(255,255,255,0.3)',
                                borderRadius: '999px',
                                padding: '0.4rem 0.95rem',
                                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            ✕ Exit
                        </button>
                    </div>

                    {/* Bottom Action: Book This Style */}
                    <div style={{
                        position: 'absolute',
                        bottom: 'clamp(1.25rem, 4vw, 2.5rem)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 20,
                        textAlign: 'center',
                        width: 'calc(100% - 2rem)',
                        maxWidth: '440px'
                    }}>
                        <div style={{ color: '#d1d5db', fontSize: '0.82rem', marginBottom: '0.65rem' }}>
                            Captured with Balan Master Cine Optics • {scene.location}
                        </div>
                        <button
                            onClick={() => {
                                closeZoomThrough();
                                if (onBookClick) onBookClick();
                            }}
                            style={{
                                background: '#d97706',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                width: '100%',
                                padding: '0.75rem 1.5rem',
                                fontSize: '0.92rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(217, 119, 6, 0.45)'
                            }}
                        >
                            Book This Photography Style
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
