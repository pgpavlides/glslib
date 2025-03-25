import { create } from 'zustand';

// Define shader metadata
const shaderData = [
  {
    id: 'ripple',
    name: 'Ripple Effect',
    description: 'A hypnotic ripple effect using sine waves',
    tags: ['waves', 'animation', 'blue']
  },
  {
    id: 'noise',
    name: 'Noise Generator',
    description: 'Procedural noise pattern with animated movement',
    tags: ['noise', 'procedural', 'animation']
  },
  {
    id: 'gradient',
    name: 'Animated Gradient',
    description: 'Smooth gradient transition with time-based animation',
    tags: ['gradient', 'animation', 'colors']
  },
];

// Create store
export const useStore = create((set) => ({
  // Shader collection
  shaders: shaderData,
  
  // Currently active shader
  activeShader: null,
  
  // Set active shader
  setActiveShader: (shaderId) => set({ 
    activeShader: shaderId 
  }),
  
  // Get shader by ID
  getShaderById: (id) => {
    const shader = shaderData.find(shader => shader.id === id);
    return shader || null;
  },
  
  // Filter shaders by tag
  filterShadersByTag: (tag) => {
    return shaderData.filter(shader => shader.tags.includes(tag));
  }
}));
