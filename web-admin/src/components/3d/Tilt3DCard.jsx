import React, { useState, useRef } from 'react';

export default function Tilt3DCard({
    children,
    style = {},
    className = '',
    maxTilt = 12,
    glare = true,
    scale = 1.02,
    ...props
}) {
    const cardRef = useRef(null);
    const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    const [glareStyle, setGlareStyle] = useState({ opacity: 0, x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const percentX = clientX / rect.width;
        const percentY = clientY / rect.height;

        const rotX = -((percentY - 0.5) * maxTilt * 2);
        const rotY = (percentX - 0.5) * maxTilt * 2;

        setTransform(`perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`);

        if (glare) {
            setGlareStyle({
                opacity: 0.35,
                x: percentX * 100,
                y: percentY * 100
            });
        }
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
        setGlareStyle((prev) => ({ ...prev, opacity: 0 }));
    };

    return (
        <div
            ref={cardRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transform,
                transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
            {...props}
        >
            {children}

            {/* Specular 3D Glare Overlay */}
            {glare && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                        background: `radial-gradient(circle at ${glareStyle.x}% ${glareStyle.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.1) 40%, rgba(255, 255, 255, 0) 70%)`,
                        opacity: glareStyle.opacity,
                        transition: isHovered ? 'opacity 0.15s ease' : 'opacity 0.5s ease',
                        mixBlendMode: 'overlay',
                        borderRadius: 'inherit',
                        zIndex: 10
                    }}
                />
            )}
        </div>
    );
}
