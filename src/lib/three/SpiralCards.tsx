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

    // Calculate density for ribbon effect (cards touching)
    // angle = 2 * asin(width / (2 * radius))
    const anglePerCard = useMemo(() => {
        return 2 * Math.asin(cardWidth / (2 * radius));
    }, [cardWidth, radius]);

    const totalAngle = anglePerCard * cardCount;

    // Calculate card positions in spiral
    const cardPositions = useMemo(() => {
        const positions: { position: THREE.Vector3; rotation: number }[] = [];

        for (let i = 0; i < cardCount; i++) {
            // angle progress
            const angle = Math.PI / 2 - (i * anglePerCard);

            // Vertical simple helix
            // We want the spiral to go down logic
            const progress = i / cardCount;
            const y = progress * spiralHeight - spiralHeight / 2;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;

            positions.push({
                position: new THREE.Vector3(x, y, z),
                rotation: -angle + Math.PI / 2
            });
        }

        return positions;
    }, [cardCount, radius, spiralHeight, anglePerCard]);

    // Create simple plane geometry for seamless strip
    const cardGeometry = useMemo(() => {
        return new THREE.PlaneGeometry(cardWidth, cardHeight);
    }, [cardWidth, cardHeight]);

    // Scroll-based rotation
    useFrame((state) => {
        if (!groupRef.current) return;

        // Re-calculate simply to ensure fresh values inside useFrame
        const anglePerCard = 2 * Math.asin(cardWidth / (2 * radius));
        const totalAngle = anglePerCard * cardCount;

        // Calculate target rotation based on scroll progress
        const targetRotation = scrollProgress * totalAngle;

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
        const exactIndex = groupRef.current.rotation.y / anglePerCard;
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
