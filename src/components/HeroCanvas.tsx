'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import MorphingSphere from '@/lib/three/MorphingSphere';

// Three.js Scene Component - Morphing Particle Sphere
function HeroScene() {
    return (
        <>
            <ambientLight intensity={0.2} />
            <MorphingSphere
                particleCount={4000}
                baseRadius={3.5}
                color="#dfff00"
            />
        </>
    );
}

// Separate component for lazy loading
export default function HeroCanvas() {
    return (
        <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 10], fov: 55 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }}
            style={{ background: 'transparent' }}
        >
            <Suspense fallback={null}>
                <HeroScene />
                <Preload all />
            </Suspense>
        </Canvas>
    );
}
