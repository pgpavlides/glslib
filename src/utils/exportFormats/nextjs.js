/**
 * Generates a Next.js component for the shader
 * @param {string} fragmentShader - GLSL fragment shader code
 * @param {string} vertexShader - GLSL vertex shader code
 * @param {string} title - Title of the shader
 * @returns {string} Next.js component code
 */
export const generateNextJS = (fragmentShader, vertexShader, title) => {
  const componentName = title.replace(/\s+/g, '');
  
  return `'use client';

import { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Three.js to avoid SSR issues
const ThreeShader = dynamic(() => import('../components/${componentName}Renderer'), {
  ssr: false
});

export default function ${componentName}() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <ThreeShader />
    </div>
  );
}
`;
};

/**
 * Generates a Next.js renderer component for the shader (client-side only)
 * @param {string} fragmentShader - GLSL fragment shader code
 * @param {string} vertexShader - GLSL vertex shader code
 * @param {string} title - Title of the shader
 * @returns {string} Next.js renderer component code
 */
export const generateNextJSRenderer = (fragmentShader, vertexShader, title) => {
  const componentName = title.replace(/\s+/g, '');
  
  return `'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ${componentName}Renderer() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup - use orthographic camera for full-screen shader
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Append to DOM
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    
    // Fragment Shader
    const fragmentShader = \`${fragmentShader}\`;
    
    // Vertex Shader
    const vertexShader = \`${vertexShader}\`;
    
    // Create uniforms for the shader
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      ) }
    };
    
    // Create shader material
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true
    });
    
    // Create a plane that fills the screen
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, shaderMaterial);
    scene.add(mesh);
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    let animationId;
    const animate = () => {
      uniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };
    animate();
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      scene.remove(mesh);
      geometry.dispose();
      shaderMaterial.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, []);
  
  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
    />
  );
}
`;
};
