import React, { useState, useEffect, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import ShaderPreview from './ShaderPreview';

// Reusable UI components for shader explanations
export const Section = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="mb-8 border border-gray-700 rounded-lg overflow-hidden bg-gray-800 bg-opacity-50">
      <button
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-700 hover:bg-gray-600 transition-colors text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className="text-gray-300">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4"
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

export const CodeFormula = ({ children }) => (
  <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto font-mono text-sm text-blue-300 text-center">
    {children}
  </div>
);

export const InlineFormula = ({ children }) => (
  <code className="font-mono text-sm text-blue-300 mx-1">
    {children}
  </code>
);

export const PreviewBlock = ({ fragmentShader, vertexShader, note }) => (
  <div className="my-6 border border-blue-700 rounded-lg overflow-hidden">
    <div className="h-64 md:h-80">
      <ShaderPreview
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
      />
    </div>
    {note && (
      <div className="p-3 bg-blue-900 bg-opacity-50 text-sm text-gray-300">
        {note}
      </div>
    )}
  </div>
);

export const CodeBlock = ({ code }) => (
  <pre className="my-4 p-4 bg-gray-900 rounded-md overflow-x-auto font-mono text-sm text-gray-300">
    {code}
  </pre>
);

// Dynamic shader explanation component
const ShaderExplanation = ({ shaderId, fragmentShader, vertexShader }) => {
  const [ExplanationComponent, setExplanationComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadExplanation = async () => {
      try {
        // Try to dynamically import the explanation component
        const module = await import(/* @vite-ignore */ `../../shaders/${shaderId}/explanation`);
        setExplanationComponent(() => module.default);
        setLoading(false);
      } catch (error) {
        console.log(`No explanation found for shader: ${shaderId}`, error);
        setError(true);
        setLoading(false);
      }
    };

    loadExplanation();
  }, [shaderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-300">
        <div className="animate-spin mr-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        Loading explanation...
      </div>
    );
  }

  if (error || !ExplanationComponent) {
    return (
      <div className="p-8 text-center text-gray-300">
        <h2 className="text-2xl font-bold mb-4">No Explanation Available</h2>
        <p>This shader doesn't have a detailed explanation yet.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-4 text-gray-300">Loading explanation...</div>}>
      <ExplanationComponent fragmentShader={fragmentShader} vertexShader={vertexShader} />
    </Suspense>
  );
};

export default ShaderExplanation;
