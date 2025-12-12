'use client';

import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
    children: ReactNode;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    glowColor?: string;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

const variantStyles = {
    primary: {
        base: 'bg-tm-green text-tm-navy font-semibold',
        hover: 'hover:bg-tm-green/90',
        glow: 'rgba(100, 255, 218, 0.5)',
    },
    secondary: {
        base: 'bg-transparent border-2 border-tm-green text-tm-green font-medium',
        hover: 'hover:bg-tm-green/10',
        glow: 'rgba(100, 255, 218, 0.3)',
    },
    ghost: {
        base: 'bg-transparent text-tm-green font-medium',
        hover: 'hover:bg-tm-green/5',
        glow: 'rgba(100, 255, 218, 0.2)',
    },
};

export default function GlowButton({
    children,
    className = '',
    variant = 'secondary',
    size = 'md',
    glowColor,
    href,
    onClick,
    disabled = false,
    type = 'button',
}: GlowButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const styles = variantStyles[variant];
    const effectiveGlow = glowColor || styles.glow;

    const buttonContent = (
        <motion.span
            className={`
        relative inline-flex items-center justify-center gap-2 rounded-lg
        transition-all duration-300 overflow-hidden
        ${sizeStyles[size]}
        ${styles.base}
        ${styles.hover}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            animate={{
                scale: isPressed ? 0.98 : 1,
                boxShadow: isHovered
                    ? `0 0 30px ${effectiveGlow}, 0 0 60px ${effectiveGlow.replace('0.5', '0.2').replace('0.3', '0.1')}`
                    : '0 0 0 transparent',
            }}
            transition={{ duration: 0.2 }}
        >
            {/* Animated background on hover */}
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: isHovered ? '100%' : '-100%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            />

            {/* Button content */}
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </motion.span>
    );

    if (href && !disabled) {
        return (
            <a href={href} className="inline-block">
                {buttonContent}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className="inline-block"
        >
            {buttonContent}
        </button>
    );
}
