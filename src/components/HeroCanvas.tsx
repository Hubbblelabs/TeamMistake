'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, Environment } from '@react-three/drei';
import MorphingBlob from '@/lib/three/MorphingBlob';

// Three.js Scene Component - Morphing Blob
function HeroScene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#dfff00" />
            <MorphingBlob
                radius={3}
                detail={48}
                noiseScale={0.6}
                noiseSpeed={0.25}
                color="#404040"
            />
        </>
    );
}

// Separate component for lazy loading - reduces initial bundle size
export default function HeroCanvas() {
    return (
        <Canvas
            dpr={[1, 2]}
            camera={{ position: [0, 0, 8], fov: 60 }}
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
