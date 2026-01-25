'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import RadialParticles from '@/lib/three/RadialParticles';

// Three.js Scene Component - Radial Particles
function HeroScene() {
    return (
        <>
            <RadialParticles
                count={2500}
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
            camera={{ position: [0, 0, 10], fov: 60 }}
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
