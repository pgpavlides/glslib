import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import fragmentShader from '../shaders/darkWater/fragment.glsl';
import vertexShader from '../shaders/darkWater/vertex.glsl';

const ShaderMesh = () => {
  const materialRef = useRef();
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });
  
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={{
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(800, 600) }
        }}
      />
    </mesh>
  );
};

const ShaderTest = () => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ShaderMesh />
      </Canvas>
    </div>
  );
};

export default ShaderTest;
