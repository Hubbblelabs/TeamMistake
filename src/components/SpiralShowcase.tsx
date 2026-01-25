'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, PerspectiveCamera, Image } from '@react-three/drei';
import { motion } from 'framer-motion';
import SpiralCards from '@/lib/three/SpiralCards';
import { projects } from '@/data/projects';

interface SpiralSceneProps {
    scrollProgress: number;
    activeIndex: number;
    onActiveIndexChange: (index: number) => void;
    responsiveConfig: {
        cardWidth: number;
        cardHeight: number;
        radius: number;
        cameraZ: number;
        fov: number;
    };
}

function SpiralScene({ scrollProgress, activeIndex, onActiveIndexChange, responsiveConfig }: SpiralSceneProps) {
    const projectImages = useMemo(() => projects.map(p => p.image), []);

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#dfff00" />

            <SpiralCards
                cardCount={projects.length}
                radius={responsiveConfig.radius}
                spiralHeight={0}
                scrollProgress={scrollProgress}
                cardWidth={responsiveConfig.cardWidth}
                cardHeight={responsiveConfig.cardHeight}
                projectImages={projectImages}
                activeIndex={activeIndex}
                onActiveIndexChange={onActiveIndexChange}
            />
        </>
    );
}

export default function SpiralShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Responsive viewport detection
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Responsive config
    const responsiveConfig = useMemo(() => {
        if (isMobile) {
            return { cardWidth: 2.8, cardHeight: 1.8, radius: 5, cameraZ: 10, fov: 60 };
        } else if (isTablet) {
            return { cardWidth: 3.5, cardHeight: 2.2, radius: 6, cameraZ: 11, fov: 55 };
        } else {
            return { cardWidth: 4.5, cardHeight: 2.8, radius: 7, cameraZ: 12, fov: 50 };
        }
    }, [isMobile, isTablet]);

    useEffect(() => {
        const handleScroll = () => {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = rect.height;

            const scrollStart = rect.top;
            const scrollableHeight = sectionHeight - windowHeight;

            let progress = 0;

            if (scrollStart <= 0 && scrollStart > -scrollableHeight) {
                progress = Math.abs(scrollStart) / scrollableHeight;
            } else if (scrollStart <= -scrollableHeight) {
                progress = 1;
            }

            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleActiveIndexChange = (index: number) => {
        setActiveIndex(index);
    };

    const currentProject = projects[activeIndex] || projects[0];

    return (
        <section
            ref={sectionRef}
            id="spiral-showcase"
            className="relative h-[600vh]"
        >
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* Simplified Section Header */}
                <div className="absolute top-8 left-6 md:left-12 z-20 mix-blend-difference">
                    <h2 className="text-xl md:text-2xl font-bold text-tm-white tracking-tight">
                        Selected Work
                    </h2>
                </div>

                {/* Three.js Canvas */}
                <div className="absolute inset-0 z-10">
                    <Canvas
                        dpr={[1, 2]}
                        gl={{
                            antialias: true,
                            alpha: true,
                            powerPreference: 'high-performance',
                        }}
                        style={{ background: 'transparent' }}
                    >
                        <PerspectiveCamera makeDefault position={[0, 0, responsiveConfig.cameraZ]} fov={responsiveConfig.fov} />
                        <Suspense fallback={null}>
                            <SpiralScene
                                scrollProgress={scrollProgress}
                                activeIndex={activeIndex}
                                onActiveIndexChange={handleActiveIndexChange}
                                responsiveConfig={responsiveConfig}
                            />
                            <Preload all />
                        </Suspense>
                    </Canvas>
                </div>


                <div className="absolute bottom-12 left-6 md:left-12 z-20 pointer-events-none">
                    {/* Current Project Info - Left */}
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="max-w-md"
                    >
                        <span className="font-mono text-[10px] text-tm-green uppercase tracking-widest block mb-1">
                            {currentProject.category}
                        </span>
                        <h3 className="text-3xl md:text-5xl font-bold text-tm-white tracking-tight mb-3">
                            {currentProject.title}
                        </h3>

                        {/* Tech Stack - Moved Here */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {currentProject.technologies.slice(0, 3).map((tech, idx) => (
                                <span
                                    key={idx}
                                    className="text-[10px] px-2 py-1 bg-tm-slate/10 backdrop-blur-md border border-tm-slate/20 rounded text-tm-slate/80 font-mono"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Simplified Scroll Hint - Center Bottom */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                        animate={{ y: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="font-mono text-[10px] text-tm-slate/60 uppercase tracking-widest"
                    >
                        Scroll to explore
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
