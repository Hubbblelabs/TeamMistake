'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface WavePlaneProps {
    width?: number;
    height?: number;
    segments?: number;
    color?: string;
    wireframe?: boolean;
}

export default function WavePlane({
    width = 30,
    height = 20,
    segments = 80,
    color = '#dfff00',
    wireframe = true,
}: WavePlaneProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const smoothMouse = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Store original positions
    const originalPositions = useMemo(() => {
        const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
        return new Float32Array(geometry.attributes.position.array);
    }, [width, height, segments]);

    useFrame((state) => {
        if (!meshRef.current) return;

        // Smooth mouse tracking
        mousePos.current.x = state.pointer.x * viewport.width * 0.5;
        mousePos.current.y = state.pointer.y * viewport.height * 0.5;

        smoothMouse.current.x += (mousePos.current.x - smoothMouse.current.x) * 0.05;
        smoothMouse.current.y += (mousePos.current.y - smoothMouse.current.y) * 0.05;

        const time = state.clock.getElapsedTime();
        const geometry = meshRef.current.geometry;
        const positions = geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = originalPositions[i];
            const y = originalPositions[i + 1];

            // Distance from mouse
            const dx = x - smoothMouse.current.x;
            const dy = y - smoothMouse.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Mouse ripple effect
            const mouseWave = Math.sin(dist * 0.5 - time * 3) * Math.max(0, 1 - dist * 0.1) * 0.8;

            // Base wave pattern
            const wave1 = Math.sin(x * 0.3 + time * 0.8) * 0.3;
            const wave2 = Math.sin(y * 0.4 + time * 0.6) * 0.2;
            const wave3 = Math.sin((x + y) * 0.2 + time * 0.4) * 0.15;

            // Combine waves
            positions[i + 2] = wave1 + wave2 + wave3 + mouseWave;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    });

    return (
        <mesh
            ref={meshRef}
            rotation={[-Math.PI * 0.45, 0, 0]}
            position={[0, -3, -5]}
        >
            <planeGeometry args={[width, height, segments, segments]} />
            <meshBasicMaterial
                color={color}
                wireframe={wireframe}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}
