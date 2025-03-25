import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ShaderPlane = ({ fragmentShader, vertexShader, isFullscreen }) => {
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

  return (
    <mesh 
      ref={meshRef} 
      position={[0, 0, 0]} 
      rotation={isFullscreen ? [0, 0, 0] : [-Math.PI / 2, 0, 0]}
    >
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms.current}
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
  // Auto-resize handler for fullscreen mode
  const FullscreenHandler = () => {
    const { camera, viewport } = useThree();
    
    useEffect(() => {
      if (isFullscreen) {
        // Make sure aspect ratio is square for the shader content
        const aspect = viewport.width / viewport.height;
        
        if (aspect > 1) {
          // Landscape
          camera.position.z = 1.5;
        } else {
          // Portrait
          camera.position.z = 2;
        }
        
        camera.updateProjectionMatrix();
      }
    }, [camera, viewport]);
    
    return null;
  };

  return (
    <div className={isFullscreen ? "w-full h-full" : "w-full h-[500px]"}>
      <Canvas 
        camera={{ 
          position: [0, 0, 1.5], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
      >
        {isFullscreen && <FullscreenHandler />}
        <color attach="background" args={['#121212']} />
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
