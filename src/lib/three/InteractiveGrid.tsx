'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractiveGridProps {
    count?: number;
    size?: number;
    color?: string;
    accentColor?: string;
}

export default function InteractiveGrid({
    count = 50,
    size = 20,
    color = '#3a3a3a',
    accentColor = '#dfff00',
}: InteractiveGridProps) {
    const pointsRef = useRef<THREE.Points>(null);
    const linesRef = useRef<THREE.LineSegments>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const { viewport } = useThree();

    // Generate grid points
    const { positions, originalPositions } = useMemo(() => {
        const pos: number[] = [];
        const spacing = size / count;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const px = (x - count / 2) * spacing;
                const py = (y - count / 2) * spacing;
                const pz = 0;
                pos.push(px, py, pz);
            }
        }

        return {
            positions: new Float32Array(pos),
            originalPositions: new Float32Array(pos),
        };
    }, [count, size]);

    // Generate connecting lines
    const linePositions = useMemo(() => {
        const lines: number[] = [];
        const spacing = size / count;

        for (let x = 0; x < count; x++) {
            for (let y = 0; y < count; y++) {
                const px = (x - count / 2) * spacing;
                const py = (y - count / 2) * spacing;

                // Horizontal line
                if (x < count - 1) {
                    const nx = (x + 1 - count / 2) * spacing;
                    lines.push(px, py, 0, nx, py, 0);
                }
                // Vertical line
                if (y < count - 1) {
                    const ny = (y + 1 - count / 2) * spacing;
                    lines.push(px, py, 0, px, ny, 0);
                }
            }
        }

        return new Float32Array(lines);
    }, [count, size]);

    useFrame((state) => {
        if (!pointsRef.current || !linesRef.current) return;

        // Get normalized mouse position
        mousePos.current.x = state.pointer.x * viewport.width * 0.5;
        mousePos.current.y = state.pointer.y * viewport.height * 0.5;

        const time = state.clock.getElapsedTime();
        const pointPositions = pointsRef.current.geometry.attributes.position.array as Float32Array;
        const linePositionsArr = linesRef.current.geometry.attributes.position.array as Float32Array;

        // Animate points
        for (let i = 0; i < pointPositions.length; i += 3) {
            const ox = originalPositions[i];
            const oy = originalPositions[i + 1];

            // Distance from mouse
            const dx = ox - mousePos.current.x;
            const dy = oy - mousePos.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Repulsion effect
            const maxDist = 4;
            const strength = Math.max(0, 1 - dist / maxDist);
            const repulsion = strength * 2;

            // Wave animation
            const wave = Math.sin(ox * 0.3 + time) * Math.cos(oy * 0.3 + time * 0.5) * 0.5;

            pointPositions[i] = ox + (dx / (dist || 1)) * repulsion * 0.5;
            pointPositions[i + 1] = oy + (dy / (dist || 1)) * repulsion * 0.5;
            pointPositions[i + 2] = wave + strength * 1.5;
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Update lines to follow points (simplified - just wave effect)
        for (let i = 0; i < linePositionsArr.length; i += 3) {
            const ox = linePositionsArr[i];
            const oy = linePositionsArr[i + 1];
            const wave = Math.sin(ox * 0.3 + time) * Math.cos(oy * 0.3 + time * 0.5) * 0.3;
            linePositionsArr[i + 2] = wave;
        }

        linesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <group rotation={[-Math.PI * 0.4, 0, 0]} position={[0, -2, -5]}>
            {/* Grid lines */}
            <lineSegments ref={linesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[linePositions, 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                />
            </lineSegments>

            {/* Grid points */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[positions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.08}
                    color={accentColor}
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                />
            </points>
        </group>
    );
}
