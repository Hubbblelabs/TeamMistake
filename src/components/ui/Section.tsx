'use client';

import { ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    id?: string;
    className?: string;
    containerClassName?: string;
    fullWidth?: boolean;
    noPadding?: boolean;
    background?: 'default' | 'light' | 'transparent';
}

const backgroundStyles = {
    default: 'bg-tm-navy',
    light: 'bg-tm-navy-light',
    transparent: 'bg-transparent',
};

export default function Section({
    children,
    id,
    className = '',
    containerClassName = '',
    fullWidth = false,
    noPadding = false,
    background = 'default',
}: SectionProps) {
    return (
        <section
            id={id}
            className={`
        relative overflow-hidden
        ${backgroundStyles[background]}
        ${noPadding ? '' : 'py-16 md:py-24 px-4 md:px-6'}
        ${className}
      `}
        >
            <div
                className={`
          relative z-10
          ${fullWidth ? 'w-full' : 'max-w-6xl mx-auto'}
          ${containerClassName}
        `}
            >
                {children}
            </div>
        </section>
    );
}

// Section header with animated underline
export function SectionHeader({
    title,
    subtitle,
    centered = false,
    className = '',
}: {
    title: string;
    subtitle?: string;
    centered?: boolean;
    className?: string;
}) {
    return (
        <div className={`mb-12 md:mb-16 ${centered ? 'text-center' : ''} ${className}`}>
            <div className={`flex items-center gap-4 ${centered ? 'justify-center' : ''}`}>
                <h2 className="text-3xl md:text-4xl font-bold text-tm-white">
                    {title}
                </h2>
                {!centered && (
                    <div className="h-[1px] bg-gradient-to-r from-tm-green/50 to-transparent flex-grow max-w-xs" />
                )}
            </div>
            {subtitle && (
                <p className={`mt-4 text-tm-slate text-lg ${centered ? 'max-w-2xl mx-auto' : ''}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
