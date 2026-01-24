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
        ${noPadding ? '' : 'py-20 md:py-32 px-5 md:px-6'}
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

// Premium section header with elegant styling
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
        <div className={`mb-14 md:mb-20 ${centered ? 'text-center' : ''} ${className}`}>
            <div className={`flex items-center gap-5 ${centered ? 'justify-center' : ''}`}>
                {!centered && (
                    <div className="w-12 h-[2px] bg-gradient-to-r from-tm-gold to-transparent rounded-full" />
                )}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-tm-white tracking-tight">
                    {title}
                </h2>
                {!centered && (
                    <div className="h-[1px] bg-gradient-to-r from-tm-navy-lighter/80 to-transparent flex-grow max-w-xs" />
                )}
            </div>
            {subtitle && (
                <p className={`mt-5 text-tm-slate text-lg leading-relaxed ${centered ? 'max-w-2xl mx-auto' : 'pl-17'}`}>
                    {subtitle}
                </p>
            )}
        </div>
    );
}
