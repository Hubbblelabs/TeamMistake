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
    glowColor = 'rgba(212, 168, 83, 0.15)',
    maxTilt = 8,
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
            className={`relative overflow-hidden rounded-2xl ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onClick={onClick}
            style={{
                transform: tiltEnabled
                    ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                    : undefined,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            {/* Premium glass background */}
            <div
                className="absolute inset-0 rounded-2xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(26, 31, 46, 0.8) 0%, rgba(15, 20, 25, 0.9) 100%)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212, 168, 83, 0.08)',
                    boxShadow: isHovered 
                        ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.03)'
                        : '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.02)',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
            />

            {/* Hover border highlight */}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                style={{
                    border: '1px solid rgba(212, 168, 83, 0.2)',
                    opacity: isHovered ? 1 : 0,
                }}
            />

            {/* Glow effect */}
            {glowEnabled && isHovered && (
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-2xl"
                    style={{
                        background: `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, ${glowColor}, transparent 40%)`,
                        opacity: isHovered ? 1 : 0,
                    }}
                />
            )}

            {/* Subtle top highlight */}
            <div 
                className="absolute inset-x-0 top-0 h-px rounded-t-2xl pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.06), transparent)',
                }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
