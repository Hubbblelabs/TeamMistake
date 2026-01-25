'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface RadialParticlesProps {
    count?: number;
    color?: string;
}

export default function RadialParticles({
    count = 2000,
    color = '#dfff00',
}: RadialParticlesProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Generate radial particle positions - concentrated at bottom
    const { positions, originalPositions, sizes } = useMemo(() => {
        const pos: number[] = [];
        const siz: number[] = [];

        for (let i = 0; i < count; i++) {
            // Radial distribution from center-bottom
            const angle = (Math.random() - 0.5) * Math.PI * 1.5; // Spread across bottom arc
            const radius = Math.random() * 15 + 2; // Distance from center

            // Position with bottom concentration
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius * 0.6 - 3; // Push down and compress vertically
            const z = (Math.random() - 0.5) * 3;

            pos.push(x, y, z);

            // Smaller sizes for distant particles
            const size = Math.random() * 0.04 + 0.01;
            siz.push(size);
        }

        return {
            positions: new Float32Array(pos),
            originalPositions: new Float32Array(pos),
            sizes: new Float32Array(siz),
        };
    }, [count]);

    useFrame((state) => {
        if (!pointsRef.current) return;

        // Track mouse
        mousePos.current.x = state.pointer.x * viewport.width * 0.3;
        mousePos.current.y = state.pointer.y * viewport.height * 0.3;

        const time = state.clock.getElapsedTime();
        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            const ox = originalPositions[i3];
            const oy = originalPositions[i3 + 1];
            const oz = originalPositions[i3 + 2];

            // Gentle floating motion
            const floatX = Math.sin(time * 0.3 + i * 0.01) * 0.1;
            const floatY = Math.cos(time * 0.2 + i * 0.02) * 0.1;

            // Mouse repulsion
            const dx = ox - mousePos.current.x;
            const dy = oy - mousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let pushX = 0, pushY = 0;
            if (dist < 3) {
                const force = (3 - dist) * 0.15;
                pushX = (dx / dist) * force;
                pushY = (dy / dist) * force;
            }

            posArray[i3] = ox + floatX + pushX;
            posArray[i3 + 1] = oy + floatY + pushY;
            posArray[i3 + 2] = oz;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Slow rotation
        pointsRef.current.rotation.z = Math.sin(time * 0.05) * 0.02;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color={color}
                transparent
                opacity={0.7}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
