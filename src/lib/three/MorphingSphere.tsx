'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface MorphingSphereProps {
    particleCount?: number;
    baseRadius?: number;
    color?: string;
}

// Generate points on a sphere surface
function generateSpherePoints(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        const phi = Math.acos(-1 + (2 * i) / count);
        const theta = Math.sqrt(count * Math.PI) * phi;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

// Generate points in a torus shape
function generateTorusPoints(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const tubeRadius = radius * 0.4;

    for (let i = 0; i < count; i++) {
        const u = (i / count) * Math.PI * 2;
        const v = Math.random() * Math.PI * 2;

        const x = (radius + tubeRadius * Math.cos(v)) * Math.cos(u);
        const y = (radius + tubeRadius * Math.cos(v)) * Math.sin(u);
        const z = tubeRadius * Math.sin(v);

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

// Generate points scattered like an explosion
function generateScatterPoints(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = radius * (0.5 + Math.random() * 1.5);

        const x = r * Math.cos(theta) * Math.sin(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(phi);

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

// Generate wave/plane points
function generateWavePoints(count: number, radius: number): Float32Array {
    const points = new Float32Array(count * 3);
    const gridSize = Math.ceil(Math.sqrt(count));
    const spacing = (radius * 3) / gridSize;

    for (let i = 0; i < count; i++) {
        const ix = i % gridSize;
        const iy = Math.floor(i / gridSize);

        const x = (ix - gridSize / 2) * spacing;
        const y = (iy - gridSize / 2) * spacing;
        const z = 0;

        points[i * 3] = x;
        points[i * 3 + 1] = y;
        points[i * 3 + 2] = z;
    }
    return points;
}

export default function MorphingSphere({
    particleCount = 3000,
    baseRadius = 3,
    color = '#dfff00',
}: MorphingSphereProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const mousePos = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Pre-generate all shape positions
    const shapes = useMemo(() => ({
        sphere: generateSpherePoints(particleCount, baseRadius),
        torus: generateTorusPoints(particleCount, baseRadius * 1.2),
        scatter: generateScatterPoints(particleCount, baseRadius),
        wave: generateWavePoints(particleCount, baseRadius),
    }), [particleCount, baseRadius]);

    // Current positions for animation
    const currentPositions = useMemo(() =>
        new Float32Array(shapes.sphere), [shapes.sphere]
    );

    // Listen to scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min(1, scrollTop / (docHeight || 1));
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame((state) => {
        if (!pointsRef.current) return;

        // Track mouse
        mousePos.current.x = state.pointer.x * 0.5;
        mousePos.current.y = state.pointer.y * 0.5;

        const time = state.clock.getElapsedTime();
        const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

        // Determine which shapes to morph between based on scroll
        let fromShape: Float32Array, toShape: Float32Array;
        let localProgress: number;

        if (scrollProgress < 0.33) {
            fromShape = shapes.sphere;
            toShape = shapes.torus;
            localProgress = scrollProgress / 0.33;
        } else if (scrollProgress < 0.66) {
            fromShape = shapes.torus;
            toShape = shapes.scatter;
            localProgress = (scrollProgress - 0.33) / 0.33;
        } else {
            fromShape = shapes.scatter;
            toShape = shapes.wave;
            localProgress = (scrollProgress - 0.66) / 0.34;
        }

        // Smooth easing
        const easedProgress = localProgress * localProgress * (3 - 2 * localProgress);

        // Lerp between shapes
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Interpolate between shapes
            const x = THREE.MathUtils.lerp(fromShape[i3], toShape[i3], easedProgress);
            const y = THREE.MathUtils.lerp(fromShape[i3 + 1], toShape[i3 + 1], easedProgress);
            const z = THREE.MathUtils.lerp(fromShape[i3 + 2], toShape[i3 + 2], easedProgress);

            // Add subtle motion
            const noiseX = Math.sin(time * 0.5 + i * 0.01) * 0.05;
            const noiseY = Math.cos(time * 0.4 + i * 0.02) * 0.05;

            positions[i3] = x + noiseX;
            positions[i3 + 1] = y + noiseY;
            positions[i3 + 2] = z;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Rotate based on mouse
        pointsRef.current.rotation.y = mousePos.current.x * 0.3 + time * 0.1;
        pointsRef.current.rotation.x = mousePos.current.y * 0.2;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[currentPositions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.03}
                color={color}
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
