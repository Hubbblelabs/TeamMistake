'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface OptimizedSphereProps {
    particleCount?: number;
    baseRadius?: number;
}

// --- Shape Generators ---

function generateSphere(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;
        const r = radius * (1 + Math.random() * 0.1);

        points[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        points[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
}

function generateLorenz(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    let x = 0.1, y = 0, z = 0;
    const dt = 0.005;
    const sigma = 10, rho = 28, beta = 8 / 3;
    const scale = radius * 0.2;

    for (let i = 0; i < count; i++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;

        points[i * 3] = x * scale;
        points[i * 3 + 1] = y * scale;
        points[i * 3 + 2] = (z - 25) * scale;
    }
    return points;
}

function generateDNA(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const height = radius * 4.0;
    const turns = 4;

    for (let i = 0; i < count; i++) {
        const t = Math.random();
        const strand = Math.random() > 0.5 ? 1 : -1;
        const angle = t * Math.PI * 2 * turns;

        // Helix
        let x = radius * Math.cos(angle + (strand * Math.PI));
        let y = (t - 0.5) * 2 * height;
        let z = radius * Math.sin(angle + (strand * Math.PI));

        // Fillers
        if (Math.random() < 0.2) {
            const ix = Math.random();
            x = radius * Math.cos(angle) * (2 * ix - 1);
            z = radius * Math.sin(angle) * (2 * ix - 1);
        }

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

function generateGalaxy(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const arms = 3;

    for (let i = 0; i < count; i++) {
        const t = i / count;
        const angle = t * Math.PI * 2 * arms;
        const armOffset = (Math.floor(Math.random() * arms) / arms) * Math.PI * 2;
        const r = t * radius * 2.5;

        const randomX = (Math.random() - 0.5) * (1 - t) * 1.5;
        const randomY = (Math.random() - 0.5) * (1 - t) * 1.5;
        const randomZ = (Math.random() - 0.5) * (1 - t) * 0.5;

        // XY plane spiral facing camera
        points[i * 3] = r * Math.cos(angle + armOffset) + randomX;
        points[i * 3 + 1] = r * Math.sin(angle + armOffset) + randomY;
        points[i * 3 + 2] = randomZ; // Flat depth
    }
    return points;
}

export default function OptimizedSphere({
    particleCount = 1500,
    baseRadius = 3.5,
}: OptimizedSphereProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const mousePos = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Responsive scaling
    const scaleFactor = Math.min(1, viewport.width / 15);
    const adjustedRadius = baseRadius * scaleFactor;

    // Color interpolation
    const colors = useMemo(() => {
        const arr = new Float32Array(particleCount * 3);
        const c1 = new THREE.Color('#dfff00'); // Green
        const c2 = new THREE.Color('#dfff00'); // Cyan

        for (let i = 0; i < particleCount; i++) {
            const mix = Math.random();
            const c = mix > 0.5 ? c1 : c2;
            arr[i * 3] = c.r;
            arr[i * 3 + 1] = c.g;
            arr[i * 3 + 2] = c.b;
        }
        return arr;
    }, [particleCount]);

    // Pre-generate shapes
    const shapes = useMemo(() => ({
        sphere: generateSphere(particleCount, adjustedRadius),
        lorenz: generateLorenz(particleCount, adjustedRadius * 1.2),
        dna: generateDNA(particleCount, adjustedRadius * 0.8),
        galaxy: generateGalaxy(particleCount, adjustedRadius * 0.9),
    }), [particleCount, adjustedRadius]);

    // Current positions
    const currentPositions = useMemo(() => new Float32Array(shapes.sphere), [shapes.sphere]);

    // Scroll Listener
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min(1, Math.max(0, scrollTop / (docHeight || 1)));
            setScrollProgress(progress);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;
        const time = state.clock.getElapsedTime();

        // Mouse tracking
        mousePos.current.x += (state.pointer.x - mousePos.current.x) * 0.05;
        mousePos.current.y += (state.pointer.y - mousePos.current.y) * 0.05;

        // Morph Logic
        let fromShape: Float32Array, toShape: Float32Array;
        let localProgress: number;

        if (scrollProgress < 0.33) {
            fromShape = shapes.sphere;
            toShape = shapes.lorenz;
            localProgress = scrollProgress / 0.33;
        } else if (scrollProgress < 0.66) {
            fromShape = shapes.lorenz;
            toShape = shapes.dna;
            localProgress = (scrollProgress - 0.33) / 0.33;
        } else {
            fromShape = shapes.dna;
            toShape = shapes.galaxy;
            localProgress = (scrollProgress - 0.66) / 0.34;
        }

        // Smooth Easing
        const t = Math.max(0, Math.min(1, localProgress));
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Lerp
            const x = fromShape[i3] * (1 - ease) + toShape[i3] * ease;
            const y = fromShape[i3 + 1] * (1 - ease) + toShape[i3 + 1] * ease;
            const z = fromShape[i3 + 2] * (1 - ease) + toShape[i3 + 2] * ease;

            // Breathing noise
            const noise = Math.sin(time * 0.5 + i * 0.1) * 0.03;

            positions[i3] = x + noise;
            positions[i3 + 1] = y + noise;
            positions[i3 + 2] = z;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Global Rotation
        pointsRef.current.rotation.y = time * 0.1 + mousePos.current.x * 0.5;
        pointsRef.current.rotation.x = mousePos.current.y * 0.5;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
