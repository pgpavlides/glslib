import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ShaderPreview = ({ fragmentShader, vertexShader }) => {
  const mountRef = useRef(null);
  
  // Default vertex shader if none provided
  const defaultVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup - use orthographic camera for shader display
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Append to DOM
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    
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
      vertexShader: vertexShader || defaultVertexShader,
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
  }, [fragmentShader, vertexShader]);
  
  return (
    <div 
      ref={mountRef} 
      className="w-full h-full"
    />
  );
};

export default ShaderPreview;
