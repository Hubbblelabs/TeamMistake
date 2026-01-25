'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// debug component
export default function MorphingSphere({ particleCount = 100 }: { particleCount?: number; baseRadius?: number }) {
    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.x += delta * 0.5;
            pointsRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <points ref={pointsRef}>
            <boxGeometry args={[2, 2, 2, 4, 4, 4]} />
            <pointsMaterial color="red" size={0.1} />
        </points>
    );
}
