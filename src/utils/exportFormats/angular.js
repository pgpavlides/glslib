/**
 * Generates an Angular component for the shader
 * @param {string} fragmentShader - GLSL fragment shader code
 * @param {string} vertexShader - GLSL vertex shader code
 * @param {string} title - Title of the shader
 * @returns {object} Object containing component TS, HTML, and CSS
 */
export const generateAngular = (fragmentShader, vertexShader, title) => {
  const componentName = title.replace(/\s+/g, '-').toLowerCase();
  const className = title.replace(/\s+/g, '') + 'Component';
  
  const ts = `import { Component, ElementRef, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-${componentName}',
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.css']
})
export class ${className} implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private geometry: THREE.PlaneGeometry;
  private shaderMaterial: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private animationId: number;
  private uniforms: any;
  
  // Fragment Shader
  private fragmentShader = \`${fragmentShader}\`;
  
  // Vertex Shader
  private vertexShader = \`${vertexShader}\`;

  constructor() { }

  ngOnInit(): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    this.camera.position.z = 1;
  }
  
  ngAfterViewInit(): void {
    this.setupRenderer();
    this.setupShader();
    this.animate();
    window.addEventListener('resize', this.handleResize.bind(this));
  }
  
  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.handleResize.bind(this));
    this.geometry.dispose();
    this.shaderMaterial.dispose();
    this.renderer.dispose();
  }
  
  private setupRenderer(): void {
    const container = this.rendererContainer.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);
  }
  
  private setupShader(): void {
    const container = this.rendererContainer.nativeElement;
    
    this.uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
    };
    
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true
    });
    
    this.geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(this.geometry, this.shaderMaterial);
    this.scene.add(this.mesh);
  }
  
  private handleResize(): void {
    const container = this.rendererContainer.nativeElement;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight);
  }
  
  private animate(): void {
    this.uniforms.uTime.value += 0.01;
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }
}
`;

  const html = `<div #rendererContainer class="renderer-container"></div>
`;

  const css = `.renderer-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
`;

  return { ts, html, css };
};
