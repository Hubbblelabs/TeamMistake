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
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-sm',
    lg: 'px-9 py-4 text-base',
};

const variantStyles = {
    primary: {
        base: 'bg-gradient-to-r from-tm-gold via-tm-gold-light to-tm-gold text-tm-navy font-semibold',
        hover: 'hover:from-tm-gold-light hover:via-tm-gold hover:to-tm-gold-light',
        glow: 'rgba(212, 168, 83, 0.4)',
        border: 'border-transparent',
    },
    secondary: {
        base: 'bg-transparent border border-tm-gold/40 text-tm-gold font-medium',
        hover: 'hover:bg-tm-gold/5 hover:border-tm-gold/60',
        glow: 'rgba(212, 168, 83, 0.25)',
        border: '',
    },
    ghost: {
        base: 'bg-transparent text-tm-slate-light font-medium',
        hover: 'hover:text-tm-gold hover:bg-tm-navy-lighter/50',
        glow: 'rgba(212, 168, 83, 0.15)',
        border: '',
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
        relative inline-flex items-center justify-center gap-2.5 rounded-xl
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
                boxShadow: isHovered && variant === 'primary'
                    ? `0 0 40px ${effectiveGlow}, 0 4px 20px rgba(0, 0, 0, 0.2)`
                    : isHovered
                    ? `0 0 30px ${effectiveGlow}`
                    : '0 0 0 transparent',
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Shimmer effect on hover */}
            <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: isHovered ? '100%' : '-100%' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Button content */}
            <span className="relative z-10 flex items-center gap-2.5">
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
