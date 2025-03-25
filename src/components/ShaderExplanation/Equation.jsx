import React, { useEffect, useRef } from 'react';
import katex from 'katex';

// Renders inline equation
export const InlineEquation = ({ children }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        throwOnError: false,
        displayMode: false
      });
    }
  }, [children]);
  
  return <span ref={ref} className="mx-1" />;
};

// Renders block equation
export const BlockEquation = ({ children }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    if (ref.current) {
      katex.render(children, ref.current, {
        throwOnError: false,
        displayMode: true
      });
    }
  }, [children]);
  
  return (
    <div className="my-4 py-3 px-4 bg-gray-900 rounded-md overflow-x-auto">
      <div ref={ref} />
    </div>
  );
};
