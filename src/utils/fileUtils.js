/**
 * Triggers a download of a text file
 * @param {string} content - Content to download
 * @param {string} fileName - Filename for the download
 * @param {string} contentType - MIME type of the file
 */
export const downloadTextFile = (content, fileName, contentType = 'text/html') => {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  
  URL.revokeObjectURL(a.href);
};

/**
 * Creates and triggers download of a zip file containing multiple files
 * @param {Object} files - Object with filenames as keys and content as values
 * @param {string} zipName - Name of the zip file
 */
export const downloadZip = async (files, zipName) => {
  try {
    // Dynamically import JSZip (only when needed)
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Add each file to the zip
    Object.entries(files).forEach(([filename, content]) => {
      zip.file(filename, content);
    });
    
    // Generate the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    
    // Trigger download
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = zipName;
    a.click();
    
    URL.revokeObjectURL(a.href);
  } catch (error) {
    console.error('Error creating zip file:', error);
    // Fallback to downloading individual files
    Object.entries(files).forEach(([filename, content]) => {
      downloadTextFile(content, filename);
    });
  }
};
