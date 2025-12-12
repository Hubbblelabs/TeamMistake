'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Preload } from '@react-three/drei';

// Performance controller that pauses rendering when not visible
function PerformanceController({ 
  enabled = true 
}: { 
  enabled?: boolean 
}) {
  const { invalidate, clock } = useThree();
  
  useFrame(() => {
    if (enabled) {
      invalidate();
    }
  });
  
  useEffect(() => {
    if (!enabled) {
      clock.stop();
    } else {
      clock.start();
    }
  }, [enabled, clock]);
  
  return null;
}

interface SceneWrapperProps {
  children: ReactNode;
  className?: string;
  cameraPosition?: [number, number, number];
  enablePerformanceMode?: boolean;
  dpr?: [number, number];
  style?: React.CSSProperties;
}

export default function SceneWrapper({
  children,
  className = '',
  cameraPosition = [0, 0, 5],
  enablePerformanceMode = true,
  dpr = [1, 2],
  style,
}: SceneWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Intersection observer for viewport visibility
  useEffect(() => {
    if (!enablePerformanceMode || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [enablePerformanceMode]);

  // Reduce DPR on mobile for performance
  const effectiveDpr: [number, number] = isMobile ? [1, 1.5] : dpr;

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 -z-10 ${className}`}
      style={style}
    >
      <Canvas
        dpr={effectiveDpr}
        camera={{ position: cameraPosition, fov: 75 }}
        gl={{ 
          antialias: !isMobile,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <PerformanceController enabled={isVisible} />
        {children}
        <Preload all />
      </Canvas>
    </div>
  );
}

// Export utility hook for checking reduced motion preference
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// Export utility hook for device capabilities
export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowPower: false,
    supportsWebGL2: true,
  });

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    
    setCapabilities({
      isMobile: window.innerWidth < 768,
      isLowPower: navigator.hardwareConcurrency <= 4,
      supportsWebGL2: !!gl,
    });
  }, []);

  return capabilities;
}
