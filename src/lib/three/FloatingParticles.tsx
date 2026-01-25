'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingParticlesProps {
    count?: number;
    spread?: number;
    color?: string;
    accentColor?: string;
}

export default function FloatingParticles({
    count = 200,
    spread = 20,
    color = '#ffffff',
    accentColor = '#dfff00',
}: FloatingParticlesProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Generate random particle positions
    const { positions, velocities, sizes, colors } = useMemo(() => {
        const pos: number[] = [];
        const vel: number[] = [];
        const siz: number[] = [];
        const col: number[] = [];

        const colorMain = new THREE.Color(color);
        const colorAccent = new THREE.Color(accentColor);

        for (let i = 0; i < count; i++) {
            // Random position in a cube
            pos.push(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread * 0.5
            );

            // Random velocity (slow drift)
            vel.push(
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.005,
                (Math.random() - 0.5) * 0.002
            );

            // Random size
            siz.push(Math.random() * 0.08 + 0.02);

            // Mix of colors - 20% accent, 80% main
            const isAccent = Math.random() < 0.2;
            const particleColor = isAccent ? colorAccent : colorMain;
            col.push(particleColor.r, particleColor.g, particleColor.b);
        }

        return {
            positions: new Float32Array(pos),
            velocities: vel,
            sizes: new Float32Array(siz),
            colors: new Float32Array(col),
        };
    }, [count, spread, color, accentColor]);

    useFrame((state) => {
        if (!pointsRef.current) return;

        // Track mouse
        mousePos.current.x = state.pointer.x * viewport.width * 0.3;
        mousePos.current.y = state.pointer.y * viewport.height * 0.3;

        const time = state.clock.getElapsedTime();
        const posArray = pointsRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Apply velocity
            posArray[i3] += velocities[i3];
            posArray[i3 + 1] += velocities[i3 + 1];
            posArray[i3 + 2] += velocities[i3 + 2];

            // Gentle sine wave motion
            posArray[i3] += Math.sin(time * 0.2 + i * 0.1) * 0.002;
            posArray[i3 + 1] += Math.cos(time * 0.15 + i * 0.05) * 0.002;

            // Mouse attraction (subtle)
            const dx = mousePos.current.x - posArray[i3];
            const dy = mousePos.current.y - posArray[i3 + 1];
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 5) {
                const force = (5 - dist) * 0.0005;
                posArray[i3] += dx * force;
                posArray[i3 + 1] += dy * force;
            }

            // Wrap around boundaries
            const halfSpread = spread / 2;
            if (posArray[i3] > halfSpread) posArray[i3] = -halfSpread;
            if (posArray[i3] < -halfSpread) posArray[i3] = halfSpread;
            if (posArray[i3 + 1] > halfSpread) posArray[i3 + 1] = -halfSpread;
            if (posArray[i3 + 1] < -halfSpread) posArray[i3 + 1] = halfSpread;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Slow rotation of entire system
        pointsRef.current.rotation.z = time * 0.02;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
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
