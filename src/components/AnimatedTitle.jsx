import React from 'react';
import { motion } from 'framer-motion';

const AnimatedTitle = ({ title, subtitle }) => {
  // Animation variants for the title
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      }
    }
  };

  // Animation variants for the subtitle
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  // Animation variants for each word
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  // Split title into words to avoid line break issues
  const titleWords = title.split(' ');

  return (
    <div className="text-center">
      <motion.h1 
        className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-white"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {titleWords.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block mx-1"
            style={{ 
              textShadow: "0 0 15px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3)"
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>
      
      <motion.p
        className="text-xl text-gray-300 mb-10"
        variants={subtitleVariants}
        initial="hidden"
        animate="visible"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default AnimatedTitle;
