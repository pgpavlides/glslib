import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              GLSL Shader Collection
            </h1>
            <p className="text-xl text-gray-300 mb-10">
              Explore a collection of creative and interactive GLSL shader effects, 
              from simple patterns to complex simulations.
            </p>
            <Link
              to="/library"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-medium text-lg rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Explore Library
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-black bg-opacity-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Interactive</h3>
              <p className="text-gray-300">
                All shaders are fully interactive and respond to mouse movement and time.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Customizable</h3>
              <p className="text-gray-300">
                Explore the source code and tweak parameters to create your own variations.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-3">Performant</h3>
              <p className="text-gray-300">
                Built using modern WebGL techniques for smooth performance on all devices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
