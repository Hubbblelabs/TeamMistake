'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ParallaxGroupProps {
    children: React.ReactNode;
    intensity?: number;
    enableMouse?: boolean;
    enableScroll?: boolean;
}

// Parallax container that responds to mouse and scroll
export function ParallaxGroup({
    children,
    intensity = 1,
    enableMouse = true,
    enableScroll = true,
}: ParallaxGroupProps) {
    const groupRef = useRef<THREE.Group>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const scrollRef = useRef(0);
    const targetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!enableMouse) return;

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [enableMouse]);

    useEffect(() => {
        if (!enableScroll) return;

        const handleScroll = () => {
            scrollRef.current = window.scrollY / window.innerHeight;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [enableScroll]);

    useFrame(() => {
        if (!groupRef.current) return;

        // Smooth interpolation
        targetRef.current.x += (mouseRef.current.x * intensity - targetRef.current.x) * 0.05;
        targetRef.current.y += (mouseRef.current.y * intensity - targetRef.current.y) * 0.05;

        groupRef.current.rotation.y = targetRef.current.x * 0.1;
        groupRef.current.rotation.x = targetRef.current.y * 0.1;

        if (enableScroll) {
            groupRef.current.position.y = scrollRef.current * intensity * -0.5;
        }
    });

    return <group ref={groupRef}>{children}</group>;
}

interface ParallaxElementProps {
    children: React.ReactNode;
    depth?: number;
    position?: [number, number, number];
}

// Individual parallax element with depth-based movement
export function ParallaxElement({
    children,
    depth = 1,
    position = [0, 0, 0],
}: ParallaxElementProps) {
    const groupRef = useRef<THREE.Group>(null);
    const mouseRef = useRef({ x: 0, y: 0 });
    const currentRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;

        // Parallax effect based on depth
        currentRef.current.x += (mouseRef.current.x * depth * 0.5 - currentRef.current.x) * 0.03;
        currentRef.current.y += (mouseRef.current.y * depth * 0.5 - currentRef.current.y) * 0.03;

        groupRef.current.position.x = position[0] + currentRef.current.x;
        groupRef.current.position.y = position[1] + currentRef.current.y;
        groupRef.current.position.z = position[2];
    });

    return <group ref={groupRef}>{children}</group>;
}

// Scroll-triggered position animation
export function ScrollAnimatedElement({
    children,
    startY = 0,
    endY = -5,
    startOpacity = 1,
    endOpacity = 0,
}: {
    children: React.ReactNode;
    startY?: number;
    endY?: number;
    startOpacity?: number;
    endOpacity?: number;
}) {
    const groupRef = useRef<THREE.Group>(null);
    const scrollRef = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useFrame(() => {
        if (!groupRef.current) return;

        const progress = scrollRef.current;
        groupRef.current.position.y = startY + (endY - startY) * progress;

        // Fade children based on scroll
        groupRef.current.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
                const mat = child.material as THREE.Material;
                if ('opacity' in mat) {
                    mat.opacity = startOpacity + (endOpacity - startOpacity) * progress;
                }
            }
        });
    });

    return <group ref={groupRef}>{children}</group>;
}

// Camera parallax based on mouse
export function CameraParallax({
    intensity = 0.5,
}: {
    intensity?: number;
}) {
    const { camera } = useThree();
    const targetRef = useRef({ x: 0, y: 0 });
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame(() => {
        targetRef.current.x += (mouseRef.current.x * intensity - targetRef.current.x) * 0.02;
        targetRef.current.y += (mouseRef.current.y * intensity - targetRef.current.y) * 0.02;

        camera.position.x = targetRef.current.x;
        camera.position.y = targetRef.current.y;
        camera.lookAt(0, 0, 0);
    });

    return null;
}
