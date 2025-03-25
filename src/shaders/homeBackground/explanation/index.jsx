import React, { useState } from 'react';
import Latex from 'react-latex';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import ShaderPreview from './ShaderPreview';

// Components for the explanation
const Section = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="mb-8 border border-gray-700 rounded-lg overflow-hidden bg-gray-800 bg-opacity-50">
      <button 
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-700 hover:bg-gray-600 transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="text-gray-300">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

const PreviewBlock = ({ fragmentShader, vertexShader, note }) => (
  <div className="my-6 border border-blue-700 rounded-lg overflow-hidden">
    <div className="h-64 md:h-80">
      <ShaderPreview
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </div>
    {note && (
      <div className="p-3 bg-blue-900 bg-opacity-50 text-sm text-gray-300">
        {note}
      </div>
    )}
  </div>
);

const CodeBlock = ({ code }) => (
  <pre className="my-4 p-4 bg-gray-900 rounded-md overflow-x-auto font-mono text-sm text-gray-300">
    {code}
  </pre>
);

// Custom component for larger mathematical formulas
const MathFormula = ({ formula }) => (
  <div className="my-6 py-6 px-4 bg-gray-900 rounded-md overflow-x-auto text-center">
    <div className="text-2xl">
      <Latex>{formula}</Latex>
    </div>
  </div>
);

// Main explanation component
const HomeBackgroundExplanation = ({ fragmentShader, vertexShader }) => {
  // Simplified basic shader with just oscillating colors
  const basicShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  // Simple oscillating colors
  vec3 col = 0.5 + 0.5 * cos(uTime + vUv.xyx * 2.0 + vec3(0, 2, 4));
  gl_FragColor = vec4(col, 1.0);
}`;

  // Basic sphere SDF shader
  const sphereShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p) {
  // Animate the sphere position
  vec3 spherePos = vec3(0.0, sin(uTime) * 0.2, 0.0);
  return sdSphere(p - spherePos, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  vec3 ro = vec3(0.0, 0.0, -2.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 5.0;
  
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.2, 0.3, 0.8) * diff;
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Torus SDF shader
  const torusShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Torus SDF
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// Ray marching setup
float map(vec3 p) {
  // Rotate the torus
  float angle = uTime * 0.5;
  float c = cos(angle);
  float s = sin(angle);
  vec3 q = vec3(
    c * p.x + s * p.z,
    p.y,
    -s * p.x + c * p.z
  );
  
  return sdTorus(q, vec2(0.6, 0.2));
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  vec3 ro = vec3(0.0, 0.0, -2.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 5.0;
  
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.8, 0.3, 0.2) * diff;
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Octahedron SDF shader
  const octahedronShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Octahedron SDF
float sdOctahedron(vec3 p, float s) {
  p = abs(p);
  return (p.x + p.y + p.z - s) * 0.57735027;
}

// Ray marching setup
float map(vec3 p) {
  // Rotate and pulse the octahedron
  float angle = uTime * 0.5;
  float c = cos(angle);
  float s = sin(angle);
  vec3 q = vec3(
    c * p.x + s * p.z,
    p.y,
    -s * p.x + c * p.z
  );
  
  float size = 0.5 + 0.1 * sin(uTime * 2.0);
  return sdOctahedron(q, size);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  vec3 ro = vec3(0.0, 0.0, -2.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 5.0;
  
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.3, 0.8, 0.5) * diff;
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Shape morphing shader
  const morphingShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Torus SDF
float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// Octahedron SDF
float sdOctahedron(vec3 p, float s) {
  p = abs(p);
  return (p.x + p.y + p.z - s) * 0.57735027;
}

// Ray marching setup
float map(vec3 p) {
  // Rotate the shapes
  float angle = uTime * 0.5;
  float c = cos(angle);
  float s = sin(angle);
  vec3 q = vec3(
    c * p.x + s * p.z,
    p.y,
    -s * p.x + c * p.z
  );
  
  // Calculate SDFs for each shape
  float sphere = sdSphere(q, 0.5);
  float torus = sdTorus(q, vec2(0.6, 0.2));
  float octahedron = sdOctahedron(q, 0.5);
  
  // Morphing factor
  float morphFactor = uTime * 0.5;
  
  // Interpolate between shapes
  float shape = mix(
    mix(sphere, torus, smoothstep(0.0, 1.0, sin(morphFactor) * 0.5 + 0.5)),
    octahedron,
    smoothstep(0.0, 1.0, cos(morphFactor) * 0.5 + 0.5)
  );
  
  return shape;
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  vec3 ro = vec3(0.0, 0.0, -2.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 5.0;
  
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Rainbow coloring based on normal and time
    col = 0.5 + 0.5 * cos(uTime * 0.5 + normal.xyz + vec3(0, 2, 4));
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Space folding shader
  const spaceFoldingShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p) {
  // Space folding - create repeating patterns
  vec3 q = mod(p - 2.0, 4.0) - 2.0;
  
  // Animate the sphere
  float time = uTime * 0.5;
  vec3 spherePos = vec3(sin(time) * 0.5, cos(time * 0.7) * 0.5, 0.0);
  
  return sdSphere(q - spherePos, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Animate camera position
  float camTime = uTime * 0.2;
  vec3 ro = vec3(sin(camTime) * 3.0, cos(camTime * 0.7) * 1.0, -5.0 + sin(camTime * 0.5) * 2.0);
  vec3 lookAt = vec3(0.0, 0.0, 0.0);
  
  // Camera setup
  vec3 forward = normalize(lookAt - ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);
  vec3 rd = normalize(forward + right * uv.x + up * uv.y);
  
  // Ray marching
  float t = 0.0;
  float tmax = 20.0;
  float ac = 0.0; // Accumulator for glow
  
  for(int i = 0; i < 90; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    // Ensure we don't get too close
    d = max(abs(d), 0.01);
    
    // Accumulate glow based on distance
    ac += exp(-d * 25.0);
    
    // Step along the ray
    t += d * 0.6;
    
    if(t > tmax) break;
  }
  
  // Coloring with glow effect
  vec3 col = vec3(0.0);
  
  // Apply glow with color variation
  vec3 glowColor = 0.5 + 0.5 * cos(uTime * 0.5 + uv.xyx * 2.0 + vec3(0, 2, 4));
  col += glowColor * ac * 0.02;
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Visual Effects Shaders
  
  // Space folding effect only
  const spaceFoldingEffectShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p) {
  // Space folding - create repeating patterns
  vec3 q = mod(p - 2.0, 4.0) - 2.0;
  
  // Static sphere
  return sdSphere(q, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Static camera
  vec3 ro = vec3(0.0, 0.0, -5.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 20.0;
  
  for(int i = 0; i < 90; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Simple coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.2, 0.3, 0.8) * diff;
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Glow effect only
  const glowEffectShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p) {
  // Static sphere
  return sdSphere(p, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Static camera
  vec3 ro = vec3(0.0, 0.0, -3.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 10.0;
  float ac = 0.0; // Accumulator for glow
  
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    // Ensure we don't get too close
    d = max(abs(d), 0.01);
    
    // Accumulate glow based on distance
    ac += exp(-d * 25.0);
    
    // Step along the ray
    t += d;
    
    if(d < 0.001 || t > tmax) break;
  }
  
  // Coloring with glow effect
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    // Base color for the sphere
    col = vec3(0.2, 0.3, 0.8);
  }
  
  // Apply glow
  col += vec3(0.2, 0.3, 0.8) * ac * 0.02;
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Color variation effect only
  const colorVariationShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p) {
  // Static sphere
  return sdSphere(p, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Static camera
  vec3 ro = vec3(0.0, 0.0, -3.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 10.0;
  
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Coloring with color variation
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Color variation based on normal and time
    col = 0.5 + 0.5 * cos(uTime + normal.xyz + vec3(0, 2, 4));
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Camera movement effect only
  const cameraMovementShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p) {
  // Static sphere
  return sdSphere(p, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Animate camera position
  float camTime = uTime * 0.5;
  vec3 ro = vec3(sin(camTime) * 3.0, cos(camTime * 0.7) * 1.0, -3.0 + sin(camTime * 0.5) * 1.0);
  vec3 lookAt = vec3(0.0, 0.0, 0.0);
  
  // Camera setup
  vec3 forward = normalize(lookAt - ro);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);
  vec3 rd = normalize(forward + right * uv.x + up * uv.y);
  
  // Ray marching
  float t = 0.0;
  float tmax = 10.0;
  
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Simple coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.2, 0.3, 0.8) * diff;
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // Optimization Shaders
  
  // Low step count vs high step count
  const stepCountShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p) {
  // Static sphere
  return sdSphere(p, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Static camera
  vec3 ro = vec3(0.0, 0.0, -3.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching with different step counts based on x position
  float t = 0.0;
  float tmax = 10.0;
  
  // Use low step count on left side, high on right side
  int maxSteps = uv.x < 0.0 ? 10 : 64;
  
  for(int i = 0; i < 64; i++) {
    if(i >= maxSteps) break;
    
    vec3 p = ro + rd * t;
    float d = map(p);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Simple coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.2, 0.3, 0.8) * diff;
  }
  
  // Add a vertical line to show the split
  if(abs(uv.x) < 0.01) {
    col = vec3(1.0, 1.0, 1.0);
  }
  
  // Add labels
  if(abs(uv.y) > 0.8) {
    if(uv.x < -0.2 && uv.x > -0.6) {
      col = vec3(1.0, 0.0, 0.0); // "Low Steps" label
    }
    if(uv.x > 0.2 && uv.x < 0.6) {
      col = vec3(0.0, 1.0, 0.0); // "High Steps" label
    }
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // With/without minimum step size
  const minStepSizeShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p) {
  // Create a complex scene with thin features
  float sphere1 = sdSphere(p, 0.5);
  float sphere2 = sdSphere(p - vec3(0.6, 0.0, 0.0), 0.1);
  return min(sphere1, sphere2);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Static camera
  vec3 ro = vec3(0.0, 0.0, -3.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 10.0;
  
  for(int i = 0; i < 128; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    
    // Apply minimum step size on right side only
    if(uv.x > 0.0) {
      d = max(abs(d), 0.01);
    }
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Simple coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0)) - map(p - vec3(0.001, 0.0, 0.0)),
      map(p + vec3(0.0, 0.001, 0.0)) - map(p - vec3(0.0, 0.001, 0.0)),
      map(p + vec3(0.0, 0.0, 0.001)) - map(p - vec3(0.0, 0.0, 0.001))
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.2, 0.3, 0.8) * diff;
  }
  
  // Add a vertical line to show the split
  if(abs(uv.x) < 0.01) {
    col = vec3(1.0, 1.0, 1.0);
  }
  
  // Add labels
  if(abs(uv.y) > 0.8) {
    if(uv.x < -0.2 && uv.x > -0.6) {
      col = vec3(1.0, 0.0, 0.0); // "No Min Step" label
    }
    if(uv.x > 0.2 && uv.x < 0.6) {
      col = vec3(0.0, 1.0, 0.0); // "With Min Step" label
    }
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // With/without space repetition
  const spaceRepetitionShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p, bool useRepetition) {
  vec3 q = p;
  
  // Apply space repetition on right side
  if(useRepetition) {
    q = mod(p - 2.0, 4.0) - 2.0;
  }
  
  return sdSphere(q, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Static camera
  vec3 ro = vec3(0.0, 0.0, -5.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 20.0;
  bool useRepetition = uv.x > 0.0;
  
  for(int i = 0; i < 90; i++) {
    vec3 p = ro + rd * t;
    float d = map(p, useRepetition);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Simple coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0), useRepetition) - map(p - vec3(0.001, 0.0, 0.0), useRepetition),
      map(p + vec3(0.0, 0.001, 0.0), useRepetition) - map(p - vec3(0.0, 0.001, 0.0), useRepetition),
      map(p + vec3(0.0, 0.0, 0.001), useRepetition) - map(p - vec3(0.0, 0.0, 0.001), useRepetition)
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.2, 0.3, 0.8) * diff;
  }
  
  // Add a vertical line to show the split
  if(abs(uv.x) < 0.01) {
    col = vec3(1.0, 1.0, 1.0);
  }
  
  // Add labels
  if(abs(uv.y) > 0.8) {
    if(uv.x < -0.2 && uv.x > -0.6) {
      col = vec3(1.0, 0.0, 0.0); // "No Repetition" label
    }
    if(uv.x > 0.2 && uv.x < 0.6) {
      col = vec3(0.0, 1.0, 0.0); // "With Repetition" label
    }
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  // With/without time variation
  const timeVariationShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Sphere SDF
float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

// Ray marching setup
float map(vec3 p, float time) {
  // Animate the sphere position based on time
  vec3 spherePos = vec3(sin(time) * 0.5, cos(time * 0.7) * 0.5, 0.0);
  return sdSphere(p - spherePos, 0.5);
}

void main() {
  // Setup ray
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;
  
  // Static camera
  vec3 ro = vec3(0.0, 0.0, -3.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  
  // Ray marching
  float t = 0.0;
  float tmax = 10.0;
  bool useTimeVariation = uv.x > 0.0;
  
  for(int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    
    // Use time variation on right side
    float time = useTimeVariation ? uTime - float(i) * 0.008 : uTime;
    float d = map(p, time);
    
    if(d < 0.001 || t > tmax) break;
    t += d;
  }
  
  // Simple coloring
  vec3 col = vec3(0.0);
  
  if(t < tmax) {
    vec3 p = ro + rd * t;
    float time = useTimeVariation ? uTime - 64.0 * 0.008 : uTime; // Use final time for normal calculation
    vec3 normal = normalize(vec3(
      map(p + vec3(0.001, 0.0, 0.0), time) - map(p - vec3(0.001, 0.0, 0.0), time),
      map(p + vec3(0.0, 0.001, 0.0), time) - map(p - vec3(0.0, 0.001, 0.0), time),
      map(p + vec3(0.0, 0.0, 0.001), time) - map(p - vec3(0.0, 0.0, 0.001), time)
    ));
    
    // Simple lighting
    vec3 light = normalize(vec3(1.0, 1.0, -1.0));
    float diff = max(0.0, dot(normal, light));
    
    col = vec3(0.2, 0.3, 0.8) * diff;
  }
  
  // Add a vertical line to show the split
  if(abs(uv.x) < 0.01) {
    col = vec3(1.0, 1.0, 1.0);
  }
  
  // Add labels
  if(abs(uv.y) > 0.8) {
    if(uv.x < -0.2 && uv.x > -0.6) {
      col = vec3(1.0, 0.0, 0.0); // "No Time Variation" label
    }
    if(uv.x > 0.2 && uv.x < 0.6) {
      col = vec3(0.0, 1.0, 0.0); // "With Time Variation" label
    }
  }
  
  gl_FragColor = vec4(col, 1.0);
}`;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Fractal Shapes Shader - Technical Explanation</h1>
      
      <p className="mb-6">
        This shader creates a mesmerizing animation of morphing 3D shapes in an infinite space.
        It uses ray marching techniques and signed distance functions (SDFs) to render complex 3D shapes
        without using traditional polygon meshes.
      </p>

      <PreviewBlock 
        fragmentShader={fragmentShader} 
        vertexShader={vertexShader} 
        note="The complete Fractal Shapes shader animation."
      />
      
      <Section title="1. Basic Concepts">
        <p>
          At its core, this shader uses a technique called ray marching with signed distance functions (SDFs).
          Unlike traditional 3D rendering that uses triangles and vertices, SDFs define shapes mathematically
          as the distance from any point in space to the surface of the shape.
        </p>
        
        <p className="mt-4">
          The distance function for a sphere with radius r is simply:
        </p>
        
        <MathFormula formula={"$f(p) = |p| - r$"} />
        
        <p>
          Where <Latex>{"$|p|$"}</Latex> is the length of the vector from the origin to point p.
          If the result is negative, the point is inside the sphere; if positive, it's outside.
          This elegant mathematical property allows us to determine whether a point is inside or outside
          the shape with a single function evaluation.
        </p>
        
        <p className="mt-4">
          In GLSL code, this is implemented as:
        </p>
        
        <CodeBlock code={`float sdSphere(vec3 p, float r) {
  return length(p) - r;
}`}/>
        
        <p className="mt-4">
          The <code>length(p)</code> function calculates the Euclidean distance <Latex>{"$|p|$"}</Latex> from the origin to point p.
          Subtracting the radius gives us the signed distance.
        </p>
        
        <PreviewBlock
          fragmentShader={basicShader}
          vertexShader={vertexShader}
          note="A simple shader showing oscillating colors - the foundation of our visual effect. This demonstrates how we can create smooth color transitions using cosine functions."
        />
        
        <p className="mt-4">
          The basic color oscillation is created with this code:
        </p>
        
        <CodeBlock code={`vec3 col = 0.5 + 0.5 * cos(uTime + vUv.xyx * 2.0 + vec3(0, 2, 4));`}/>
        
        <p className="mt-4">
          This formula creates a rainbow effect by:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Using the cosine function which oscillates between -1 and 1</li>
          <li>Scaling and shifting it to the 0-1 range with <code>0.5 + 0.5 * ...</code></li>
          <li>Adding different phase offsets <code>vec3(0, 2, 4)</code> for red, green, and blue channels</li>
          <li>Incorporating UV coordinates and time for spatial and temporal variation</li>
        </ul>
        
        <PreviewBlock
          fragmentShader={sphereShader}
          vertexShader={vertexShader}
          note="A basic sphere rendered using ray marching and signed distance functions. Notice how the lighting reveals the 3D shape."
        />
        
        <p className="mt-4">
          The ray marching algorithm works by:
        </p>
        
        <ol className="list-decimal pl-6 space-y-2 mt-2">
          <li>Casting a ray from the camera for each pixel</li>
          <li>Stepping along the ray by the distance to the nearest surface</li>
          <li>Stopping when we hit a surface or reach a maximum number of steps</li>
        </ol>
        
        <p className="mt-4">
          The core ray marching loop in the sphere shader:
        </p>
        
        <CodeBlock code={`// Ray marching
float t = 0.0;
float tmax = 5.0;

for(int i = 0; i < 64; i++) {
  vec3 p = ro + rd * t;
  float d = map(p);
  
  if(d < 0.001 || t > tmax) break;
  t += d;
}`}/>
        
        <p className="mt-4">
          Where:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><code>ro</code> is the ray origin (camera position)</li>
          <li><code>rd</code> is the ray direction</li>
          <li><code>t</code> is the distance traveled along the ray</li>
          <li><code>map(p)</code> returns the signed distance to the nearest surface at point p</li>
          <li><code>0.001</code> is the surface threshold - we consider we've hit a surface when the distance is less than this value</li>
        </ul>
      </Section>
      
      <Section title="2. Shape Definitions">
        <p>
          The shader defines several primitive shapes using signed distance functions. Each shape has a unique mathematical representation that defines its geometry precisely.
        </p>
        
        <p className="mt-4">
          <strong>Sphere:</strong> The simplest SDF, as shown above.
        </p>
        
        <MathFormula formula={"$sdSphere(p, r) = |p| - r$"} />
        
        <p className="mt-4">
          In GLSL, the sphere SDF is implemented as:
        </p>
        
        <CodeBlock code={`float sdSphere(vec3 p, float r) {
  return length(p) - r;
}`}/>
        
        <p className="mt-4">
          The sphere is the most fundamental shape in ray marching because its distance function is simply the Euclidean distance from the center minus the radius. This makes it computationally efficient and mathematically elegant.
        </p>
        
        <PreviewBlock
          fragmentShader={sphereShader}
          vertexShader={vertexShader}
          note="A sphere rendered with ray marching. Notice how the lighting creates a perfect gradient across the surface."
        />
        
        <p className="mt-4">
          <strong>Torus:</strong> A ring shape defined by two radii - the major radius (from center to ring center) and minor radius (thickness of the ring).
        </p>
        
        <MathFormula formula={"$sdTorus(p, t) = ||(|p_{xz}| - t_x, p_y)|| - t_y$"} />
        
        <p className="mt-4">
          In GLSL, the torus SDF is implemented as:
        </p>
        
        <CodeBlock code={`float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}`}/>
        
        <p className="mt-4">
          This function works by:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mt-2">
          <li>First calculating the distance from the point to the circle in the XZ plane: <code>length(p.xz) - t.x</code></li>
          <li>Creating a 2D vector <code>q</code> with this distance and the Y coordinate</li>
          <li>Computing the length of this vector minus the minor radius</li>
        </ol>
        
        <p className="mt-4">
          The torus is oriented so that its "hole" is aligned with the Y axis. The rotation in the shader is applied to the point before calculating the SDF.
        </p>
        
        <PreviewBlock
          fragmentShader={torusShader}
          vertexShader={vertexShader}
          note="A torus (donut shape) rendered with ray marching. The rotation shows the complete 3D structure."
        />
        
        <p className="mt-4">
          <strong>Octahedron:</strong> A diamond-like shape with 8 triangular faces.
        </p>
        
        <MathFormula formula={"$sdOctahedron(p, s) = (|p_x| + |p_y| + |p_z| - s) \\times 0.57735027$"} />
        
        <p className="mt-4">
          In GLSL, the octahedron SDF is implemented as:
        </p>
        
        <CodeBlock code={`float sdOctahedron(vec3 p, float s) {
  p = abs(p);
  return (p.x + p.y + p.z - s) * 0.57735027;
}`}/>
        
        <p className="mt-4">
          The octahedron function:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Takes the absolute value of each coordinate to exploit the shape's symmetry</li>
          <li>Calculates the sum of the coordinates minus the size parameter</li>
          <li>Multiplies by 0.57735027 (which is 1/√3) to normalize the distance</li>
        </ul>
        
        <p className="mt-4">
          The octahedron is particularly interesting because its distance function uses the L1 norm (Manhattan distance) rather than the L2 norm (Euclidean distance) used for spheres.
        </p>
        
        <PreviewBlock
          fragmentShader={octahedronShader}
          vertexShader={vertexShader}
          note="An octahedron (diamond shape) rendered with ray marching. Notice the sharp edges and flat faces."
        />
        
        <p className="mt-4">
          These shapes are combined and morphed over time to create the dynamic animation. The mathematical precision of SDFs allows for exact calculations of distances, which enables smooth transitions between shapes.
        </p>
      </Section>
      
      <Section title="3. Shape Morphing">
        <p>
          One of the key aspects of this shader is the smooth morphing between different shapes.
          This is achieved using GLSL's mix function, which performs linear interpolation between two values:
        </p>
        
        <MathFormula formula={"$mix(a, b, t) = a \\times (1 - t) + b \\times t$"} />
        
        <p className="mt-4">
          When t = 0, the result is a; when t = 1, the result is b; and for values in between, we get a smooth blend.
          This mathematical operation is fundamental to the morphing effect and is directly implemented in GLSL:
        </p>
        
        <CodeBlock code={`// GLSL's built-in mix function
float mix(float a, float b, float t) {
  return a * (1.0 - t) + b * t;
}`}/>
        
        <p className="mt-4">
          For even smoother transitions, we use the smoothstep function to create an S-curve interpolation factor:
        </p>
        
        <MathFormula formula={"$smoothstep(a, b, x) = 3x^2 - 2x^3 \\quad \\text{where} \\quad x = clamp\\left(\\frac{t-a}{b-a}, 0, 1\\right)$"} />
        
        <p className="mt-4">
          The smoothstep function creates a smoother transition by:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>First clamping the input to the range [0,1]</li>
          <li>Applying a cubic Hermite interpolation (3x² - 2x³)</li>
          <li>This creates an S-shaped curve that starts and ends with zero slope</li>
        </ul>
        
        <p className="mt-4">
          In our shader, we combine these techniques to create a complex morphing between three shapes:
        </p>
        
        <CodeBlock code={`float shape = mix(
    mix(sphere, torus, smoothstep(0.0, 1.0, sin(morphFactor) * 0.5 + 0.5)),
    octahedron,
    smoothstep(0.0, 1.0, cos(morphFactor) * 0.5 + 0.5)
);`}/>

        <p className="mt-4">
          This code:
        </p>
        <ol className="list-decimal pl-6 space-y-2 mt-2">
          <li>First interpolates between sphere and torus using a sine wave</li>
          <li>Then interpolates between that result and the octahedron using a cosine wave</li>
          <li>The sine and cosine waves are offset, creating a continuous cycle of morphing</li>
          <li>The <code>* 0.5 + 0.5</code> transforms the -1 to 1 range of sine/cosine to 0 to 1 for smoothstep</li>
        </ol>
        
        <p className="mt-4">
          The mathematical beauty of SDFs is that we can blend between completely different shapes by simply
          interpolating their distance functions. This is not possible with traditional mesh-based rendering.
        </p>

        <PreviewBlock
          fragmentShader={morphingShader}
          vertexShader={vertexShader}
          note="Smooth morphing between sphere, torus, and octahedron shapes. Watch how the shapes blend seamlessly into each other."
        />
      </Section>
      
      <Section title="4. Ray Marching Algorithm">
        <p>
          Ray marching is a rendering technique where we cast rays from the camera and step along them
          iteratively until we hit a surface or reach a maximum number of steps. Unlike traditional ray tracing,
          ray marching leverages the mathematical properties of SDFs to efficiently find intersections.
        </p>
        
        <MathFormula formula={"$p(t) = o + t \\cdot d$"} />
        
        <p className="mt-4">
          Where:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li><Latex>{"$p(t)$"}</Latex> is the position along the ray at distance t</li>
          <li><Latex>{"$o$"}</Latex> is the ray origin (camera position)</li>
          <li><Latex>{"$d$"}</Latex> is the ray direction</li>
          <li><Latex>{"$t$"}</Latex> is the distance traveled along the ray</li>
        </ul>
        
        <p className="mt-4">
          The key insight of ray marching is that the SDF tells us the minimum safe distance we can travel along the ray
          without missing any surface. This allows us to take large steps in empty space and small steps near surfaces.
        </p>
        
        <p className="mt-4">
          The algorithm works as follows:
        </p>
        
        <CodeBlock code={`float t = 0.1;  // Initial distance along the ray
for (int i = 0; i < 90; i++) {  // Maximum of 90 steps
    vec3 pos = ro + ray * t;    // Current position along the ray
    // Create infinite repeating space
    pos = mod(pos-2., 4.) - 2.; // Repeat the space
    gTime = uTime - float(i) * 0.008; // Time variation
    
    float d = map(pos, uTime);  // Get distance to nearest surface
    d = max(abs(d), 0.01);      // Ensure we don't get too close
    ac += exp(-d*25.);          // Accumulate glow based on distance
    t += d * 0.6;               // Step along the ray
}`}/>
        
        <p className="mt-4">
          Let's break down each line:
        </p>
        
        <ol className="list-decimal pl-6 space-y-2 mt-2">
          <li><code>float t = 0.1;</code> - Start a small distance away from the camera to avoid self-intersections</li>
          <li><code>for (int i = 0; i &lt; 90; i++) {'{'}</code> - Limit to 90 iterations to prevent infinite loops</li>
          <li><code>vec3 pos = ro + ray * t;</code> - Calculate the current position along the ray</li>
          <li><code>pos = mod(pos-2., 4.) - 2.;</code> - Apply space folding to create an infinite repeating pattern</li>
          <li><code>gTime = uTime - float(i) * 0.008;</code> - Create time variation based on ray step for depth effects</li>
          <li><code>float d = map(pos, uTime);</code> - Get the distance to the nearest surface at this position</li>
          <li><code>d = max(abs(d), 0.01);</code> - Ensure we don't take steps smaller than 0.01 to avoid precision issues</li>
          <li><code>ac += exp(-d*25.);</code> - Accumulate glow effect (stronger when close to surfaces)</li>
          <li><code>t += d * 0.6;</code> - Step along the ray by a fraction of the safe distance (0.6 for stability)</li>
        </ol>
        
        <p className="mt-4">
          The space folding technique using the <code>mod()</code> function is particularly interesting. It creates an infinite
          repeating pattern by mapping any position in 3D space to a fixed-size cell:
        </p>
        
        <MathFormula formula={"$fold(p) = mod(p - a, b) - a$"} />
        
        <p className="mt-4">
          This mathematical trick allows us to create infinite complexity with minimal computation, as we're
          effectively reusing the same shapes over and over in a repeating grid.
        </p>
        
        <p className="mt-4">
          This technique allows rendering complex scenes without traditional polygon meshes, enabling
          procedural generation of infinite detailed worlds with relatively simple code.
        </p>
        
        <PreviewBlock
          fragmentShader={spaceFoldingShader}
          vertexShader={vertexShader}
          note="Ray marching with space folding creates an infinite repeating pattern of shapes. Notice how the scene extends infinitely in all directions."
        />
      </Section>
      
      <Section title="5. Visual Effects">
        <p>
          The shader employs several sophisticated techniques for visual enhancement that combine
          to create the distinctive aesthetic of the final result:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>Space folding</strong> - The mod() operation creates an infinite repeating pattern
            <CodeBlock code={`pos = mod(pos-2., 4.) - 2.; // Repeat the space`}/>
            <p className="mt-2">
              This maps any position in 3D space to a 4-unit cube centered at the origin,
              effectively creating an infinite grid of identical cells.
            </p>
            <PreviewBlock
              fragmentShader={spaceFoldingEffectShader}
              vertexShader={vertexShader}
              note="Space folding creates an infinite grid of repeating shapes from a single shape definition."
            />
          </li>
          
          <li>
            <strong>Glow effect</strong> - Accumulation of values during ray marching creates the glow
            <CodeBlock code={`ac += exp(-d*25.); // Accumulate glow based on distance`}/>
            <p className="mt-2">
              The exponential function creates an intense glow near surfaces (small d values)
              that quickly falls off with distance. The accumulation along the ray creates
              volumetric lighting effects without requiring actual volumetric rendering.
            </p>
            <PreviewBlock
              fragmentShader={glowEffectShader}
              vertexShader={vertexShader}
              note="The glow effect creates a soft volumetric lighting around objects without expensive volumetric calculations."
            />
          </li>
          
          <li>
            <strong>Color variation</strong> - Sine and cosine functions create gradual color variations
            <CodeBlock code={`vec3 col = 0.5 + 0.5 * cos(uTime + p + vec3(0, 2, 4));`}/>
            <p className="mt-2">
              By using different phase offsets for each color channel (0, 2, 4), we create
              a rainbow effect that cycles through the color spectrum. Adding position and time
              dependencies creates spatial and temporal variations.
            </p>
            <PreviewBlock
              fragmentShader={colorVariationShader}
              vertexShader={vertexShader}
              note="Color variation using cosine functions with different phase offsets creates smooth rainbow effects."
            />
          </li>
          
          <li>
            <strong>Camera movement</strong> - Gentle camera motion keeps the scene dynamic
            <CodeBlock code={`vec3 ro = vec3(sin(time) * 3.0, cos(time * 0.7), -5.0);`}/>
            <p className="mt-2">
              The camera follows a smooth elliptical path, providing different perspectives
              of the scene over time. Using different frequencies for different axes
              (time vs time*0.7) creates a more organic, less mechanical motion.
            </p>
            <PreviewBlock
              fragmentShader={cameraMovementShader}
              vertexShader={vertexShader}
              note="Camera movement along an elliptical path creates dynamic views of the scene."
            />
          </li>
        </ul>
        
        <p className="mt-4">
          The combination of these techniques creates the fluid, ethereal visual effect. The mathematical
          precision of SDFs combined with the artistic application of color and movement results in
          a mesmerizing visual experience that would be extremely difficult to achieve with traditional
          rendering techniques.
        </p>
        
        <p className="mt-4">
          The glow effect is particularly important for the visual style, as it creates a sense of
          volumetric lighting without the computational expense of true volumetric rendering:
        </p>
        
        <MathFormula formula={"$glow(d) = e^{-d \\cdot k}$"} />
        
        <p className="mt-4">
          Where d is the distance to the surface and k is a constant (25 in our shader) that controls
          the intensity and falloff of the glow. This exponential function creates a strong glow
          near surfaces that quickly diminishes with distance.
        </p>
      </Section>
      
      <Section title="6. Optimizations">
        <p>
          Ray marching can be computationally expensive, especially for complex scenes.
          The shader implements several critical optimizations to maintain real-time performance:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>Maximum step count</strong> - Limiting to 90 iterations prevents infinite loops
            <CodeBlock code={`for (int i = 0; i < 90; i++) { ... }`}/>
            <p className="mt-2">
              This ensures the shader always terminates, even if a ray never hits a surface.
              The limit is carefully chosen to balance quality and performance.
            </p>
            <PreviewBlock
              fragmentShader={stepCountShader}
              vertexShader={vertexShader}
              note="Comparison of low step count (left) vs high step count (right). Notice the improved quality with more steps."
            />
          </li>
          
          <li>
            <strong>Minimum step size</strong> - Using a minimum step size of 0.01 avoids precision issues
            <CodeBlock code={`d = max(abs(d), 0.01); // Ensure we don't get too close`}/>
            <p className="mt-2">
              This prevents the ray from taking extremely small steps near surfaces, which could
              lead to numerical precision issues and excessive iteration counts.
            </p>
            <PreviewBlock
              fragmentShader={minStepSizeShader}
              vertexShader={vertexShader}
              note="Comparison without minimum step size (left) vs with minimum step size (right). Notice the improved stability with minimum step size."
            />
          </li>
          
          <li>
            <strong>Space repetition</strong> - Creating infinite patterns from finite calculations
            <CodeBlock code={`pos = mod(pos-2., 4.) - 2.; // Repeat the space`}/>
            <p className="mt-2">
              This is both a visual effect and a powerful optimization. Instead of modeling an
              infinite world, we model a small cell and repeat it infinitely, saving both
              modeling effort and computation time.
            </p>
            <PreviewBlock
              fragmentShader={spaceRepetitionShader}
              vertexShader={vertexShader}
              note="Comparison without space repetition (left) vs with space repetition (right). Notice how a single shape is repeated infinitely on the right."
            />
          </li>
          
          <li>
            <strong>Time variation in the loop</strong> - Creating depth effects efficiently
            <CodeBlock code={`gTime = uTime - float(i) * 0.008; // Time variation`}/>
            <p className="mt-2">
              By varying the time parameter based on the ray marching step, we create the illusion
              of depth variation without additional computation. This is a clever trick that
              adds visual complexity at almost no performance cost.
            </p>
            <PreviewBlock
              fragmentShader={timeVariationShader}
              vertexShader={vertexShader}
              note="Comparison without time variation (left) vs with time variation (right). Notice the enhanced depth perception on the right."
            />
          </li>
        </ul>
        
        <p className="mt-4">
          These optimizations work together to make real-time ray marching possible on consumer hardware.
          Without them, the shader would be too computationally intensive to run at interactive framerates.
          The balance between visual quality and performance is a key consideration in shader development.
        </p>
      </Section>
      
      <div className="mt-12 p-4 bg-blue-900 bg-opacity-20 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-2">Mathematical Foundation</h3>
        <p>
          The shader combines concepts from several mathematical fields to create its visual effects:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>Distance geometry</strong> (signed distance functions)
            <p className="mt-2">
              SDFs define shapes as mathematical functions that return the distance from any point to the surface.
              This allows for precise shape definition and efficient ray marching.
            </p>
            <MathFormula formula={"$f(p) = |p| - r$"} />
          </li>
          
          <li>
            <strong>Ray-surface intersection algorithms</strong>
            <p className="mt-2">
              The ray marching algorithm efficiently finds intersections between rays and surfaces
              defined by SDFs, enabling the rendering of complex 3D scenes.
            </p>
            <MathFormula formula={"$p(t) = o + t \\cdot d$"} />
          </li>
          
          <li>
            <strong>Modular arithmetic</strong> (for space repetition)
            <p className="mt-2">
              The modulo operation creates repeating patterns in space, allowing for infinite
              complexity with finite computation.
            </p>
            <MathFormula formula={"$mod(x, y) = x - y \\cdot floor(x/y)$"} />
          </li>
          
          <li>
            <strong>Interpolation theory</strong> (for smooth transitions)
            <p className="mt-2">
              Linear interpolation (mix) and cubic Hermite interpolation (smoothstep) enable
              smooth transitions between shapes and colors.
            </p>
            <MathFormula formula={"$mix(a, b, t) = a \\cdot (1-t) + b \\cdot t$"} />
          </li>
          
          <li>
            <strong>Trigonometric functions</strong> (for oscillations and rotations)
            <p className="mt-2">
              Sine and cosine functions create periodic motion, color cycling, and rotations,
              adding dynamic elements to the scene.
            </p>
            <MathFormula formula={"$R(\\theta) = \\begin{bmatrix} cos(\\theta) & -sin(\\theta) \\\\ sin(\\theta) & cos(\\theta) \\end{bmatrix}$"} />
          </li>
        </ul>
        
        <p className="mt-4">
          The beauty of this shader lies in how it combines these mathematical concepts into a cohesive whole.
          Each concept builds upon the others to create a complex, dynamic, and visually stunning result.
          Understanding these mathematical foundations is key to mastering shader development and creating
          your own unique visual effects.
        </p>
      </div>
    </div>
  );
};

export default HomeBackgroundExplanation;
