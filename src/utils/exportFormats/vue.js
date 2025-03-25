/**
 * Generates a Vue component for the shader
 * @param {string} fragmentShader - GLSL fragment shader code
 * @param {string} vertexShader - GLSL vertex shader code
 * @param {string} title - Title of the shader
 * @returns {string} Vue component code
 */
export const generateVue = (fragmentShader, vertexShader, title) => {
  const componentName = title.replace(/\s+/g, '');
  
  return `<template>
  <div ref="rendererContainer" class="renderer-container"></div>
</template>

<script>
import * as THREE from 'three';

export default {
  name: '${componentName}',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      geometry: null,
      shaderMaterial: null,
      mesh: null,
      animationId: null,
      uniforms: null
    };
  },
  mounted() {
    this.initScene();
    this.setupShader();
    this.animate();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize);
    this.geometry.dispose();
    this.shaderMaterial.dispose();
    this.renderer.dispose();
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      this.camera.position.z = 1;
      
      const container = this.$refs.rendererContainer;
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },
    setupShader() {
      const container = this.$refs.rendererContainer;
      
      // Fragment Shader
      const fragmentShader = \`${fragmentShader}\`;
      
      // Vertex Shader
      const vertexShader = \`${vertexShader}\`;
      
      this.uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
      };
      
      this.shaderMaterial = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader,
        fragmentShader,
        transparent: true
      });
      
      this.geometry = new THREE.PlaneGeometry(2, 2);
      this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial);
      this.scene.add(this.mesh);
    },
    handleResize() {
      const container = this.$refs.rendererContainer;
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
    },
    animate() {
      this.uniforms.uTime.value += 0.01;
      this.renderer.render(this.scene, this.camera);
      this.animationId = requestAnimationFrame(this.animate);
    }
  }
};
</script>

<style scoped>
.renderer-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
`;
};
