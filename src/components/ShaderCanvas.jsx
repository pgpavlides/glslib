import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import * as THREE from 'three';

const ShaderPlane = ({ fragmentShader, vertexShader, isFullscreen }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { size } = useThree();

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
      const width = window.innerWidth;
      const height = window.innerHeight;
      materialRef.current.uniforms.uResolution.value.set(width, height);
      
      // Add resize handler
      const handleResize = () => {
        materialRef.current.uniforms.uResolution.value.set(
          window.innerWidth,
          window.innerHeight
        );
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
        transparent={true}
      />
    </mesh>
  );
};

const ShaderCanvas = ({ 
  fragmentShader, 
  vertexShader, 
  isFullscreen = false, 
  disableControls = false 
}) => {
  return (
    <div className={isFullscreen ? "w-full h-full" : "w-full h-[500px]"}>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        {/* Use OrthographicCamera from drei for easier setup */}
        <OrthographicCamera
          makeDefault
          position={[0, 0, 1]}
          zoom={1}
          left={-1}
          right={1}
          top={1}
          bottom={-1}
          near={0.1}
          far={10}
        />
        <ShaderPlane
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          isFullscreen={isFullscreen}
        />
        {!disableControls && (
          <OrbitControls enableZoom={true} enablePan={true} />
        )}
      </Canvas>
    </div>
  );
};

export default ShaderCanvas;
