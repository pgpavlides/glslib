/**
 * Generates vanilla JavaScript code for the shader
 * @param {string} fragmentShader - GLSL fragment shader code
 * @param {string} vertexShader - GLSL vertex shader code
 * @param {string} title - Title of the shader
 * @returns {string} JavaScript code
 */
export const generateJavaScript = (fragmentShader, vertexShader, title) => {
  return `// ${title} - Shader Implementation
// Requires Three.js: https://threejs.org/

// Initialize the shader when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initShader();
});

function initShader() {
  // Create container
  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100vh';
  container.style.overflow = 'hidden';
  document.body.appendChild(container);
  
  // Scene setup
  const scene = new THREE.Scene();
  
  // Camera setup - use orthographic camera for full-screen shader
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;
  
  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  
  // Fragment Shader
  const fragmentShader = \`${fragmentShader}\`;
  
  // Vertex Shader
  const vertexShader = \`${vertexShader}\`;
  
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
}
`;
};
