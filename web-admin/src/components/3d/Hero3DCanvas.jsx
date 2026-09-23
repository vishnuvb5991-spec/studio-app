import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCw, Sparkles } from 'lucide-react';

export default function Hero3DCanvas() {
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const isPlayingRef = useRef(true);
    const lensGroupRef = useRef(null);

    // Keep ref in sync with state for animation loop
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || 500;
        const height = container.clientHeight || 500;

        // ── Scene ──
        const scene = new THREE.Scene();

        // ── Camera ──
        const isMobile = width < 520;
        const camera = new THREE.PerspectiveCamera(isMobile ? 48 : 42, width / height, 0.1, 100);
        camera.position.set(0, 0, isMobile ? 9.2 : 7.5);

        // ── WebGL Renderer ──
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.35;
        container.appendChild(renderer.domElement);

        // ── Studio Lighting ──
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        // Key Light (warm golden spotlight)
        const keyLight = new THREE.DirectionalLight(0xffecd2, 3.5);
        keyLight.position.set(4, 5, 6);
        scene.add(keyLight);

        // Rim Light (cool cinematic cyan/violet)
        const rimLight = new THREE.DirectionalLight(0x70d6ff, 3.0);
        rimLight.position.set(-6, -3, -4);
        scene.add(rimLight);

        // Accent lens flare point light
        const flareLight = new THREE.PointLight(0xff9e79, 4.0, 12);
        flareLight.position.set(2, 2, 4);
        scene.add(flareLight);

        // ── 3D LENS GROUP ──
        const lensGroup = new THREE.Group();
        lensGroupRef.current = lensGroup;
        scene.add(lensGroup);

        // ── Materials ──
        const darkMetalMat = new THREE.MeshStandardMaterial({
            color: 0x18181c,
            metalness: 0.92,
            roughness: 0.2,
        });

        const goldAccentMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.95,
            roughness: 0.18,
        });

        const redRingMat = new THREE.MeshBasicMaterial({
            color: 0xef4444
        });

        // ── Texture Loader for Original 3D Lens ──
        const textureLoader = new THREE.TextureLoader();
        const lensTexture = textureLoader.load('/camera-lens-3d.jpg', (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
        });

        // 1. Front Lens Disc (displays the high-resolution 3D lens image)
        const frontDiscGeo = new THREE.CircleGeometry(2.15, 64);
        const frontDiscMat = new THREE.MeshStandardMaterial({
            map: lensTexture,
            roughness: 0.15,
            metalness: 0.25,
            side: THREE.DoubleSide
        });
        const frontDisc = new THREE.Mesh(frontDiscGeo, frontDiscMat);
        frontDisc.position.z = 0.65;
        lensGroup.add(frontDisc);

        // 2. Optical Glass Element in front of the disc (convex curve)
        const glassGeo = new THREE.SphereGeometry(2.18, 48, 24, 0, Math.PI * 2, 0, Math.PI / 3);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xc4f0ff,
            transmission: 0.75,
            opacity: 1,
            transparent: true,
            roughness: 0.04,
            ior: 1.54,
            metalness: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0.04,
            reflectivity: 0.9
        });
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.z = 0.68;
        lensGroup.add(glassMesh);

        // 3. Beveled Front Bezel (Outer Housing)
        const bezelGeo = new THREE.TorusGeometry(2.18, 0.14, 24, 64);
        const bezelMesh = new THREE.Mesh(bezelGeo, darkMetalMat);
        bezelMesh.position.z = 0.62;
        lensGroup.add(bezelMesh);

        // 4. Main Barrel (Cylinder Body behind the front element)
        const barrelGeo = new THREE.CylinderGeometry(2.18, 2.24, 1.4, 64);
        const barrelMesh = new THREE.Mesh(barrelGeo, darkMetalMat);
        barrelMesh.rotation.x = Math.PI / 2;
        barrelMesh.position.z = -0.05;
        lensGroup.add(barrelMesh);

        // 5. Signature Luxury Red Ring
        const redRingGeo = new THREE.TorusGeometry(2.22, 0.038, 16, 64);
        const redRing = new THREE.Mesh(redRingGeo, redRingMat);
        redRing.position.z = 0.35;
        lensGroup.add(redRing);

        // 6. Knurled Focus Grip Ring (Stepped)
        const gripGeo = new THREE.CylinderGeometry(2.26, 2.26, 0.6, 64);
        const gripMesh = new THREE.Mesh(gripGeo, darkMetalMat);
        gripMesh.rotation.x = Math.PI / 2;
        gripMesh.position.z = -0.15;
        lensGroup.add(gripMesh);

        // 7. Gold Aperture Ring Indicator
        const goldRingGeo = new THREE.TorusGeometry(2.25, 0.045, 16, 64);
        const goldRing = new THREE.Mesh(goldRingGeo, goldAccentMat);
        goldRing.position.z = 0.55;
        lensGroup.add(goldRing);

        // 8. Back Mount Ring
        const backMountGeo = new THREE.CylinderGeometry(1.85, 2.05, 0.4, 48);
        const backMountMesh = new THREE.Mesh(backMountGeo, goldAccentMat);
        backMountMesh.rotation.x = Math.PI / 2;
        backMountMesh.position.z = -0.85;
        lensGroup.add(backMountMesh);

        // Initial 3D tilt
        lensGroup.rotation.y = -0.28;
        lensGroup.rotation.x = 0.15;

        // ── Floating Golden Bokeh Dust Particles ──
        const particleCount = 140;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 11;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 7;
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        // Circular bokeh particle texture
        const particleCanvas = document.createElement('canvas');
        particleCanvas.width = 64;
        particleCanvas.height = 64;
        const ctx = particleCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 235, 180, 1)');
        grad.addColorStop(0.35, 'rgba(245, 180, 80, 0.65)');
        grad.addColorStop(0.8, 'rgba(230, 120, 50, 0.18)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        const particleTexture = new THREE.CanvasTexture(particleCanvas);

        const particleMat = new THREE.PointsMaterial({
            size: 0.32,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: 0xffd27d
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // ── Interactive Mouse / Touch Tracking ──
        let mouseX = 0;
        let mouseY = 0;
        let targetRotX = 0.15;
        let targetRotY = -0.28;
        let isUserInteracting = false;
        let lastInteractionTime = 0;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            mouseX = x;
            mouseY = y;
            targetRotY = mouseX * 1.4;
            targetRotX = -mouseY * 1.1 + 0.1;
            isUserInteracting = true;
            lastInteractionTime = Date.now();
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Touch support
        const handleTouchMove = (e) => {
            if (!e.touches[0]) return;
            const rect = container.getBoundingClientRect();
            const x = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
            const y = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
            targetRotY = x * 1.4;
            targetRotX = -y * 1.1 + 0.1;
            isUserInteracting = true;
            lastInteractionTime = Date.now();
        };
        container.addEventListener('touchmove', handleTouchMove, { passive: true });

        // Resize handler
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.position.z = w < 520 ? 9.2 : 7.5;
            camera.fov = w < 520 ? 48 : 42;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Visibility observer
        let isVisible = true;
        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { threshold: 0.1 });
        observer.observe(container);

        // ── Animation Loop ──
        let frameId;
        const clock = new THREE.Clock();

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (!isVisible) return;

            const elapsedTime = clock.getElapsedTime();

            // Check if user stopped interacting recently (resume auto-spin if isPlaying)
            if (isUserInteracting && Date.now() - lastInteractionTime > 2500) {
                isUserInteracting = false;
            }

            if (isPlayingRef.current && !isUserInteracting) {
                // Continuous 3D auto-spin rotation
                lensGroup.rotation.y += 0.012;
                lensGroup.rotation.x = 0.12 + Math.sin(elapsedTime * 1.4) * 0.08;
            } else {
                // Smooth mouse tracking spring lerp
                lensGroup.rotation.y += (targetRotY - lensGroup.rotation.y) * 0.06;
                lensGroup.rotation.x += (targetRotX - lensGroup.rotation.x) * 0.06;
            }

            // Gentle breathing elevation
            lensGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

            // Rotate gold aperture ring independently for mechanical effect
            goldRing.rotation.z = elapsedTime * 0.35;

            // Bokeh dust orbital motion
            particles.rotation.y = elapsedTime * 0.04;

            renderer.render(scene, camera);
        };

        animate();

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('touchmove', handleTouchMove);

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            renderer.dispose();
            particleGeo.dispose();
            particleMat.dispose();
            particleTexture.dispose();
            lensTexture.dispose();
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                    else obj.material.dispose();
                }
            });
        };
    }, []);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const resetPosition = () => {
        if (lensGroupRef.current) {
            lensGroupRef.current.rotation.set(0.15, -0.28, 0);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 340 }}>
            {/* 3D WebGL Canvas Container */}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    minHeight: 340,
                    cursor: isPlaying ? 'pointer' : 'grab'
                }}
                title="Move cursor or touch to tilt 3D lens"
            />

            {/* Bottom Interactive Control Bar */}
            <div style={{
                position: 'absolute',
                bottom: 16,
                left: 18,
                right: 18,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 20
            }}>
                {/* Play / Pause 3D Spin Button */}
                <button
                    onClick={togglePlay}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        background: isPlaying ? 'rgba(217, 119, 6, 0.25)' : 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(12px)',
                        border: isPlaying ? '1px solid rgba(217, 119, 6, 0.5)' : '1px solid rgba(255, 255, 255, 0.25)',
                        color: isPlaying ? '#fde68a' : '#ffffff',
                        padding: '0.45rem 0.95rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                    }}
                >
                    {isPlaying ? (
                        <>
                            <Pause size={13} fill="currentColor" />
                            <span>Playing 360° Spin</span>
                        </>
                    ) : (
                        <>
                            <Play size={13} fill="currentColor" />
                            <span>Play 360° Spin</span>
                        </>
                    )}
                </button>

                {/* Reset & Tracking Status */}
                <button
                    onClick={resetPosition}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#cbd5e1',
                        padding: '0.45rem 0.8rem',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    title="Reset 3D angle"
                >
                    <RotateCw size={12} />
                    <span>Reset View</span>
                </button>
            </div>
        </div>
    );
}
