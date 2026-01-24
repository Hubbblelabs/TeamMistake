'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simplex noise implementation for organic movement
function createNoise3D() {
    const grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
    ];

    const p = Array.from({ length: 256 }, () => Math.floor(Math.random() * 256));
    const perm = [...p, ...p];

    function dot(g: number[], x: number, y: number, z: number) {
        return g[0] * x + g[1] * y + g[2] * z;
    }

    return function noise3D(x: number, y: number, z: number): number {
        const F3 = 1 / 3;
        const G3 = 1 / 6;

        const s = (x + y + z) * F3;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);
        const k = Math.floor(z + s);

        const t = (i + j + k) * G3;
        const X0 = i - t;
        const Y0 = j - t;
        const Z0 = k - t;
        const x0 = x - X0;
        const y0 = y - Y0;
        const z0 = z - Z0;

        let i1, j1, k1, i2, j2, k2;

        if (x0 >= y0) {
            if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
            else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
            else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
        } else {
            if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
            else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
            else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        }

        const x1 = x0 - i1 + G3;
        const y1 = y0 - j1 + G3;
        const z1 = z0 - k1 + G3;
        const x2 = x0 - i2 + 2 * G3;
        const y2 = y0 - j2 + 2 * G3;
        const z2 = z0 - k2 + 2 * G3;
        const x3 = x0 - 1 + 3 * G3;
        const y3 = y0 - 1 + 3 * G3;
        const z3 = z0 - 1 + 3 * G3;

        const ii = i & 255;
        const jj = j & 255;
        const kk = k & 255;

        const gi0 = perm[ii + perm[jj + perm[kk]]] % 12;
        const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12;
        const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12;
        const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12;

        let n0, n1, n2, n3;

        let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
        n0 = t0 < 0 ? 0 : (t0 *= t0) * t0 * dot(grad3[gi0], x0, y0, z0);

        let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
        n1 = t1 < 0 ? 0 : (t1 *= t1) * t1 * dot(grad3[gi1], x1, y1, z1);

        let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
        n2 = t2 < 0 ? 0 : (t2 *= t2) * t2 * dot(grad3[gi2], x2, y2, z2);

        let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
        n3 = t3 < 0 ? 0 : (t3 *= t3) * t3 * dot(grad3[gi3], x3, y3, z3);

        return 32 * (n0 + n1 + n2 + n3);
    };
}

interface MorphingBlobProps {
    radius?: number;
    detail?: number;
    noiseScale?: number;
    noiseSpeed?: number;
    color?: string;
}

export default function MorphingBlob({
    radius = 2.5,
    detail = 64,
    noiseScale = 0.8,
    noiseSpeed = 0.3,
    color = '#d2d2d2',
}: MorphingBlobProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const originalPositions = useRef<Float32Array | null>(null);

    const noise3D = useMemo(() => createNoise3D(), []);

    // Store original vertex positions
    useMemo(() => {
        const geometry = new THREE.IcosahedronGeometry(radius, detail);
        originalPositions.current = new Float32Array(geometry.attributes.position.array);
        return geometry;
    }, [radius, detail]);

    useFrame((state) => {
        if (!meshRef.current || !originalPositions.current) return;

        const time = state.clock.getElapsedTime() * noiseSpeed;
        const geometry = meshRef.current.geometry;
        const positions = geometry.attributes.position.array as Float32Array;
        const original = originalPositions.current;

        for (let i = 0; i < positions.length; i += 3) {
            const ox = original[i];
            const oy = original[i + 1];
            const oz = original[i + 2];

            // Normalize to get direction
            const length = Math.sqrt(ox * ox + oy * oy + oz * oz);
            const nx = ox / length;
            const ny = oy / length;
            const nz = oz / length;

            // Apply noise displacement along normal
            const noiseValue = noise3D(
                ox * noiseScale + time,
                oy * noiseScale + time * 0.5,
                oz * noiseScale + time * 0.3
            );

            const displacement = noiseValue * 0.4;

            positions[i] = ox + nx * displacement;
            positions[i + 1] = oy + ny * displacement;
            positions[i + 2] = oz + nz * displacement;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        // Subtle rotation
        meshRef.current.rotation.y = time * 0.1;
        meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[radius, detail]} />
            <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.7}
                wireframe={false}
                flatShading={false}
            />
        </mesh>
    );
}
