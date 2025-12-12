'use client';

import { useMemo, useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';

// Gradient Shader Material
const GradientShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#020c1b') },
        uColorB: { value: new THREE.Color('#112240') },
        uColorC: { value: new THREE.Color('#64ffda') },
        uNoiseScale: { value: 2.0 },
        uNoiseSpeed: { value: 0.3 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uColorC;
    uniform float uNoiseScale;
    uniform float uNoiseSpeed;
    
    varying vec2 vUv;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      float noise = snoise(vec3(vUv * uNoiseScale, uTime * uNoiseSpeed));
      noise = noise * 0.5 + 0.5;
      
      vec3 color = mix(uColorA, uColorB, vUv.y);
      color = mix(color, uColorC, noise * 0.15);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

// Wave Shader Material
const WaveShaderMaterial = {
    uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#0a192f') },
        uColorB: { value: new THREE.Color('#64ffda') },
        uAmplitude: { value: 0.1 },
        uFrequency: { value: 3.0 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform float uAmplitude;
    uniform float uFrequency;
    
    varying vec2 vUv;
    
    void main() {
      float wave = sin(vUv.x * uFrequency * 3.14159 + uTime) * uAmplitude;
      wave += sin(vUv.x * uFrequency * 2.0 * 3.14159 + uTime * 1.5) * uAmplitude * 0.5;
      
      float mixValue = vUv.y + wave;
      mixValue = smoothstep(0.3, 0.7, mixValue);
      
      vec3 color = mix(uColorA, uColorA * 1.2, mixValue);
      color += uColorB * (wave + 0.1) * 0.3;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

// Gradient Mesh Background Component
export function GradientMeshBackground({
    colorA = '#020c1b',
    colorB = '#112240',
    colorC = '#64ffda',
    noiseScale = 2.0,
    noiseSpeed = 0.3,
}: {
    colorA?: string;
    colorB?: string;
    colorC?: string;
    noiseScale?: number;
    noiseSpeed?: number;
}) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(colorA) },
        uColorB: { value: new THREE.Color(colorB) },
        uColorC: { value: new THREE.Color(colorC) },
        uNoiseScale: { value: noiseScale },
        uNoiseSpeed: { value: noiseSpeed },
    }), [colorA, colorB, colorC, noiseScale, noiseSpeed]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh position={[0, 0, -5]}>
            <planeGeometry args={[30, 30]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={GradientShaderMaterial.vertexShader}
                fragmentShader={GradientShaderMaterial.fragmentShader}
            />
        </mesh>
    );
}

// Wave Background Component
export function WaveBackground({
    colorA = '#0a192f',
    colorB = '#64ffda',
    amplitude = 0.1,
    frequency = 3.0,
}: {
    colorA?: string;
    colorB?: string;
    amplitude?: number;
    frequency?: number;
}) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color(colorA) },
        uColorB: { value: new THREE.Color(colorB) },
        uAmplitude: { value: amplitude },
        uFrequency: { value: frequency },
    }), [colorA, colorB, amplitude, frequency]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh position={[0, 0, -5]}>
            <planeGeometry args={[30, 30]} />
            <shaderMaterial
                ref={materialRef}
                uniforms={uniforms}
                vertexShader={WaveShaderMaterial.vertexShader}
                fragmentShader={WaveShaderMaterial.fragmentShader}
            />
        </mesh>
    );
}

// Glow Effect Material
export function createGlowMaterial(color: string = '#64ffda', intensity: number = 1.0) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uIntensity: { value: intensity },
        },
        vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying vec3 vNormal;
      
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(uColor, intensity * uIntensity);
      }
    `,
        transparent: true,
        side: THREE.BackSide,
    });
}
