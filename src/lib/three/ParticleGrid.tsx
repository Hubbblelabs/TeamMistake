'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleGridProps {
    count?: number;
    size?: number;
    color?: string;
    opacity?: number;
    spread?: number;
    speed?: number;
    mouseInteraction?: boolean;
}

export default function ParticleGrid({
    count = 800,
    size = 2,
    color = '#64ffda',
    opacity = 0.6,
    spread = 20,
    speed = 0.2,
    mouseInteraction = true,
}: ParticleGridProps) {
    const meshRef = useRef<THREE.Points>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    // Generate particle positions
    const [positions, originalPositions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const origPos = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = (Math.random() - 0.5) * spread;
            const y = (Math.random() - 0.5) * spread;
            const z = (Math.random() - 0.5) * spread * 0.5;

            pos[i3] = x;
            pos[i3 + 1] = y;
            pos[i3 + 2] = z;

            origPos[i3] = x;
            origPos[i3 + 1] = y;
            origPos[i3 + 2] = z;
        }

        return [pos, origPos];
    }, [count, spread]);

    // Handle mouse movement
    useEffect(() => {
        if (typeof window === 'undefined' || !mouseInteraction) return;

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseInteraction]);

    // Animation loop
    useFrame((state) => {
        if (!meshRef.current) return;

        const time = state.clock.elapsedTime * speed;
        const positionAttr = meshRef.current.geometry.attributes.position;
        const positionArray = positionAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Subtle floating animation
            positionArray[i3] = originalPositions[i3] + Math.sin(time + i * 0.1) * 0.1;
            positionArray[i3 + 1] = originalPositions[i3 + 1] + Math.cos(time + i * 0.1) * 0.1;

            // Mouse repulsion effect
            if (mouseInteraction) {
                const dx = positionArray[i3] - mouseRef.current.x * 5;
                const dy = positionArray[i3 + 1] - mouseRef.current.y * 5;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 3) {
                    const force = (3 - dist) * 0.02;
                    positionArray[i3] += dx * force;
                    positionArray[i3 + 1] += dy * force;
                }
            }
        }

        positionAttr.needsUpdate = true;
    });

    // Create geometry with buffer attribute
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [positions]);

    return (
        <points ref={meshRef} geometry={geometry}>
            <pointsMaterial
                size={size * 0.01}
                color={color}
                transparent
                opacity={opacity}
                sizeAttenuation
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

// Line connections between nearby particles
export function ParticleConnections({
    count = 100,
    spread = 20,
    color = '#64ffda',
    opacity = 0.15,
    maxDistance = 3,
}: {
    count?: number;
    spread?: number;
    color?: string;
    opacity?: number;
    maxDistance?: number;
}) {
    const lineRef = useRef<THREE.LineSegments>(null);

    const geometry = useMemo(() => {
        const pos: number[] = [];

        // Generate random points
        const points: THREE.Vector3[] = [];
        for (let i = 0; i < count; i++) {
            points.push(new THREE.Vector3(
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread,
                (Math.random() - 0.5) * spread * 0.3
            ));
        }

        // Connect nearby points
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dist = points[i].distanceTo(points[j]);
                if (dist < maxDistance) {
                    pos.push(points[i].x, points[i].y, points[i].z);
                    pos.push(points[j].x, points[j].y, points[j].z);
                }
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        return geo;
    }, [count, spread, maxDistance]);

    useFrame((state) => {
        if (!lineRef.current) return;
        lineRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    });

    return (
        <lineSegments ref={lineRef} geometry={geometry}>
            <lineBasicMaterial
                color={color}
                transparent
                opacity={opacity}
                blending={THREE.AdditiveBlending}
            />
        </lineSegments>
    );
}
