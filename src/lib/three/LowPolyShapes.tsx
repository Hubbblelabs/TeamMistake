'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, MeshDistortMaterial } from '@react-three/drei';

interface LowPolyShapeProps {
    position?: [number, number, number];
    scale?: number;
    color?: string;
    wireframe?: boolean;
    rotationSpeed?: number;
    floatIntensity?: number;
    distort?: number;
}

// Icosahedron shape
export function Icosahedron({
    position = [0, 0, 0],
    scale = 1,
    color = '#64ffda',
    wireframe = true,
    rotationSpeed = 0.3,
    floatIntensity = 1,
    distort = 0,
}: LowPolyShapeProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed * 0.5;
        meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={floatIntensity}
        >
            <mesh ref={meshRef} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 0]} />
                {distort > 0 ? (
                    <MeshDistortMaterial
                        color={color}
                        wireframe={wireframe}
                        transparent
                        opacity={0.8}
                        distort={distort}
                        speed={2}
                    />
                ) : (
                    <meshBasicMaterial
                        color={color}
                        wireframe={wireframe}
                        transparent
                        opacity={0.8}
                    />
                )}
            </mesh>
        </Float>
    );
}

// Octahedron shape
export function Octahedron({
    position = [0, 0, 0],
    scale = 1,
    color = '#64ffda',
    wireframe = true,
    rotationSpeed = 0.2,
    floatIntensity = 1,
}: LowPolyShapeProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed;
        meshRef.current.rotation.z = state.clock.elapsedTime * rotationSpeed * 0.7;
    });

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={floatIntensity}
        >
            <mesh ref={meshRef} position={position} scale={scale}>
                <octahedronGeometry args={[1, 0]} />
                <meshBasicMaterial
                    color={color}
                    wireframe={wireframe}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
}

// Dodecahedron shape
export function Dodecahedron({
    position = [0, 0, 0],
    scale = 1,
    color = '#64ffda',
    wireframe = true,
    rotationSpeed = 0.15,
    floatIntensity = 1,
}: LowPolyShapeProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed;
        meshRef.current.rotation.z = state.clock.elapsedTime * rotationSpeed * 0.5;
    });

    return (
        <Float
            speed={1.8}
            rotationIntensity={0.4}
            floatIntensity={floatIntensity}
        >
            <mesh ref={meshRef} position={position} scale={scale}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshBasicMaterial
                    color={color}
                    wireframe={wireframe}
                    transparent
                    opacity={0.7}
                />
            </mesh>
        </Float>
    );
}

// Torus shape
export function Torus({
    position = [0, 0, 0],
    scale = 1,
    color = '#64ffda',
    wireframe = true,
    rotationSpeed = 0.25,
    floatIntensity = 1,
}: LowPolyShapeProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed;
        meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.8;
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={floatIntensity}
        >
            <mesh ref={meshRef} position={position} scale={scale}>
                <torusGeometry args={[1, 0.3, 8, 16]} />
                <meshBasicMaterial
                    color={color}
                    wireframe={wireframe}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
}

// Tetrahedron shape
export function Tetrahedron({
    position = [0, 0, 0],
    scale = 1,
    color = '#64ffda',
    wireframe = true,
    rotationSpeed = 0.35,
    floatIntensity = 1,
}: LowPolyShapeProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed;
        meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 1.2;
    });

    return (
        <Float
            speed={2.2}
            rotationIntensity={0.6}
            floatIntensity={floatIntensity}
        >
            <mesh ref={meshRef} position={position} scale={scale}>
                <tetrahedronGeometry args={[1, 0]} />
                <meshBasicMaterial
                    color={color}
                    wireframe={wireframe}
                    transparent
                    opacity={0.7}
                />
            </mesh>
        </Float>
    );
}

// Cube/Box shape with edges
export function WireframeCube({
    position = [0, 0, 0],
    scale = 1,
    color = '#64ffda',
    rotationSpeed = 0.2,
    floatIntensity = 1,
}: Omit<LowPolyShapeProps, 'wireframe'>) {
    const meshRef = useRef<THREE.Group>(null);

    const edges = useMemo(() => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        return new THREE.EdgesGeometry(geometry);
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x = state.clock.elapsedTime * rotationSpeed;
        meshRef.current.rotation.y = state.clock.elapsedTime * rotationSpeed * 0.7;
    });

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.4}
            floatIntensity={floatIntensity}
        >
            <group ref={meshRef} position={position} scale={scale}>
                <lineSegments geometry={edges}>
                    <lineBasicMaterial color={color} transparent opacity={0.8} />
                </lineSegments>
            </group>
        </Float>
    );
}

// Glowing sphere
export function GlowingSphere({
    position = [0, 0, 0],
    scale = 1,
    color = '#64ffda',
    floatIntensity = 1,
}: Omit<LowPolyShapeProps, 'wireframe' | 'rotationSpeed'>) {
    return (
        <Float
            speed={1}
            rotationIntensity={0}
            floatIntensity={floatIntensity}
        >
            <mesh position={position} scale={scale}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.3}
                />
            </mesh>
            <mesh position={position} scale={scale * 1.2}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.1}
                />
            </mesh>
        </Float>
    );
}
