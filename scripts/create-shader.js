// Simple Node.js script to create a new shader
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shader template for vertex shader
const vertexShaderTemplate = `varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Shader template for fragment shader
const fragmentShaderTemplate = `uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 st = vUv;
  
  // Your shader code here
  vec3 color = vec3(st.x, st.y, abs(sin(uTime)));
  
  gl_FragColor = vec4(color, 1.0);
}
`;

// Get shader name from command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Please provide a shader name, e.g. "node scripts/create-shader.js myNewShader"');
  process.exit(1);
}

const shaderName = args[0];

// Create shader directory
const shadersDir = path.join(__dirname, '..', 'src', 'shaders');
const newShaderDir = path.join(shadersDir, shaderName);

try {
  // Check if directory already exists
  if (fs.existsSync(newShaderDir)) {
    console.error(`Shader "${shaderName}" already exists!`);
    process.exit(1);
  }
  
  // Create directory
  fs.mkdirSync(newShaderDir, { recursive: true });
  
  // Create vertex shader
  fs.writeFileSync(
    path.join(newShaderDir, 'vertex.glsl'),
    vertexShaderTemplate
  );
  
  // Create fragment shader
  fs.writeFileSync(
    path.join(newShaderDir, 'fragment.glsl'),
    fragmentShaderTemplate
  );
  
  console.log(`✅ Successfully created shader "${shaderName}"`);
  console.log(`📁 Location: ${newShaderDir}`);
  console.log('');
  console.log('To customize metadata for this shader, add an entry to shaderMetadata in src/store/index.js:');
  console.log(`
    ${shaderName}: {
      name: 'My New Shader',
      description: 'Description of your new shader',
      tags: ['creative', 'colorful', 'animation'] 
    }
  `);
  
} catch (error) {
  console.error('Error creating shader:', error);
  process.exit(1);
}
