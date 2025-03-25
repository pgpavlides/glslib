import { downloadTextFile, downloadZip } from './fileUtils';
import {
  generateShaderHTML,
  generateReactJSX,
  generateJavaScript,
  generateAngular,
  generateVue,
  generateNextJS,
  generateNextJSRenderer
} from './exportFormats';

/**
 * Downloads the shader according to the specified format
 * @param {string} fragmentShader - GLSL fragment shader code
 * @param {string} vertexShader - GLSL vertex shader code
 * @param {string} title - Title for the shader
 * @param {string} format - Export format (html, react, js, angular, vue, next)
 */
export const downloadShader = (fragmentShader, vertexShader, title, format = 'html') => {
  const formatName = title.toLowerCase().replace(/\\s+/g, '-');
  
  switch (format) {
    case 'html':
      const htmlContent = generateShaderHTML(fragmentShader, vertexShader, title);
      downloadTextFile(htmlContent, `${formatName}.html`, 'text/html');
      break;
      
    case 'react':
      const reactContent = generateReactJSX(fragmentShader, vertexShader, title);
      downloadTextFile(reactContent, `${formatName}.jsx`, 'text/plain');
      break;
      
    case 'js':
      const jsContent = generateJavaScript(fragmentShader, vertexShader, title);
      downloadTextFile(jsContent, `${formatName}.js`, 'text/plain');
      break;
      
    case 'angular':
      const angularCode = generateAngular(fragmentShader, vertexShader, title);
      
      // Create a zip with all Angular component files
      downloadZip({
        [`${formatName}.component.ts`]: angularCode.ts,
        [`${formatName}.component.html`]: angularCode.html,
        [`${formatName}.component.css`]: angularCode.css
      }, `${formatName}-angular.zip`);
      break;
      
    case 'vue':
      const vueContent = generateVue(fragmentShader, vertexShader, title);
      downloadTextFile(vueContent, `${formatName}.vue`, 'text/plain');
      break;
      
    case 'next':
      const nextContent = generateNextJS(fragmentShader, vertexShader, title);
      const rendererContent = generateNextJSRenderer(fragmentShader, vertexShader, title);
      
      // Create a zip with both Next.js component files
      downloadZip({
        [`${formatName}.jsx`]: nextContent,
        [`${formatName}-renderer.jsx`]: rendererContent
      }, `${formatName}-nextjs.zip`);
      break;
      
    default:
      // Default to HTML format
      const defaultContent = generateShaderHTML(fragmentShader, vertexShader, title);
      downloadTextFile(defaultContent, `${formatName}.html`, 'text/html');
  }
};

/**
 * @deprecated Use downloadShader instead
 */
export const downloadShaderAsHTML = (fragmentShader, vertexShader, title) => {
  downloadShader(fragmentShader, vertexShader, title, 'html');
};
