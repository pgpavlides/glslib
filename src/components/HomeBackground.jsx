import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ShaderPlane = ({ fragmentShader, vertexShader }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport, size } = useThree();

  // Set up uniforms
  const uniforms = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() }
  });

  // Update uniforms on each frame
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  // Set up resolution when component mounts or viewport/size changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  }, [viewport, size]);

  // Adjust the scale to fill the screen while maintaining the shader's aspect ratio
  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, 0]} 
    >
      {/* Use larger geometry with more subdivisions for smoother rendering */}
      <planeGeometry args={[2.5, 2.5, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
      />
    </mesh>
  );
};

const HomeBackground = ({ fragmentShader, vertexShader }) => {
  if (!fragmentShader || !vertexShader) {
    console.error("Missing shader source");
    return null;
  }
  
  return (
    <div className="fixed inset-0 -z-10 bg-gray-900 shader-background">
      <Canvas 
        camera={{ position: [0, 0, 1], fov: 45 }} 
        dpr={[1, 2]} 
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#0a1929']} />
        <ShaderPlane
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </Canvas>
    </div>
  );
};

export default HomeBackground;
