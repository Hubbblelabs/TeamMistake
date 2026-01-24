'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface SpiralCardsProps {
    cardCount?: number;
    radius?: number;
    spiralHeight?: number;
    scrollProgress?: number;
    cardWidth?: number;
    cardHeight?: number;
    projectImages?: string[];
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
    projectImages = [],
    activeIndex = 0,
    onActiveIndexChange
}: SpiralCardsProps) {
    const groupRef = useRef<THREE.Group>(null);
    const prevActiveIndex = useRef(-1);

    // Load textures
    const textures = useTexture(projectImages);
    // Ensure textures is always an array
    const textureArray = Array.isArray(textures) ? textures : [textures];

    // Calculate card positions in spiral
    const cardPositions = useMemo(() => {
        const positions: { position: THREE.Vector3; rotation: number }[] = [];

        for (let i = 0; i < cardCount; i++) {
            // Start at PI/2 (Front) and go clockwise (subtracting angle)
            // This ensures Index 0 is at front when rotation is 0
            const angle = Math.PI / 2 - (i / cardCount) * Math.PI * 2;

            // Vertical simple helix
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
        const targetRotation = scrollProgress * Math.PI * 2;

        // Smooth lerp to target rotation
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotation,
            0.1
        );

        // Subtle mouse influence for interactivity
        const mouseInfluence = state.pointer.x * 0.15;
        groupRef.current.rotation.y += mouseInfluence * 0.01;

        // Calculate active index based on rotation
        // With our setup, positive rotation brings subsequent cards to front (Angle PI/2)
        // rotation / (2PI/N) = approx index
        const rotationPerCard = (Math.PI * 2) / cardCount;
        // Add small offset to snap correctly
        const exactIndex = groupRef.current.rotation.y / rotationPerCard;
        const activeIndex = Math.round(exactIndex) % cardCount;

        // Handle negative wrapping just in case
        const normalizedIndex = (activeIndex + cardCount) % cardCount;

        if (normalizedIndex !== prevActiveIndex.current && onActiveIndexChange) {
            prevActiveIndex.current = normalizedIndex;
            onActiveIndexChange(normalizedIndex);
        }

        // Slight tilt
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
                const texture = textureArray[index % textureArray.length];

                return (
                    <mesh
                        key={index}
                        position={cardPos.position}
                        rotation={[0, cardPos.rotation, 0]}
                        geometry={cardGeometry}
                    >
                        <meshBasicMaterial
                            map={texture}
                            side={THREE.DoubleSide}
                            toneMapped={false}
                        />
                        {/* Overlay for inactive cards to darken them */}
                        {!isActive && (
                            <mesh position={[0, 0, 0.01]} geometry={cardGeometry}>
                                <meshBasicMaterial
                                    color="black"
                                    transparent
                                    opacity={0.6}
                                />
                            </mesh>
                        )}
                    </mesh>
                );
            })}
        </group>
    );
}
