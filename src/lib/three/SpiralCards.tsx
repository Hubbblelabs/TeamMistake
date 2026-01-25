'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image as DreiImage } from '@react-three/drei';
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
    radius = 7,
    spiralHeight = 0,
    scrollProgress = 0,
    cardWidth = 4.5,
    cardHeight = 2.8,
    projectImages = [],
    activeIndex = 0,
    onActiveIndexChange
}: SpiralCardsProps) {
    const groupRef = useRef<THREE.Group>(null);
    const prevActiveIndex = useRef(-1);

    // Spaced layout with gap
    const anglePerCard = useMemo(() => {
        return 2 * Math.asin((cardWidth + 1.2) / (2 * radius));
    }, [cardWidth, radius]);

    const totalAngle = anglePerCard * cardCount;

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Negative rotation to scroll through cards correctly
        const targetRotation = -scrollProgress * (totalAngle - anglePerCard);

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotation,
            0.06
        );

        // Subtle mouse interaction
        const mouseInfluence = state.pointer.x * 0.3;
        groupRef.current.rotation.y += mouseInfluence * 0.02;

        // Calculate active index based on rotation
        const exactIndex = Math.abs(groupRef.current.rotation.y) / anglePerCard;
        const activeIdx = Math.round(exactIndex) % cardCount;
        const normalizedIndex = (activeIdx + cardCount) % cardCount;

        if (normalizedIndex !== prevActiveIndex.current && onActiveIndexChange) {
            prevActiveIndex.current = normalizedIndex;
            onActiveIndexChange(normalizedIndex);
        }
    });

    const cardPositions = useMemo(() => {
        return Array.from({ length: cardCount }).map((_, i) => {
            // Place cards around a cylinder
            // Index 0 should be at the front (x=0, z=radius)
            // angle = 0 for index 0 means card faces camera
            const angle = i * anglePerCard;

            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            const y = 0;

            return {
                position: [x, y, z] as [number, number, number],
                rotation: [0, angle, 0] as [number, number, number]
            };
        });
    }, [cardCount, radius, anglePerCard]);

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {cardPositions.map((pos, index) => {
                const url = projectImages[index % projectImages.length];
                const isActive = index === activeIndex;

                return (
                    <group key={index} position={pos.position} rotation={pos.rotation}>

                        {/* Card Container with glassmorphism effect */}
                        <mesh position={[0, 0, -0.08]}>
                            <planeGeometry args={[cardWidth + 0.3, cardHeight + 0.3]} />
                            <meshBasicMaterial
                                color={isActive ? "#dfff00" : "#1e293b"}
                                transparent
                                opacity={isActive ? 0.15 : 0.9}
                            />
                        </mesh>

                        <DreiImage
                            url={url}
                            transparent
                            side={THREE.DoubleSide}
                            scale={[cardWidth, cardHeight]}
                            toneMapped={false}
                        />

                        {/* Darker overlay for inactive cards */}
                        <mesh position={[0, 0, 0.02]}>
                            <planeGeometry args={[cardWidth, cardHeight]} />
                            <meshBasicMaterial
                                color="#020617"
                                transparent
                                opacity={isActive ? 0 : 0.65}
                            />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
}
