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
const LavaLampExplanation = ({ fragmentShader, vertexShader }) => {
  // Simplified lava lamp shader with just a single blob
  const singleBlobShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

float sdSphere(vec3 p, float s) {
  return length(p) - s;
} 

float map(vec3 p) {
  // Just a single blob that moves
  float time = uTime * 0.5;
  return sdSphere(p + sin(time) * vec3(0.0, 0.8, 0.0), 0.5);
}

vec3 calcNormal(in vec3 p) {
  const float h = 1e-5;
  const vec2 k = vec2(1,-1);
  return normalize(
      k.xyy*map(p + k.xyy*h) + 
      k.yyx*map(p + k.yyx*h) + 
      k.yxy*map(p + k.yxy*h) + 
      k.xxx*map(p + k.xxx*h));
}

void main() {
  vec2 uv = vUv;
  vec3 rayOri = vec3((uv - 0.5) * vec2(uResolution.x/uResolution.y, 1.0) * 6.0, 3.0);
  vec3 rayDir = vec3(0.0, 0.0, -1.0);
  
  float depth = 0.0;
  vec3 p;
  
  for(int i = 0; i < 64; i++) {
    p = rayOri + rayDir * depth;
    float dist = map(p);
    depth += dist;
    if (dist < 1e-6) {
      break;
    }
  }
  
  depth = min(6.0, depth);
  vec3 n = calcNormal(p);
  float b = max(0.0, dot(n, vec3(0.577)));
  vec3 col = (0.5 + 0.5 * cos((b + uTime * 3.0) + uv.xyx * 2.0 + vec3(0,2,4))) * (0.85 + b * 0.35);
  col *= exp(-depth * 0.15);
  
  gl_FragColor = vec4(col, 1.0 - (depth - 0.5) / 2.0);
}`;

  // Shader with 2 blobs and smooth union
  const twoBlobsShader = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5*(d2-d1)/k, 0.0, 1.0);
  return mix(d2, d1, h) - k*h*(1.0-h);
}

float sdSphere(vec3 p, float s) {
  return length(p) - s;
} 

float map(vec3 p) {
  // Two blobs that merge
  float time1 = uTime * 0.5;
  float time2 = uTime * 0.7;
  float blob1 = sdSphere(p + sin(time1) * vec3(0.0, 0.8, 0.0), 0.5);
  float blob2 = sdSphere(p + sin(time2) * vec3(0.8, 0.0, 0.0), 0.4);
  
  return opSmoothUnion(blob1, blob2, 0.4);
}

vec3 calcNormal(in vec3 p) {
  const float h = 1e-5;
  const vec2 k = vec2(1,-1);
  return normalize(
      k.xyy*map(p + k.xyy*h) + 
      k.yyx*map(p + k.yyx*h) + 
      k.yxy*map(p + k.yxy*h) + 
      k.xxx*map(p + k.xxx*h));
}

void main() {
  vec2 uv = vUv;
  vec3 rayOri = vec3((uv - 0.5) * vec2(uResolution.x/uResolution.y, 1.0) * 6.0, 3.0);
  vec3 rayDir = vec3(0.0, 0.0, -1.0);
  
  float depth = 0.0;
  vec3 p;
  
  for(int i = 0; i < 64; i++) {
    p = rayOri + rayDir * depth;
    float dist = map(p);
    depth += dist;
    if (dist < 1e-6) {
      break;
    }
  }
  
  depth = min(6.0, depth);
  vec3 n = calcNormal(p);
  float b = max(0.0, dot(n, vec3(0.577)));
  vec3 col = (0.5 + 0.5 * cos((b + uTime * 3.0) + uv.xyx * 2.0 + vec3(0,2,4))) * (0.85 + b * 0.35);
  col *= exp(-depth * 0.15);
  
  gl_FragColor = vec4(col, 1.0 - (depth - 0.5) / 2.0);
}`;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 text-gray-300">
      <h1 className="text-3xl font-bold text-white mb-6">Lava Lamp Shader - Technical Explanation</h1>
      
      <p className="mb-6">
        This shader creates a mesmerizing lava lamp effect with colorful, blob-like shapes that
        merge, separate, and flow in a 3D space. The effect is achieved using ray marching and
        signed distance functions, with special attention to smooth blending between shapes.
      </p>

      <PreviewBlock 
        fragmentShader={fragmentShader} 
        vertexShader={vertexShader} 
        note="The complete Lava Lamp shader animation."
      />
      
      <Section title="1. Ray Marching Basics">
        <p>
          Like many advanced shaders, this lava lamp effect uses a technique called ray marching.
          For each pixel, we cast a ray into the scene and step along it until we hit a surface or
          reach a maximum number of steps.
        </p>
        
        <p className="mt-4">
          The core ray marching loop is:
        </p>
        
        <CodeBlock code={`float depth = 0.0;
vec3 p;

for(int i = 0; i < 64; i++) {
  p = rayOri + rayDir * depth;
  float dist = map(p);
  depth += dist;
  if (dist < 1e-6) {
    break;
  }
}`}/>
        
        <p className="mt-4">
          Where <code>rayOri</code> is the ray origin (camera position), <code>rayDir</code> is the ray direction,
          and <code>map(p)</code> is a function that returns the distance to the nearest surface at point p.
        </p>
        
        <PreviewBlock 
          fragmentShader={singleBlobShader} 
          vertexShader={vertexShader} 
          note="A simplified version with just a single moving blob."
        />
      </Section>
      
      <Section title="2. Smooth Blending Between Shapes">
        <p>
          The key to creating a convincing lava lamp effect is the smooth blending between shapes,
          implemented through a technique called "smooth minimum" or "smooth union."
        </p>
        
        <p className="mt-4">
          The smooth union operation is defined as:
        </p>
        
        <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto">
          <Latex>{"$opSmoothUnion(d1, d2, k) = mix(d2, d1, h) - k \\times h \\times (1.0 - h)$"}</Latex>
        </div>
        
        <p className="mt-4">
          Where <Latex>{"$h = clamp(0.5 + 0.5 \\times (d2 - d1) / k, 0.0, 1.0)$"}</Latex>
        </p>
        
        <p className="mt-4">
          This creates a smooth blend between two shapes, with parameter k controlling the smoothness
          of the transition. Larger values of k create more "blobby" connections.
        </p>
        
        <PreviewBlock 
          fragmentShader={twoBlobsShader} 
          vertexShader={vertexShader} 
          note="Two blobs with smooth union blending."
        />
      </Section>
      
      <Section title="3. Multiple Dynamic Blobs">
        <p>
          The full lava lamp effect uses 16 sphere primitives that move independently and blend together:
        </p>
        
        <CodeBlock code={`float map(vec3 p) {
  float d = 2.0;
  for (int i = 0; i < 16; i++) {
    float fi = float(i);
    float time = uTime * (fract(fi * 412.531 + 0.513) - 0.5) * 2.0;
    d = opSmoothUnion(
        sdSphere(p + sin(time + fi * vec3(52.5126, 64.62744, 632.25)) * vec3(2.0, 2.0, 0.8), 
                 mix(0.5, 1.0, fract(fi * 412.531 + 0.5124))),
        d,
        0.4
    );
  }
  return d;
}`}/>
        
        <p className="mt-4">
          Let's break down what's happening here:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>We start with a large initial distance <code>d = 2.0</code></li>
          <li>For each of the 16 iterations, we:
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Create a unique time offset using fractional parts of large numbers</li>
              <li>Generate a sphere that moves along a sine wave path</li>
              <li>Vary the size of each sphere slightly</li>
              <li>Combine each new sphere with the accumulated shape using the smooth union</li>
            </ul>
          </li>
        </ul>
        
        <p className="mt-4">
          The combination of many independently moving blobs creates the complex lava lamp behavior.
        </p>
      </Section>
      
      <Section title="4. Surface Normal Calculation">
        <p>
          To light the scene properly, we need to calculate the surface normal at each point.
          Since we're using SDFs without explicit geometry, we calculate the normal using the
          gradient of the distance field:
        </p>
        
        <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto">
          <Latex>{"$\\nabla f(p) = \\left( \\frac{\\partial f}{\\partial x}, \\frac{\\partial f}{\\partial y}, \\frac{\\partial f}{\\partial z} \\right)$"}</Latex>
        </div>
        
        <p className="mt-4">
          In code, this is implemented using finite differences:
        </p>
        
        <CodeBlock code={`vec3 calcNormal(in vec3 p) {
  const float h = 1e-5; // small step size
  const vec2 k = vec2(1,-1);
  return normalize( k.xyy*map(p + k.xyy*h) + 
                    k.yyx*map(p + k.yyx*h) + 
                    k.yxy*map(p + k.yxy*h) + 
                    k.xxx*map(p + k.xxx*h) );
}`}/>
      </Section>
      
      <Section title="5. Colorization and Lighting">
        <p>
          The colorful appearance comes from a combination of basic lighting and color cycling:
        </p>
        
        <CodeBlock code={`// Basic diffuse lighting
float b = max(0.0, dot(n, vec3(0.577)));

// Color cycling with cosine waves
vec3 col = (0.5 + 0.5 * cos((b + uTime * 3.0) + uv.xyx * 2.0 + vec3(0, 2, 4))) * (0.85 + b * 0.35);

// Depth attenuation
col *= exp(-depth * 0.15);`}/>
        
        <p className="mt-4">
          The <code>cos(...)</code> function with different phase offsets for R, G, and B creates
          the shifting rainbow-like colors, while the depth attenuation makes distant objects darker.
        </p>
      </Section>
      
      <Section title="6. Performance Considerations">
        <p>
          Ray marching can be computationally expensive, especially with multiple shapes.
          The shader includes several optimizations:
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Limited iteration count (64 steps maximum)</li>
          <li>Early termination when we hit a surface</li>
          <li>Maximum depth clamping (6.0 units)</li>
          <li>Using a minimum step threshold (1e-6) to avoid tiny increments</li>
        </ul>
      </Section>
      
      <div className="mt-12 p-4 bg-blue-900 bg-opacity-20 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-2">Mathematical Insights</h3>
        <p>
          The lava lamp effect relies on several key mathematical concepts:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>
            <strong>Smooth minimum function:</strong> Creating smooth transitions between shapes is critical
            for the fluid look. The polynomial smooth min function used here was developed by Inigo Quilez,
            a pioneer in shader graphics.
          </li>
          <li>
            <strong>Pseudo-random motion:</strong> Using large prime-like numbers and fractional parts
            creates motion that appears random but is still deterministic.
          </li>
          <li>
            <strong>Harmonic oscillation:</strong> The sine functions create natural-looking periodic motion
            with different frequencies for each blob.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LavaLampExplanation;
