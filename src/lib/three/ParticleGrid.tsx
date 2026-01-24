'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleGridProps {
    count?: number;
    color?: string;
    size?: number;
    radius?: number;
}

export default function ParticleGrid({
    count = 2000,
    color = '#d2d2d2',
    size = 0.015,
    radius = 2.5,
}: ParticleGridProps) {
    const points = useRef<THREE.Points>(null);

    // Generate points on a sphere
    const [positions, originalPositions, randoms] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const originalPositions = new Float32Array(count * 3);
        const randoms = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);

            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            originalPositions[i * 3] = x;
            originalPositions[i * 3 + 1] = y;
            originalPositions[i * 3 + 2] = z;

            randoms[i] = Math.random();
        }
        return [positions, originalPositions, randoms];
    }, [count, radius]);

    useFrame((state) => {
        if (!points.current) return;

        const time = state.clock.getElapsedTime();
        const positionsAttr = points.current.geometry.attributes.position;
        const positionsArray = positionsAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const originalX = originalPositions[i3];
            const originalY = originalPositions[i3 + 1];
            const originalZ = originalPositions[i3 + 2];

            // Per-particle noise/wave movement
            // We use the original position to create a stable noise field
            // Creating a "breathing" and "undulating" effect

            const noiseInput = originalX * 0.5 + time * 0.5;
            const distortion = Math.sin(noiseInput) * 0.2 +
                Math.cos(originalY * 0.5 + time * 0.3) * 0.2;

            // Apply radial distortion (breathing)
            const scale = 1 + distortion * 0.3;

            positionsArray[i3] = originalX * scale;
            positionsArray[i3 + 1] = originalY * scale;
            positionsArray[i3 + 2] = originalZ * scale;
        }

        positionsAttr.needsUpdate = true;

        // Slow rotation of the entire system
        points.current.rotation.y = time * 0.05;
        points.current.rotation.z = time * 0.02;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={size}
                color={color}
                sizeAttenuation={true}
                transparent={true}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

// Keep connection component for compatibility but export empty or new logic if needed
// For this design, we don't strictly need lines, but we can keep it as a no-op or simple variant
export function ParticleConnections() {
    return null;
}
