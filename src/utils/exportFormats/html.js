/**
 * Generates HTML code for a standalone shader canvas implementation
 * @param {string} fragmentShader - GLSL fragment shader code
 * @param {string} vertexShader - GLSL vertex shader code
 * @param {string} title - Title of the shader
 * @returns {string} Complete HTML document with embedded shader
 */
export const generateShaderHTML = (fragmentShader, vertexShader, title) => {
  // Create a complete HTML document with embedded shader code
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'GLSL Shader'}</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: #000;
    }
    canvas {
      display: block;
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <canvas id="shader-canvas"></canvas>

  <script type="module">
    // Import Three.js from CDN
    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.module.js';
    
    // Fragment Shader
    const fragmentShader = \`${fragmentShader}\`;
    
    // Vertex Shader
    const vertexShader = \`${vertexShader}\`;
    
    // Set up the scene
    const scene = new THREE.Scene();
    
    // Orthographic camera for fullscreen shader
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    // Renderer
    const canvas = document.getElementById('shader-canvas');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
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
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    });
    
    // Animation loop
    function animate() {
      uniforms.uTime.value += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    
    animate();
  </script>
</body>
</html>`;

  return htmlTemplate;
};
