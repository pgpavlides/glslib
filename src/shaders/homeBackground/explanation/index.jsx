import React, { useState } from 'react';
import Latex from 'react-latex';
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
        
        <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto">
          <Latex>{"$f(p) = |p| - r$"}</Latex>
        </div>
        
        <p>
          Where <Latex>{"$|p|$"}</Latex> is the length of the vector from the origin to point p.
          If the result is negative, the point is inside the sphere; if positive, it's outside.
        </p>
        
        <PreviewBlock 
          fragmentShader={basicShader} 
          vertexShader={vertexShader} 
          note="A simple shader showing oscillating colors - the foundation of our visual effect."
        />
      </Section>
      
      <Section title="2. Shape Definitions">
        <p>
          The shader defines several primitive shapes using signed distance functions:
        </p>
        
        <p className="mt-4">
          <strong>Sphere:</strong> The simplest SDF, as shown above.
        </p>
        
        <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto">
          <Latex>{"$sdSphere(p, r) = |p| - r$"}</Latex>
        </div>
        
        <p className="mt-4">
          <strong>Torus:</strong> A ring shape defined by two radii.
        </p>
        
        <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto">
          <Latex>{"$sdTorus(p, t) = ||(|p_{xz}| - t_x, p_y)|| - t_y$"}</Latex>
        </div>
        
        <p className="mt-4">
          <strong>Octahedron:</strong> A diamond-like shape with 8 faces.
        </p>
        
        <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto">
          <Latex>{"$sdOctahedron(p, s) = (|p_x| + |p_y| + |p_z| - s) \\times 0.57735027$"}</Latex>
        </div>
        
        <p className="mt-4">
          These shapes are combined and morphed over time to create the dynamic animation.
        </p>
      </Section>
      
      <Section title="3. Shape Morphing">
        <p>
          One of the key aspects of this shader is the smooth morphing between different shapes.
          This is achieved using GLSL's mix function, which performs linear interpolation:
        </p>
        
        <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto">
          <Latex>{"$mix(a, b, t) = a \\times (1 - t) + b \\times t$"}</Latex>
        </div>
        
        <p>
          For smoother transitions, we use smoothstep for the interpolation factor:
        </p>
        
        <CodeBlock code={`float shape = mix(
    mix(sphere, torus, smoothstep(0.0, 1.0, sin(morphFactor) * 0.5 + 0.5)),
    octahedron,
    smoothstep(0.0, 1.0, cos(morphFactor) * 0.5 + 0.5)
);`}/>
      </Section>
      
      <Section title="4. Ray Marching Algorithm">
        <p>
          Ray marching is a rendering technique where we cast rays from the camera and step along them
          iteratively until we hit a surface or reach a maximum number of steps.
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
          This technique allows rendering complex scenes without traditional polygon meshes.
        </p>
      </Section>
      
      <Section title="5. Visual Effects">
        <p>
          The shader employs several techniques for visual enhancement:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Space folding</strong> - The mod() operation creates an infinite repeating pattern</li>
          <li><strong>Glow effect</strong> - Accumulation of values during ray marching creates the glow</li>
          <li><strong>Color variation</strong> - Sine and cosine functions create gradual color variations</li>
          <li><strong>Camera movement</strong> - Gentle camera motion keeps the scene dynamic</li>
        </ul>
        
        <p className="mt-4">
          The combination of these techniques creates the fluid, ethereal visual effect.
        </p>
      </Section>
      
      <Section title="6. Optimizations">
        <p>
          Several optimizations improve performance:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Using a maximum step count (90) to avoid infinite loops</li>
          <li>Using a minimum step size (0.01) to avoid tiny increments</li>
          <li>Space repetition to create infinite patterns from finite calculations</li>
          <li>Time offsets in the ray marching loop create depth variation without more computation</li>
        </ul>
      </Section>
      
      <div className="mt-12 p-4 bg-blue-900 bg-opacity-20 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-2">Mathematical Foundation</h3>
        <p>
          The shader combines concepts from several mathematical fields:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Distance geometry (signed distance functions)</li>
          <li>Ray-surface intersection algorithms</li>
          <li>Modular arithmetic (for space repetition)</li>
          <li>Interpolation theory (for smooth transitions)</li>
          <li>Trigonometric functions (for oscillations and rotations)</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeBackgroundExplanation;
