import { create } from 'zustand';

// Function to capitalize first letter and add spaces between camelCase
const formatShaderName = (id) => {
  // Add space before capital letters and capitalize first letter
  return id
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim(); // Remove any extra spaces
};

// Default shader metadata to use when auto-detecting shaders
const createDefaultMetadata = (id) => {
  return {
    id,
    name: formatShaderName(id),
    description: `A shader effect using ${formatShaderName(id).toLowerCase()} technique`,
    tags: ['effect']
  };
};

// Create store
export const useStore = create((set, get) => ({
  // Shader collection - will be populated dynamically
  shaders: [],
  
  // Currently active shader
  activeShader: null,
  
  // Set active shader
  setActiveShader: (shaderId) => set({ 
    activeShader: shaderId 
  }),
  
  // Manual defined metadata for specific shaders (optional overrides)
  shaderMetadata: {
    ripple: {
      name: 'Ripple Effect',
      description: 'A hypnotic ripple effect using sine waves',
      tags: ['waves', 'animation', 'blue']
    },
    noise: {
      name: 'Noise Generator',
      description: 'Procedural noise pattern with animated movement',
      tags: ['noise', 'procedural', 'animation']
    },
    gradient: {
      name: 'Animated Gradient',
      description: 'Smooth gradient transition with time-based animation',
      tags: ['gradient', 'animation', 'colors']
    },
    darkWater: {
      name: 'Dark Water',
      description: 'Deep water turbulence effect with subtle movement',
      tags: ['water', 'dark', 'turbulence', 'animation']
    },
    homeBackground: {
      name: 'Fractal Shapes',
      description: 'Smooth gradient waves for UI backgrounds',
      tags: ['background', 'dark', 'gradients', 'waves']
    }
  },
  
  // Initialize shaders by scanning the shaders directory
  initializeShaders: async () => {
    try {
      // This uses Vite's import.meta.glob to scan for shader directories
      const shaderModules = import.meta.glob('../shaders/*/fragment.glsl');
      const shaderIds = Object.keys(shaderModules).map(path => {
        // Extract shader ID from path (e.g., '../shaders/ripple/fragment.glsl' -> 'ripple')
        const match = path.match(/\.\.\/shaders\/(.+)\/fragment\.glsl/);
        return match ? match[1] : null;
      }).filter(Boolean);
      
      // Create shader metadata
      const shaders = shaderIds.map(id => {
        const metadata = get().shaderMetadata[id] || {};
        return {
          id,
          name: metadata.name || formatShaderName(id),
          description: metadata.description || createDefaultMetadata(id).description,
          tags: metadata.tags || createDefaultMetadata(id).tags
        };
      });
      
      // Update state with found shaders
      set({ shaders });
      
      return shaders;
    } catch (error) {
      console.error('Error initializing shaders:', error);
      return [];
    }
  },
  
  // Get shader by ID
  getShaderById: (id) => {
    const { shaders, shaderMetadata } = get();
    
    // Try to find in already loaded shaders
    const existingShader = shaders.find(shader => shader.id === id);
    if (existingShader) return existingShader;
    
    // If not found but we have metadata, create a new shader object
    if (shaderMetadata[id]) {
      const metadata = shaderMetadata[id];
      return {
        id,
        name: metadata.name || formatShaderName(id),
        description: metadata.description || createDefaultMetadata(id).description,
        tags: metadata.tags || createDefaultMetadata(id).tags
      };
    }
    
    // If not found and no metadata, create default metadata
    return createDefaultMetadata(id);
  },
  
  // Filter shaders by tag
  filterShadersByTag: (tag) => {
    const { shaders } = get();
    return shaders.filter(shader => shader.tags.includes(tag));
  }
}));
