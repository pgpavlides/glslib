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
  const [isLoading, setIsLoading] = useState(true);
  
  // UI state
  const [showInfo, setShowInfo] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [activeTab, setActiveTab] = useState('fragment');
  const [copySuccess, setCopySuccess] = useState('');

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

  // Copy to clipboard function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setCopySuccess('Failed to copy');
      });
  };
  
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
      
      {/* Info panel */}
      {showInfo && (
        <div className="absolute bottom-6 right-6 z-10 transition-all duration-300 ease-in-out">
          <div className="bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-xs backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-2">{shader.name}</h3>
            <p className="text-sm text-gray-300">{shader.description}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {shader.tags.map(tag => (
                <span 
                  key={tag}
                  className="text-xs px-2 py-1 bg-blue-900 bg-opacity-50 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Code panel */}
      {showCode && (
        <div className="absolute inset-x-0 bottom-0 z-10 transition-all duration-300 ease-in-out bg-black bg-opacity-80 backdrop-blur-sm">
          <div className="container mx-auto p-4 max-h-[50vh] overflow-auto">
            {/* Tabs */}
            <div className="flex gap-4 mb-3">
              <button 
                className={`px-3 py-1 rounded-md ${activeTab === 'fragment' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('fragment')}
              >
                Fragment Shader
              </button>
              <button 
                className={`px-3 py-1 rounded-md ${activeTab === 'vertex' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setActiveTab('vertex')}
              >
                Vertex Shader
              </button>
              <div className="ml-auto">
                <button 
                  className="px-3 py-1 bg-blue-700 text-white rounded-md flex items-center"
                  onClick={() => copyToClipboard(activeTab === 'fragment' ? fragmentShader : vertexShader)}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  {copySuccess || 'Copy Code'}
                </button>
              </div>
            </div>
            
            {/* Code display */}
            <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-gray-300 font-mono text-sm">
              {activeTab === 'fragment' ? fragmentShader : vertexShader}
            </pre>
          </div>
        </div>
      )}
      
      {/* Control buttons */}
      <div className="absolute bottom-6 left-6 z-10 flex gap-2">
        {/* Info toggle button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center justify-center text-white bg-black bg-opacity-50 hover:bg-opacity-70 w-10 h-10 rounded-full transition-all"
          title="Toggle shader info"
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
        
        {/* Code toggle button */}
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center justify-center text-white bg-black bg-opacity-50 hover:bg-opacity-70 w-10 h-10 rounded-full transition-all"
          title="View shader code"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShaderDetail;
