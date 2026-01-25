'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
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
        const r = radius * (1 + Math.random() * 0.05);

        points[i * 3] = r * Math.cos(theta) * Math.sin(phi);
        points[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
        points[i * 3 + 2] = r * Math.cos(phi);
    }
    return points;
}

function generateCube(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const size = radius * 1.5;

    for (let i = 0; i < count; i++) {
        const face = Math.floor(Math.random() * 6);
        let x = (Math.random() - 0.5) * 2 * size;
        let y = (Math.random() - 0.5) * 2 * size;
        let z = (Math.random() - 0.5) * 2 * size;

        switch (face) {
            case 0: x = size; break;
            case 1: x = -size; break;
            case 2: y = size; break;
            case 3: y = -size; break;
            case 4: z = size; break;
            case 5: z = -size; break;
        }

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

function generatePyramid(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const height = radius * 2.5;
    const baseSize = radius * 1.8;

    for (let i = 0; i < count; i++) {
        const t = Math.random();

        if (t < 0.25) {
            const u = (Math.random() - 0.5) * 2 * baseSize;
            const v = (Math.random() - 0.5) * 2 * baseSize;
            points[i * 3] = u;
            points[i * 3 + 1] = -height / 2;
            points[i * 3 + 2] = v;
        } else {
            const h = Math.random();
            const angle = Math.random() * Math.PI * 2;
            const currentRadius = baseSize * (1 - h);

            points[i * 3] = currentRadius * Math.cos(angle);
            points[i * 3 + 1] = -height / 2 + h * height;
            points[i * 3 + 2] = currentRadius * Math.sin(angle);
        }
    }
    return points;
}

function generateTorus(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const R = radius * 1.2;
    const r = radius * 0.4;

    for (let i = 0; i < count; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;

        points[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
        points[i * 3 + 1] = (R + r * Math.cos(v)) * Math.sin(u);
        points[i * 3 + 2] = r * Math.sin(v);
    }
    return points;
}

function generateIcosahedron(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const phi = (1 + Math.sqrt(5)) / 2;

    const vertices: [number, number, number][] = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    const faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    for (let i = 0; i < count; i++) {
        const faceIdx = Math.floor(Math.random() * faces.length);
        const face = faces[faceIdx];

        let u = Math.random();
        let v = Math.random();
        if (u + v > 1) {
            u = 1 - u;
            v = 1 - v;
        }
        const w = 1 - u - v;

        const v0 = vertices[face[0]];
        const v1 = vertices[face[1]];
        const v2 = vertices[face[2]];

        const x = (v0[0] * u + v1[0] * v + v2[0] * w) * radius * 0.8;
        const y = (v0[1] * u + v1[1] * v + v2[1] * w) * radius * 0.8;
        const z = (v0[2] * u + v1[2] * v + v2[2] * w) * radius * 0.8;

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

function generateOctahedron(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const size = radius * 1.5;

    const vertices: [number, number, number][] = [
        [0, size, 0], [0, -size, 0],
        [size, 0, 0], [-size, 0, 0],
        [0, 0, size], [0, 0, -size]
    ];

    const faces = [
        [0, 4, 2], [0, 2, 5], [0, 5, 3], [0, 3, 4],
        [1, 2, 4], [1, 5, 2], [1, 3, 5], [1, 4, 3]
    ];

    for (let i = 0; i < count; i++) {
        const faceIdx = Math.floor(Math.random() * faces.length);
        const face = faces[faceIdx];

        let u = Math.random();
        let v = Math.random();
        if (u + v > 1) {
            u = 1 - u;
            v = 1 - v;
        }
        const w = 1 - u - v;

        const v0 = vertices[face[0]];
        const v1 = vertices[face[1]];
        const v2 = vertices[face[2]];

        points[i * 3] = v0[0] * u + v1[0] * v + v2[0] * w;
        points[i * 3 + 1] = v0[1] * u + v1[1] * v + v2[1] * w;
        points[i * 3 + 2] = v0[2] * u + v1[2] * v + v2[2] * w;
    }
    return points;
}

// Detect if device is low-powered
function getOptimalParticleCount(baseCount: number): number {
    if (typeof window === 'undefined') return baseCount;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
    const hasLowMemory = (navigator as { deviceMemory?: number }).deviceMemory !== undefined
        && (navigator as { deviceMemory?: number }).deviceMemory! < 4;
    const hasSlowConnection = (navigator as { connection?: { effectiveType?: string } }).connection?.effectiveType === '2g'
        || (navigator as { connection?: { effectiveType?: string } }).connection?.effectiveType === 'slow-2g';

    if (isMobile || hasLowMemory || hasSlowConnection) {
        return Math.floor(baseCount * 0.4); // 40% for low-power devices
    }
    return baseCount;
}

export default function OptimizedSphere({
    particleCount: baseParticleCount = 5000,
    baseRadius = 3.5,
}: OptimizedSphereProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const mousePos = useRef({ x: 0, y: 0 });
    const lastFrameTime = useRef(0);
    const { viewport } = useThree();

    // Adaptive particle count based on device capability
    const particleCount = useMemo(() =>
        getOptimalParticleCount(baseParticleCount),
        [baseParticleCount]
    );

    // Responsive scaling
    const scaleFactor = Math.min(1, viewport.width / 15);
    const adjustedRadius = baseRadius * scaleFactor;

    // Color palette with yellow/gold primary
    const colors = useMemo(() => {
        const arr = new Float32Array(particleCount * 3);
        const c1 = new THREE.Color('#ffd700'); // Gold yellow
        const c2 = new THREE.Color('#ffaa00'); // Orange-yellow
        const c3 = new THREE.Color('#ffffff'); // White accent

        for (let i = 0; i < particleCount; i++) {
            const mix = Math.random();
            let c: THREE.Color;
            if (mix < 0.55) {
                c = c1;
            } else if (mix < 0.85) {
                c = c2;
            } else {
                c = c3;
            }
            arr[i * 3] = c.r;
            arr[i * 3 + 1] = c.g;
            arr[i * 3 + 2] = c.b;
        }
        return arr;
    }, [particleCount]);

    // Pre-generate all geometric shapes
    const shapes = useMemo(() => ({
        sphere: generateSphere(particleCount, adjustedRadius),
        cube: generateCube(particleCount, adjustedRadius),
        pyramid: generatePyramid(particleCount, adjustedRadius),
        torus: generateTorus(particleCount, adjustedRadius),
        icosahedron: generateIcosahedron(particleCount, adjustedRadius),
        octahedron: generateOctahedron(particleCount, adjustedRadius),
    }), [particleCount, adjustedRadius]);

    // Current positions buffer
    const currentPositions = useMemo(() =>
        new Float32Array(shapes.sphere),
        [shapes.sphere]
    );

    // Throttled scroll handler for performance
    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(1, Math.max(0, scrollTop / (docHeight || 1)));
        setScrollProgress(progress);
    }, []);

    // Scroll listener with passive flag
    useEffect(() => {
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (pointsRef.current) {
                pointsRef.current.geometry.dispose();
                if (pointsRef.current.material instanceof THREE.Material) {
                    pointsRef.current.material.dispose();
                }
            }
        };
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;

        // Frame rate throttling - skip frames if running too slow
        const now = performance.now();
        const deltaMs = now - lastFrameTime.current;
        if (deltaMs < 16) return; // Cap at ~60fps
        lastFrameTime.current = now;

        const time = state.clock.getElapsedTime();

        // Smooth mouse tracking
        mousePos.current.x += (state.pointer.x - mousePos.current.x) * 0.025;
        mousePos.current.y += (state.pointer.y - mousePos.current.y) * 0.025;

        // 6-shape morph sequence
        let fromShape: Float32Array, toShape: Float32Array;
        let localProgress: number;
        const segment = 1 / 5;

        if (scrollProgress < segment) {
            fromShape = shapes.sphere;
            toShape = shapes.cube;
            localProgress = scrollProgress / segment;
        } else if (scrollProgress < segment * 2) {
            fromShape = shapes.cube;
            toShape = shapes.pyramid;
            localProgress = (scrollProgress - segment) / segment;
        } else if (scrollProgress < segment * 3) {
            fromShape = shapes.pyramid;
            toShape = shapes.torus;
            localProgress = (scrollProgress - segment * 2) / segment;
        } else if (scrollProgress < segment * 4) {
            fromShape = shapes.torus;
            toShape = shapes.icosahedron;
            localProgress = (scrollProgress - segment * 3) / segment;
        } else {
            fromShape = shapes.icosahedron;
            toShape = shapes.octahedron;
            localProgress = (scrollProgress - segment * 4) / segment;
        }

        // Smooth cubic easing
        const t = Math.max(0, Math.min(1, localProgress));
        const ease = t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        // Optimized loop - minimize operations inside
        const timeOffset = time * 0.3;
        const invEase = 1 - ease;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Interpolate between shapes
            positions[i3] = fromShape[i3] * invEase + toShape[i3] * ease + Math.sin(timeOffset + i * 0.05) * 0.012;
            positions[i3 + 1] = fromShape[i3 + 1] * invEase + toShape[i3 + 1] * ease + Math.cos(timeOffset * 1.3 + i * 0.07) * 0.012;
            positions[i3 + 2] = fromShape[i3 + 2] * invEase + toShape[i3 + 2] * ease + Math.sin(timeOffset * 1.1 + i * 0.06) * 0.008;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Slow global rotation with mouse influence
        pointsRef.current.rotation.y = time * 0.06 + mousePos.current.x * 0.25;
        pointsRef.current.rotation.x = time * 0.015 + mousePos.current.y * 0.15;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[currentPositions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.02}
                vertexColors
                transparent
                opacity={0.85}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
