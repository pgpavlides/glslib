import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import AnimatedTitle from '../components/AnimatedTitle';

// Importing shader files directly
import fragmentShader from '../shaders/homeBackground/fragment.glsl';
import vertexShader from '../shaders/homeBackground/vertex.glsl';

const Home = () => {
  const mountRef = useRef(null);
  
  // Set up and run the Three.js scene with shader
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup - use orthographic camera for full-screen shader
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Append to DOM
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    
    // Create uniforms for the shader
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
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
      const width = window.innerWidth;
      const height = window.innerHeight;
      
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
    <div className="relative min-h-screen overflow-hidden">
      {/* Shader container */}
      <div 
        ref={mountRef} 
        className="absolute inset-0"
        style={{
          zIndex: 0,
          position: 'fixed',
        }}
      />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <AnimatedTitle 
            title="GLSL Shader Collection" 
            subtitle="Explore a collection of creative and interactive GLSL shader effects, from simple patterns to complex simulations."
          />
          
          {/* Explore button with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center"
          >
            <Link
              to="/library"
              className="inline-block px-8 py-4 bg-blue-600 bg-opacity-70 text-white font-medium text-lg rounded-lg hover:bg-blue-700 hover:bg-opacity-90 transition duration-300 backdrop-blur-sm shadow-lg"
            >
              Explore Library
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
