'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';

interface WaveSpheresProps {
    gridSize?: number;
    spacing?: number;
    sphereRadius?: number;
    color?: string;
}

export default function WaveSpheres({
    gridSize = 25,
    spacing = 0.8,
    sphereRadius = 0.04,
    color = '#dfff00',
}: WaveSpheresProps) {
    const groupRef = useRef<THREE.Group>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const smoothMouse = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Generate grid positions
    const gridPoints = useMemo(() => {
        const points: { x: number; y: number; index: number }[] = [];
        const halfGrid = (gridSize * spacing) / 2;

        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                points.push({
                    x: i * spacing - halfGrid,
                    y: j * spacing - halfGrid,
                    index: i * gridSize + j,
                });
            }
        }
        return points;
    }, [gridSize, spacing]);

    // Store sphere refs for animation
    const sphereRefs = useRef<THREE.Object3D[]>([]);

    useFrame((state) => {
        // Smooth mouse tracking
        mousePos.current.x = state.pointer.x * viewport.width * 0.4;
        mousePos.current.y = state.pointer.y * viewport.height * 0.4;

        smoothMouse.current.x += (mousePos.current.x - smoothMouse.current.x) * 0.08;
        smoothMouse.current.y += (mousePos.current.y - smoothMouse.current.y) * 0.08;

        const time = state.clock.getElapsedTime();

        // Update each sphere
        sphereRefs.current.forEach((sphere, idx) => {
            if (!sphere) return;

            const point = gridPoints[idx];
            const x = point.x;
            const y = point.y;

            // Distance from mouse
            const dx = x - smoothMouse.current.x;
            const dy = y - smoothMouse.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Mouse ripple effect
            const mouseWave = Math.sin(dist * 0.6 - time * 3) * Math.max(0, 1 - dist * 0.12) * 1.2;

            // Base wave pattern
            const wave1 = Math.sin(x * 0.4 + time * 0.8) * 0.4;
            const wave2 = Math.sin(y * 0.5 + time * 0.6) * 0.3;
            const wave3 = Math.sin((x + y) * 0.25 + time * 0.5) * 0.2;

            // Combined Z position
            const z = wave1 + wave2 + wave3 + mouseWave;

            sphere.position.set(x, y, z);

            // Scale based on height (higher = bigger)
            const scale = 1 + z * 0.15;
            sphere.scale.setScalar(Math.max(0.5, scale));
        });
    });

    return (
        <group ref={groupRef} rotation={[-Math.PI * 0.45, 0, 0]} position={[0, -2, -5]}>
            <Instances limit={gridSize * gridSize}>
                <sphereGeometry args={[sphereRadius, 12, 12]} />
                <meshBasicMaterial color={color} transparent opacity={0.9} />

                {gridPoints.map((point, i) => (
                    <Instance
                        key={i}
                        ref={(el: THREE.Object3D | null) => {
                            if (el) sphereRefs.current[i] = el;
                        }}
                        position={[point.x, point.y, 0]}
                    />
                ))}
            </Instances>
        </group>
    );
}
