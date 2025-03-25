import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import ShaderCanvas from '../components/ShaderCanvas';

const ShaderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getShaderById } = useStore();
  const shader = getShaderById(id);
  
  const [fragmentShader, setFragmentShader] = useState('');
  const [vertexShader, setVertexShader] = useState('');
  const [showInfo, setShowInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-hide info after 5 seconds
  useEffect(() => {
    if (showInfo) {
      const timer = setTimeout(() => {
        setShowInfo(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showInfo]);

  // Load shader files
  useEffect(() => {
    const loadShaders = async () => {
      if (shader) {
        try {
          setIsLoading(true);
          
          // Load fragment shader
          const fragModule = await import(`../shaders/${id}/fragment.glsl`);
          setFragmentShader(fragModule.default);
          
          // Load vertex shader
          const vertModule = await import(`../shaders/${id}/vertex.glsl`);
          setVertexShader(vertModule.default);
          
          setIsLoading(false);
        } catch (error) {
          console.error('Error loading shaders:', error);
          setIsLoading(false);
        }
      }
    };
    
    loadShaders();
  }, [id, shader]);
  
  if (!shader) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-white mb-4">Shader not found</h2>
          <button 
            onClick={() => navigate('/library')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Fullscreen shader */}
      <div className="absolute inset-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-2xl">Loading shader...</div>
          </div>
        ) : (
          <ShaderCanvas
            fragmentShader={fragmentShader}
            vertexShader={vertexShader}
            isFullscreen={true}
            disableControls={true}
          />
        )}
      </div>
      
      {/* Back button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={() => navigate('/library')}
          className="flex items-center text-white bg-black bg-opacity-50 hover:bg-opacity-70 px-4 py-2 rounded-full transition-all"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
              clipRule="evenodd" 
            />
          </svg>
          Back
        </button>
      </div>
      
      {/* Info tooltip */}
      {showInfo && (
        <div className="absolute bottom-6 right-6 z-10">
          <div className="bg-black bg-opacity-50 text-white p-4 rounded-lg max-w-xs">
            <h3 className="text-lg font-semibold mb-2">{shader.name}</h3>
            <p className="text-sm text-gray-300">{shader.description}</p>
          </div>
        </div>
      )}
      
      {/* Toggle info button */}
      <div className="absolute bottom-6 left-6 z-10">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center justify-center text-white bg-black bg-opacity-50 hover:bg-opacity-70 w-10 h-10 rounded-full transition-all"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShaderDetail;
