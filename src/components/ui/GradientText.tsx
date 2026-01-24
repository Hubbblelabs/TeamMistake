'use client';

import { ReactNode } from 'react';

interface GradientTextProps {
    children: ReactNode;
    className?: string;
    gradient?: string;
    animate?: boolean;
}

export default function GradientText({
    children,
    className = '',
    gradient = 'linear-gradient(135deg, #e8c17a 0%, #d4a853 40%, #b8923f 100%)',
    animate = true,
}: GradientTextProps) {
    return (
        <span
            className={`inline-block ${className}`}
            style={{
                background: gradient,
                backgroundSize: animate ? '200% 100%' : '100% 100%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: animate ? 'shimmer 4s ease-in-out infinite' : 'none',
            }}
        >
            {children}
            <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 100% 50%;
          }
          50% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
        </span>
    );
}

// Premium gold gradient
export function AccentGradientText({
    children,
    className = '',
    animate = true,
}: Omit<GradientTextProps, 'gradient'>) {
    return (
        <GradientText
            className={className}
            gradient="linear-gradient(135deg, #e8c17a 0%, #d4a853 50%, #b8923f 100%)"
            animate={animate}
        >
            {children}
        </GradientText>
    );
}

export function SubtleGradientText({
    children,
    className = '',
    animate = false,
}: Omit<GradientTextProps, 'gradient'>) {
    return (
        <GradientText
            className={className}
            gradient="linear-gradient(135deg, #f8fafc 0%, #d1d5db 50%, #f8fafc 100%)"
            animate={animate}
        >
            {children}
        </GradientText>
    );
}
