import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3DCanvas() {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const width = container.clientWidth || 500;
        const height = container.clientHeight || 500;

        // Scene
        const scene = new THREE.Scene();

        // Camera
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0, 8);

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        // Key light (warm golden)
        const keyLight = new THREE.DirectionalLight(0xffe8c2, 3.0);
        keyLight.position.set(5, 6, 7);
        scene.add(keyLight);

        // Rim light (cool studio teal/magenta)
        const rimLight = new THREE.DirectionalLight(0x70d6ff, 2.2);
        rimLight.position.set(-6, -3, -4);
        scene.add(rimLight);

        // Accent pink/gold point light
        const accentLight = new THREE.PointLight(0xff6b9d, 3.5, 15);
        accentLight.position.set(0, 3, 3);
        scene.add(accentLight);

        // ─── 3D CAMERA LENS ASSEMBLY ───────────────────────────
        const lensGroup = new THREE.Group();

        // Materials
        const darkMetalMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a1f,
            metalness: 0.85,
            roughness: 0.25,
        });

        const brushedSteelMat = new THREE.MeshStandardMaterial({
            color: 0x3a3a42,
            metalness: 0.95,
            roughness: 0.2,
        });

        const goldAccentMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.92,
            roughness: 0.22,
        });

        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xa5e5ff,
            transmission: 0.9,
            opacity: 1,
            transparent: true,
            roughness: 0.05,
            ior: 1.52,
            metalness: 0.05,
            clearcoat: 1.0,
            clearcoatRoughness: 0.05,
            reflectivity: 0.9
        });

        const redRingMat = new THREE.MeshBasicMaterial({
            color: 0xef4444
        });

        // 1. Base Barrel (Main Body)
        const baseGeo = new THREE.CylinderGeometry(1.65, 1.75, 1.8, 48);
        const baseMesh = new THREE.Mesh(baseGeo, darkMetalMat);
        baseMesh.rotation.x = Math.PI / 2;
        lensGroup.add(baseMesh);

        // 2. Signature Luxury Red Ring (Leica / Canon L series inspired)
        const redRingGeo = new THREE.TorusGeometry(1.68, 0.04, 16, 64);
        const redRing = new THREE.Mesh(redRingGeo, redRingMat);
        redRing.position.z = 0.55;
        lensGroup.add(redRing);

        // 3. Knurled Focus Grip Ring
        const gripGeo = new THREE.CylinderGeometry(1.72, 1.72, 0.7, 48);
        const gripMesh = new THREE.Mesh(gripGeo, brushedSteelMat);
        gripMesh.rotation.x = Math.PI / 2;
        gripMesh.position.z = -0.15;
        lensGroup.add(gripMesh);

        // 4. Gold Aperture Indicator Ring
        const goldRingGeo = new THREE.TorusGeometry(1.71, 0.045, 16, 64);
        const goldRing = new THREE.Mesh(goldRingGeo, goldAccentMat);
        goldRing.position.z = 0.92;
        lensGroup.add(goldRing);

        // 5. Front Filter Thread Bezel
        const frontBezelGeo = new THREE.CylinderGeometry(1.58, 1.68, 0.45, 48);
        const frontBezel = new THREE.Mesh(frontBezelGeo, darkMetalMat);
        frontBezel.rotation.x = Math.PI / 2;
        frontBezel.position.z = 1.15;
        lensGroup.add(frontBezel);

        // 6. Aperture Blades Cone (Interior)
        const apertureConeGeo = new THREE.ConeGeometry(1.4, 0.8, 10, 1, true);
        const apertureConeMat = new THREE.MeshStandardMaterial({
            color: 0x08080a,
            metalness: 0.6,
            roughness: 0.5,
            side: THREE.DoubleSide
        });
        const apertureCone = new THREE.Mesh(apertureConeGeo, apertureConeMat);
        apertureCone.rotation.x = -Math.PI / 2;
        apertureCone.position.z = 0.8;
        lensGroup.add(apertureCone);

        // 7. Convex Front Glass Element
        const glassGeo = new THREE.SphereGeometry(1.45, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2.8);
        const glassMesh = new THREE.Mesh(glassGeo, glassMat);
        glassMesh.position.z = 1.05;
        lensGroup.add(glassMesh);

        // 8. Secondary Inner Glass Element
        const innerGlassGeo = new THREE.SphereGeometry(1.15, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2.5);
        const innerGlassMesh = new THREE.Mesh(innerGlassGeo, glassMat);
        innerGlassMesh.position.z = 0.6;
        lensGroup.add(innerGlassMesh);

        // Initial orientation
        lensGroup.rotation.y = -0.35;
        lensGroup.rotation.x = 0.2;
        scene.add(lensGroup);

        // ─── FLOATING GOLDEN BOKEH PARTICLES ──────────────────
        const particleCount = 120;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 12;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
            scales[i] = Math.random() * 0.4 + 0.15;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

        // Create round bokeh particle texture
        const particleCanvas = document.createElement('canvas');
        particleCanvas.width = 64;
        particleCanvas.height = 64;
        const ctx = particleCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(255, 230, 160, 1)');
        grad.addColorStop(0.3, 'rgba(245, 180, 80, 0.6)');
        grad.addColorStop(0.8, 'rgba(230, 120, 50, 0.15)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
        const particleTexture = new THREE.CanvasTexture(particleCanvas);

        const particleMat = new THREE.PointsMaterial({
            size: 0.35,
            map: particleTexture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            color: 0xffd27d
        });

        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        // ─── INTERACTION & SMOOTH LERP ────────────────────────
        let mouseX = 0;
        let mouseY = 0;
        let targetRotX = 0.2;
        let targetRotY = -0.35;

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            mouseX = x;
            mouseY = y;
            targetRotY = mouseX * 1.2 - 0.25;
            targetRotX = -mouseY * 0.9 + 0.15;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Touch support for mobile
        const handleTouchMove = (e) => {
            if (!e.touches[0]) return;
            const rect = container.getBoundingClientRect();
            const x = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
            const y = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
            targetRotY = x * 1.2 - 0.25;
            targetRotX = -y * 0.9 + 0.15;
        };
        container.addEventListener('touchmove', handleTouchMove, { passive: true });

        // Resize handler
        const handleResize = () => {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // IntersectionObserver to pause loop when offscreen
        let isVisible = true;
        const observer = new IntersectionObserver(([entry]) => {
            isVisible = entry.isIntersecting;
        }, { threshold: 0.1 });
        observer.observe(container);

        // Animation Loop
        let frameId;
        let clock = new THREE.Clock();

        const animate = () => {
            frameId = requestAnimationFrame(animate);

            if (!isVisible) return;

            const elapsedTime = clock.getElapsedTime();

            // Smooth spring lerp for camera lens rotation
            lensGroup.rotation.y += (targetRotY - lensGroup.rotation.y) * 0.05;
            lensGroup.rotation.x += (targetRotX - lensGroup.rotation.x) * 0.05;

            // Gentle floating breathing motion
            lensGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;
            lensGroup.position.x = Math.cos(elapsedTime * 0.9) * 0.08;

            // Rotate aperture indicator slowly
            goldRing.rotation.z = elapsedTime * 0.15;

            // Animate particles (gentle orbit + upward drift)
            particles.rotation.y = elapsedTime * 0.04;
            const posArray = particleGeo.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                posArray[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.002;
            }
            particleGeo.attributes.position.needsUpdate = true;

            renderer.render(scene, camera);
        };

        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            observer.disconnect();
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            container.removeEventListener('touchmove', handleTouchMove);

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            // Dispose Three resources
            renderer.dispose();
            particleGeo.dispose();
            particleMat.dispose();
            particleTexture.dispose();
            scene.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                    else obj.material.dispose();
                }
            });
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                minHeight: 480,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'grab'
            }}
            title="Move your mouse to interact with the 3D Studio Lens"
        />
    );
}
