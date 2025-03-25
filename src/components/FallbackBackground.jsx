import React, { useEffect } from 'react';

const FallbackBackground = () => {
  // Add animation styles to head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes moveBackground {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 100px 100px;
        }
      }
      
      @keyframes pulseGlow {
        0%, 100% {
          opacity: 0.4;
        }
        50% {
          opacity: 0.7;
        }
      }
      
      .animated-gradient {
        animation: moveBackground 40s linear infinite;
      }
      
      .animated-glow {
        animation: pulseGlow 8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  return (
    <div 
      className="absolute inset-0 -z-10 bg-gray-900 overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #0f2546 0%, #061023 100%)',
      }}
    >
      {/* Animated gradient dots - pure CSS fallback */}
      <div 
        className="absolute inset-0 animated-glow" 
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 30%, rgba(30, 90, 180, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 75% 70%, rgba(20, 60, 120, 0.25) 0%, transparent 50%)
          `,
          backgroundSize: '100% 100%',
          filter: 'blur(30px)',
          opacity: 0.7,
        }}
      ></div>
      
      {/* Moving overlay */}
      <div 
        className="absolute inset-0 animated-gradient" 
        style={{
          backgroundImage: 'linear-gradient(45deg, rgba(10, 30, 60, 0.2) 25%, transparent 25%, transparent 50%, rgba(10, 30, 60, 0.2) 50%, rgba(10, 30, 60, 0.2) 75%, transparent 75%, transparent)',
          backgroundSize: '100px 100px',
          opacity: 0.3,
        }}
      ></div>
    </div>
  );
};

export default FallbackBackground;
