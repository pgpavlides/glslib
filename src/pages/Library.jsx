import React, { useState, useEffect } from 'react';
import ShaderCard from '../components/ShaderCard';
import { useStore } from '../store';

const Library = () => {
  const { shaders } = useStore();
  const [selectedTag, setSelectedTag] = useState(null);
  const [filteredShaders, setFilteredShaders] = useState(shaders);
  const [shaderFiles, setShaderFiles] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Get all unique tags
  const allTags = [...new Set(shaders.flatMap(shader => shader.tags))];

  // Filter shaders when selectedTag changes
  useEffect(() => {
    if (selectedTag) {
      setFilteredShaders(shaders.filter(shader => 
        shader.tags.includes(selectedTag)
      ));
    } else {
      setFilteredShaders(shaders);
    }
  }, [selectedTag, shaders]);
  
  // Load all shader files
  useEffect(() => {
    const loadAllShaderFiles = async () => {
      setIsLoading(true);
      const files = {};
      
      try {
        for (const shader of shaders) {
          try {
            const fragmentModule = await import(`../shaders/${shader.id}/fragment.glsl`);
            const vertexModule = await import(`../shaders/${shader.id}/vertex.glsl`);
            
            files[shader.id] = {
              fragmentShader: fragmentModule.default,
              vertexShader: vertexModule.default
            };
          } catch (error) {
            console.error(`Error loading shader files for ${shader.id}:`, error);
            files[shader.id] = { fragmentShader: '', vertexShader: '' };
          }
        }
        
        setShaderFiles(files);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading shaders:', error);
        setIsLoading(false);
      }
    };
    
    loadAllShaderFiles();
  }, [shaders]);

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-8">
        <h1 className="text-3xl font-bold text-white mb-8">Shader Library</h1>
        
        {/* Tags filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTag === null ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
              }`}
              onClick={() => setSelectedTag(null)}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedTag === tag ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Shader grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-white text-xl">Loading shaders...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShaders.map(shader => (
              <ShaderCard
                key={shader.id}
                shader={shader}
                vertexShader={shaderFiles[shader.id]?.vertexShader || ''}
                fragmentShader={shaderFiles[shader.id]?.fragmentShader || ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
