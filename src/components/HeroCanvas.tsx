'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import ParticleGrid from '@/lib/three/ParticleGrid';

// Three.js Scene Component - Dots only, no lines
function HeroScene() {
    return (
        <ParticleGrid
            count={2000}
            size={0.015}
            color="#d2d2d2"
            radius={2.5}
        />
    );
}

// Separate component for lazy loading - reduces initial bundle size by ~110KB
export default function HeroCanvas() {
    return (
        <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 10], fov: 75 }}
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
