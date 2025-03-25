import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Mini preview shader renderer
const ShaderPreview = ({ fragmentShader, vertexShader }) => {
  const meshRef = useRef();
  const materialRef = useRef();

  // Set up uniforms
  const uniforms = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(300, 200) }
  });

  // Update time uniform on each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

const ShaderCard = ({ shader, fragmentShader, vertexShader }) => {
  const hasShaders = fragmentShader && vertexShader && fragmentShader.length > 0 && vertexShader.length > 0;

  return (
    <Link 
      to={`/shader/${shader.id}`}
      className="block overflow-hidden rounded-lg bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="h-40 relative bg-gray-900">
        {hasShaders ? (
          <Canvas camera={{ position: [0, 0, 1.5] }}>
            <ShaderPreview 
              fragmentShader={fragmentShader}
              vertexShader={vertexShader}
            />
          </Canvas>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{shader.name}</h3>
        <p className="text-gray-300 text-sm mb-3">{shader.description}</p>
        <div className="flex flex-wrap gap-2">
          {shader.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ShaderCard;
