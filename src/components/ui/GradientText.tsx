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
    gradient = 'linear-gradient(90deg, #64ffda 0%, #a8b2d1 50%, #64ffda 100%)',
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
                animation: animate ? 'shimmer 3s ease-in-out infinite' : 'none',
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

// Preset gradient variations
export function AccentGradientText({
    children,
    className = '',
    animate = true,
}: Omit<GradientTextProps, 'gradient'>) {
    return (
        <GradientText
            className={className}
            gradient="linear-gradient(90deg, #64ffda 0%, #00d9ff 50%, #64ffda 100%)"
            animate={animate}
        >
            {children}
        </GradientText>
    );
}

export function SubtleGradientText({
    children,
    className = '',
    animate = true,
}: Omit<GradientTextProps, 'gradient'>) {
    return (
        <GradientText
            className={className}
            gradient="linear-gradient(90deg, #e6f1ff 0%, #a8b2d1 50%, #e6f1ff 100%)"
            animate={animate}
        >
            {children}
        </GradientText>
    );
}
