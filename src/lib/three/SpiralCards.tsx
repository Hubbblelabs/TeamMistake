'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpiralCardsProps {
    cardCount?: number;
    radius?: number;
    spiralHeight?: number;
    scrollProgress?: number;
    cardWidth?: number;
    cardHeight?: number;
    colors?: string[];
    projectLetters?: string[];
    activeIndex?: number;
    onActiveIndexChange?: (index: number) => void;
}

export default function SpiralCards({
    cardCount = 8,
    radius = 4,
    spiralHeight = 6,
    scrollProgress = 0,
    cardWidth = 1.8,
    cardHeight = 2.4,
    colors = ['#dfff00', '#d2d2d2', '#404040', '#2a2a2a', '#dfff00', '#d2d2d2', '#404040', '#2a2a2a'],
    projectLetters = ['I', 'B', 'S', 'S', 'L', 'C', 'A', 'M'],
    activeIndex = 0,
    onActiveIndexChange
}: SpiralCardsProps) {
    const groupRef = useRef<THREE.Group>(null);
    const prevActiveIndex = useRef(-1);

    // Calculate card positions in spiral
    const cardPositions = useMemo(() => {
        const positions: { position: THREE.Vector3; rotation: number }[] = [];

        for (let i = 0; i < cardCount; i++) {
            const angle = (i / cardCount) * Math.PI * 2;
            const y = (i / cardCount) * spiralHeight - spiralHeight / 2;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            positions.push({
                position: new THREE.Vector3(x, y, z),
                rotation: -angle + Math.PI / 2 // Face outward
            });
        }

        return positions;
    }, [cardCount, radius, spiralHeight]);

    // Create rounded rectangle geometry
    const cardGeometry = useMemo(() => {
        const shape = new THREE.Shape();
        const width = cardWidth;
        const height = cardHeight;
        const cornerRadius = 0.12;

        shape.moveTo(-width / 2 + cornerRadius, -height / 2);
        shape.lineTo(width / 2 - cornerRadius, -height / 2);
        shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + cornerRadius);
        shape.lineTo(width / 2, height / 2 - cornerRadius);
        shape.quadraticCurveTo(width / 2, height / 2, width / 2 - cornerRadius, height / 2);
        shape.lineTo(-width / 2 + cornerRadius, height / 2);
        shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - cornerRadius);
        shape.lineTo(-width / 2, -height / 2 + cornerRadius);
        shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + cornerRadius, -height / 2);

        return new THREE.ShapeGeometry(shape);
    }, [cardWidth, cardHeight]);

    // Scroll-based rotation
    useFrame((state) => {
        if (!groupRef.current) return;

        // Calculate target rotation based on scroll progress
        // Allow continuous rotation (no clamping)
        const targetRotation = scrollProgress * Math.PI * 2; // One full rotation per scroll unit
        
        // Smooth lerp to target rotation
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotation,
            0.1
        );

        // Subtle mouse influence for interactivity
        const mouseInfluence = state.pointer.x * 0.15;
        groupRef.current.rotation.y += mouseInfluence * 0.01;

        // Calculate which card is at the front (facing camera)
        const normalizedRotation = ((groupRef.current.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const activeIndex = Math.round((normalizedRotation / (Math.PI * 2)) * cardCount) % cardCount;
        
        // Notify parent when active index changes
        if (activeIndex !== prevActiveIndex.current && onActiveIndexChange) {
            prevActiveIndex.current = activeIndex;
            onActiveIndexChange(activeIndex);
        }

        // Slight tilt based on mouse Y position
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            state.pointer.y * 0.08,
            0.05
        );
    });

    return (
        <group ref={groupRef}>
            {cardPositions.map((cardPos, index) => {
                const isActive = index === activeIndex;
                const baseColor = colors[index % colors.length];
                
                return (
                    <mesh
                        key={index}
                        position={cardPos.position}
                        rotation={[0, cardPos.rotation, 0]}
                        geometry={cardGeometry}
                    >
                        <meshStandardMaterial
                            color={baseColor}
                            side={THREE.DoubleSide}
                            roughness={isActive ? 0.1 : 0.3}
                            metalness={isActive ? 0.6 : 0.2}
                            emissive={isActive ? baseColor : '#000000'}
                            emissiveIntensity={isActive ? 0.3 : 0}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}
