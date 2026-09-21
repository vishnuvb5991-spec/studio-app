import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Camera } from 'lucide-react';

const CAROUSEL_ITEMS = [
    {
        id: 1,
        title: 'Traditional Kerala Wedding',
        location: 'Thrissur',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        tag: 'Wedding'
    },
    {
        id: 2,
        title: 'Sunset Lake Story',
        location: 'Kochi Backwaters',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
        tag: 'Pre-Wedding'
    },
    {
        id: 3,
        title: 'Candid Bridal Moments',
        location: 'Guruvayur',
        image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&auto=format&fit=crop&q=80',
        tag: 'Candid'
    },
    {
        id: 4,
        title: 'Temple Vows & Blessings',
        location: 'Palakkad Heritage',
        image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80',
        tag: 'Ceremony'
    },
    {
        id: 5,
        title: 'Grand Palace Reception',
        location: 'Lulu Convention Centre',
        image: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&auto=format&fit=crop&q=80',
        tag: 'Reception'
    },
    {
        id: 6,
        title: 'Golden Hour Engagement',
        location: 'Athirappilly',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
        tag: 'Engagement'
    }
];

export default function Gallery3DCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartX, setDragStartX] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const autoRotateRef = useRef(null);

    const total = CAROUSEL_ITEMS.length;
    const angleStep = 360 / total;
    const radius = 340; // Cylinder radius in 3D pixels

    // Auto-spin every 4 seconds when not hovered or dragged
    useEffect(() => {
        if (isHovered || isDragging) {
            clearInterval(autoRotateRef.current);
            return;
        }

        autoRotateRef.current = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 3800);

        return () => clearInterval(autoRotateRef.current);
    }, [isHovered, isDragging, total]);

    // Drag handlers for mouse & touch
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStartX(e.clientX || (e.touches && e.touches[0].clientX));
        setDragOffset(0);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX || (e.touches && e.touches[0].clientX);
        const diff = currentX - dragStartX;
        setDragOffset(diff);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (dragOffset > 45) {
            setCurrentIndex((prev) => (prev - 1 + total) % total);
        } else if (dragOffset < -45) {
            setCurrentIndex((prev) => (prev + 1) % total);
        }
        setDragOffset(0);
    };

    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + total) % total);
    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % total);

    return (
        <section
            id="gallery"
            style={{
                padding: '110px 24px 130px',
                background: 'linear-gradient(180deg, #f5f5f0 0%, #ebe7dc 100%)',
                overflow: 'hidden',
                position: 'relative',
                textAlign: 'center'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                if (isDragging) handleMouseUp();
            }}
        >
            {/* Header */}
            <div style={{ maxWidth: 700, margin: '0 auto 3.5rem' }}>
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: '#92400e',
                    background: '#fef3c7',
                    border: '1px solid #fde68a',
                    borderRadius: '999px',
                    padding: '0.35rem 0.95rem',
                    marginBottom: '1rem'
                }}>
                    <Sparkles size={13} /> 3D Spatial Gallery
                </div>

                <h2 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: '#111',
                    marginBottom: '0.85rem'
                }}>
                    Spin Through Our Stories
                </h2>

                <p style={{ color: '#666', fontSize: '1.02rem', lineHeight: 1.7, maxWidth: 540, margin: '0 auto' }}>
                    Drag, swipe, or click arrows to explore recent wedding albums captured across Kerala in full 3D perspective.
                </p>
            </div>

            {/* 3D Scene Viewport */}
            <div
                style={{
                    perspective: '1200px',
                    perspectiveOrigin: '50% 48%',
                    height: 440,
                    maxWidth: 1100,
                    margin: '0 auto',
                    position: 'relative',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    touchAction: 'pan-y'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                {/* 3D Rotating Ring */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        transformStyle: 'preserve-3d',
                        transform: `rotateY(${-currentIndex * angleStep + (dragOffset * 0.18)}deg)`,
                        transition: isDragging ? 'none' : 'transform 0.65s cubic-bezier(0.2, 0.8, 0.2, 1)'
                    }}
                >
                    {CAROUSEL_ITEMS.map((item, idx) => {
                        const itemAngle = idx * angleStep;
                        const isCurrent = idx === currentIndex;

                        return (
                            <div
                                key={item.id}
                                onClick={() => setCurrentIndex(idx)}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    width: 270,
                                    height: 370,
                                    marginLeft: -135,
                                    marginTop: -185,
                                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                                    transformStyle: 'preserve-3d',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    background: '#ffffff',
                                    boxShadow: isCurrent
                                        ? '0 30px 60px rgba(0, 0, 0, 0.35), 0 0 0 2px #d4af37'
                                        : '0 15px 35px rgba(0, 0, 0, 0.18)',
                                    opacity: isCurrent ? 1 : 0.68,
                                    filter: isCurrent ? 'none' : 'blur(0.5px) brightness(0.9)',
                                    transition: 'opacity 0.4s ease, filter 0.4s ease, box-shadow 0.4s ease',
                                    cursor: 'pointer'
                                }}
                            >
                                {/* Card Photo */}
                                <div style={{ height: '68%', width: '100%', overflow: 'hidden', position: 'relative' }}>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                        draggable={false}
                                    />
                                    {/* Tag Badge */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        background: 'rgba(0,0,0,0.65)',
                                        backdropFilter: 'blur(8px)',
                                        color: '#fff',
                                        fontSize: '0.68rem',
                                        fontWeight: 700,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '999px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.08em'
                                    }}>
                                        {item.tag}
                                    </div>
                                </div>

                                {/* Card Details */}
                                <div style={{ padding: '1.1rem 1.25rem', textAlign: 'left', background: '#ffffff' }}>
                                    <h3 style={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        fontSize: '1.08rem',
                                        fontWeight: 700,
                                        color: '#18181b',
                                        marginBottom: '0.25rem',
                                        lineHeight: 1.25
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: '#71717a', margin: 0, fontWeight: 500 }}>
                                        <span style={{ color: '#d97706', fontWeight: 600 }}>{item.location}</span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Navigation Controls */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                marginTop: '2.5rem'
            }}>
                <button
                    onClick={handlePrev}
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '1.5px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="Previous Story"
                >
                    <ChevronLeft size={20} color="#18181b" />
                </button>

                {/* Dot Indicators */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {CAROUSEL_ITEMS.map((_, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            style={{
                                width: idx === currentIndex ? 24 : 8,
                                height: 8,
                                borderRadius: '999px',
                                background: idx === currentIndex ? '#18181b' : 'rgba(0,0,0,0.2)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={handleNext}
                    style={{
                        width: 46,
                        height: 46,
                        borderRadius: '50%',
                        background: '#ffffff',
                        border: '1.5px solid rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    title="Next Story"
                >
                    <ChevronRight size={20} color="#18181b" />
                </button>
            </div>
        </section>
    );
}
