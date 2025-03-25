import React, { useState } from 'react';
import { FaTimes, FaHtml5, FaReact, FaJs, FaAngular, FaVuejs } from 'react-icons/fa';
import { SiNextdotjs } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { downloadShader } from '../../utils/shaderExport';

const ExportOption = ({ icon, label, format, selectedFormat, setSelectedFormat }) => {
  const isSelected = selectedFormat === format;
  
  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 bg-blue-500 bg-opacity-10' 
          : 'border-gray-700 hover:border-blue-400 hover:bg-blue-500 hover:bg-opacity-5'
      }`}
      onClick={() => setSelectedFormat(format)}
    >
      <div className="flex flex-col items-center">
        <div className={`text-4xl mb-2`}>
          {icon}
        </div>
        <div className={isSelected ? 'text-blue-400' : 'text-gray-300'}>
          {label}
        </div>
      </div>
    </div>
  );
};

const ExportModal = ({ 
  isOpen, 
  onClose, 
  fragmentShader, 
  vertexShader, 
  shaderName,
  onExportSuccess
}) => {
  const [selectedFormat, setSelectedFormat] = useState('html');
  
  const handleExport = () => {
    // Export the shader in the selected format
    downloadShader(fragmentShader, vertexShader, shaderName, selectedFormat);
    onExportSuccess?.();
    onClose();
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal content */}
          <motion.div 
            className="relative z-10 bg-gray-900 rounded-lg shadow-xl w-full max-w-3xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Export Shader</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg text-white mb-2">Select Export Format</h3>
                <p className="text-gray-400 text-sm">
                  Choose the format that best fits your project needs. Some formats will download as a ZIP file with multiple files.
                </p>
              </div>
              
              {/* Export options grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ExportOption 
                  icon={<FaHtml5 className="text-orange-500" />}
                  label="HTML"
                  format="html"
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                />
                
                <ExportOption 
                  icon={<FaReact className="text-blue-400" />}
                  label="React"
                  format="react"
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                />
                
                <ExportOption 
                  icon={<FaJs className="text-yellow-400" />}
                  label="JavaScript"
                  format="js"
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                />
                
                <ExportOption 
                  icon={<FaAngular className="text-red-500" />}
                  label="Angular"
                  format="angular"
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                />
                
                <ExportOption 
                  icon={<FaVuejs className="text-green-500" />}
                  label="Vue"
                  format="vue"
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                />
                
                <ExportOption 
                  icon={<SiNextdotjs />}
                  label="Next.js"
                  format="next"
                  selectedFormat={selectedFormat}
                  setSelectedFormat={setSelectedFormat}
                />
              </div>
              
              {/* Selected format description */}
              <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
                <h4 className="text-white font-medium mb-2">
                  {selectedFormat === 'html' && 'HTML with Three.js'}
                  {selectedFormat === 'react' && 'React Component'}
                  {selectedFormat === 'js' && 'Vanilla JavaScript'}
                  {selectedFormat === 'angular' && 'Angular Component'}
                  {selectedFormat === 'vue' && 'Vue Single-File Component'}
                  {selectedFormat === 'next' && 'Next.js Components'}
                </h4>
                <p className="text-gray-400 text-sm">
                  {selectedFormat === 'html' && 'Standalone HTML file that works in any modern browser. Imports Three.js from CDN.'}
                  {selectedFormat === 'react' && 'React component that can be imported into your React application. Requires Three.js to be installed.'}
                  {selectedFormat === 'js' && 'Vanilla JavaScript code that can be included in any web project. Requires Three.js to be included in your page.'}
                  {selectedFormat === 'angular' && 'Angular component files (TS, HTML, CSS) delivered as a ZIP archive. Requires Three.js to be installed.'}
                  {selectedFormat === 'vue' && 'Vue single-file component that can be imported into your Vue application. Requires Three.js to be installed.'}
                  {selectedFormat === 'next' && 'Client-side Next.js components delivered as a ZIP archive. Requires Three.js to be installed.'}
                </p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-800">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleExport}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Export
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExportModal;
