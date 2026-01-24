'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import SpiralCards from '@/lib/three/SpiralCards';
import { projects } from '@/data/projects';

interface SpiralSceneProps {
    scrollProgress: number;
    activeIndex: number;
    onActiveIndexChange: (index: number) => void;
}

function SpiralScene({ scrollProgress, activeIndex, onActiveIndexChange }: SpiralSceneProps) {
    // Extract first letters from project titles
    const projectLetters = projects.map(p => p.title.charAt(0).toUpperCase());

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={0.8} />
            <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#dfff00" />
            <pointLight position={[0, 0, 0]} intensity={0.5} color="#dfff00" />

            <SpiralCards
                cardCount={projects.length}
                radius={3.5}
                spiralHeight={5}
                scrollProgress={scrollProgress}
                cardWidth={1.6}
                cardHeight={2.2}
                projectLetters={projectLetters}
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

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const handleWheel = (e: WheelEvent) => {
            const delta = e.deltaY * 0.0008; // Adjusted sensitivity
            const maxProgress = (projects.length - 1) / projects.length;
            
            setScrollProgress(prev => {
                const newProgress = prev + delta;
                
                // Check if we're at the boundaries
                if (newProgress > maxProgress && e.deltaY > 0) {
                    // Scrolling down beyond last project - allow page scroll to next section
                    return maxProgress;
                } else if (newProgress < 0 && e.deltaY < 0) {
                    // Scrolling up beyond first project - allow page scroll to previous section
                    return 0;
                } else if (newProgress >= 0 && newProgress <= maxProgress) {
                    // Within bounds - prevent default scroll
                    e.preventDefault();
                    return Math.max(0, Math.min(maxProgress, newProgress));
                }
                
                return prev;
            });
        };

        // Add wheel event listener
        section.addEventListener('wheel', handleWheel, { passive: false });

        return () => section.removeEventListener('wheel', handleWheel);
    }, []);

    const handleActiveIndexChange = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section 
            ref={sectionRef}
            id="spiral-showcase" 
            className="relative h-screen bg-tm-navy overflow-hidden"
        >

                {/* Section Header */}
                <div className="absolute top-12 left-6 md:left-12 z-20">
                    <span className="font-mono text-[10px] text-tm-green uppercase tracking-[0.2em]">
                        [ Featured Work ]
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-tm-white tracking-tight mt-2">
                        Projects
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
                        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                        <Suspense fallback={null}>
                            <SpiralScene 
                                scrollProgress={scrollProgress}
                                activeIndex={activeIndex}
                                onActiveIndexChange={handleActiveIndexChange}
                            />
                            <Preload all />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Center Letter Display - HTML Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-15 pointer-events-none">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-[120px] md:text-[180px] font-bold text-tm-green/20"
                    >
                        {projects[activeIndex].title.charAt(0).toUpperCase()}
                    </motion.div>
                </div>

                {/* Project Info Overlay */}
                <div className="absolute bottom-12 left-6 md:left-12 z-20">
                    {/* Current Project Info - Left */}
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-md"
                    >
                        <span className="font-mono text-[10px] text-tm-green uppercase tracking-widest block mb-2">
                            {projects[activeIndex].category}
                        </span>
                        <h3 className="text-2xl md:text-4xl font-bold text-tm-white tracking-tight mb-2">
                            {projects[activeIndex].title}
                        </h3>
                        <p className="text-tm-slate/60 text-sm">
                            {projects[activeIndex].description}
                        </p>
                    </motion.div>
                </div>

                {/* Project Explanation - Bottom Right */}
                <div className="absolute bottom-12 right-6 md:right-12 z-20 max-w-md">
                    <motion.div
                        key={`explanation-${activeIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <div className="mb-4">
                            <h4 className="text-sm font-mono text-tm-green/80 uppercase tracking-widest mb-3">
                                About
                            </h4>
                            <p className="text-tm-slate/80 text-sm leading-relaxed mb-4">
                                {projects[activeIndex].longDescription}
                            </p>
                        </div>

                        {/* Technologies */}
                        <div className="mb-4">
                            <h5 className="text-xs font-mono text-tm-green/60 uppercase tracking-wider mb-2">
                                Tech Stack
                            </h5>
                            <div className="flex flex-wrap gap-2">
                                {projects[activeIndex].technologies.map((tech, idx) => (
                                    <span
                                        key={idx}
                                        className="text-[10px] px-2 py-1 bg-tm-slate/10 border border-tm-slate/20 rounded text-tm-slate/70 font-mono"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Dots */}
                        <div className="flex gap-2 mt-6">
                            {projects.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    aria-label={`View project ${index + 1}`}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        index === activeIndex
                                            ? 'bg-tm-green w-6'
                                            : 'bg-tm-slate/30 hover:bg-tm-slate/50'
                                    }`}
                                />
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Hint */}
                <div className="absolute bottom-12 right-6 md:right-auto md:left-1/2 md:-translate-x-1/2 z-20">
                    <span className="font-mono text-[10px] text-tm-slate/40 uppercase tracking-widest">
                        Scroll to explore
                    </span>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-6 -translate-y-1/2 z-20 hidden md:block">
                    <div className="flex flex-col gap-4 font-mono text-[10px] text-tm-slate/30 uppercase tracking-widest">
                        <span className="-rotate-90 whitespace-nowrap origin-left">Interactive 3D</span>
                    </div>
                </div>
        </section>
    );
}
