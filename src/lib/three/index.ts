// Three.js Library Exports
// Central export file for all Three.js components and utilities

// Core wrapper
export { default as SceneWrapper, useReducedMotion, useDeviceCapabilities } from './SceneWrapper';

// Particle systems
export { default as ParticleGrid, ParticleConnections } from './ParticleGrid';

// Low-poly shapes
export {
    Icosahedron,
    Octahedron,
    Dodecahedron,
    Torus,
    Tetrahedron,
    WireframeCube,
    GlowingSphere,
} from './LowPolyShapes';

// Shader materials
export {
    GradientMeshBackground,
    WaveBackground,
    createGlowMaterial,
} from './ShaderMaterials';

// Parallax elements
export {
    ParallaxGroup,
    ParallaxElement,
    ScrollAnimatedElement,
    CameraParallax,
} from './ParallaxElements';
