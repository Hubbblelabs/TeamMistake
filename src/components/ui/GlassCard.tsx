'use client';

import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    tiltEnabled?: boolean;
    glowEnabled?: boolean;
    glowColor?: string;
    maxTilt?: number;
    onClick?: () => void;
}

export default function GlassCard({
    children,
    className = '',
    tiltEnabled = true,
    glowEnabled = true,
    glowColor = 'rgba(100, 255, 218, 0.2)',
    maxTilt = 10,
    onClick,
}: GlassCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !tiltEnabled) return;

        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const tiltX = (mouseY / (rect.height / 2)) * -maxTilt;
        const tiltY = (mouseX / (rect.width / 2)) * maxTilt;

        setTilt({ x: tiltX, y: tiltY });

        // Glow follows mouse
        const glowX = ((e.clientX - rect.left) / rect.width) * 100;
        const glowY = ((e.clientY - rect.top) / rect.height) * 100;
        setGlowPosition({ x: glowX, y: glowY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    return (
        <motion.div
            ref={cardRef}
            className={`relative overflow-hidden ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={onClick}
            style={{
                transform: tiltEnabled
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    : undefined,
                transition: 'transform 0.15s ease-out',
            }}
        >
            {/* Glass background */}
            <div
                className="absolute inset-0 bg-glass backdrop-blur-glass rounded-lg border border-glass"
                style={{
                    background: 'rgba(17, 34, 64, 0.3)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderColor: 'rgba(100, 255, 218, 0.15)',
                }}
            />

            {/* Glow effect */}
            {glowEnabled && isHovered && (
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-lg"
                    style={{
                        background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 50%)`,
                        opacity: isHovered ? 1 : 0,
                    }}
                />
            )}

            {/* Border glow */}
            {glowEnabled && isHovered && (
                <div
                    className="absolute inset-0 pointer-events-none rounded-lg transition-opacity duration-300"
                    style={{
                        boxShadow: `0 0 30px ${glowColor}`,
                        opacity: isHovered ? 0.5 : 0,
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
