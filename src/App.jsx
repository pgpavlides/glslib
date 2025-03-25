import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideNav from './components/SideNav';
import Home from './pages/Home';
import Library from './pages/Library';
import ShaderDetail from './pages/ShaderDetail';
import { useStore } from './store';

// Layout component that includes the SideNav
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SideNav />
      <main className="pl-[72px]"> {/* Add padding to account for sidebar width */}
        {children}
      </main>
    </div>
  );
};

// App component with routes
const AppRoutes = () => {
  const { initializeShaders } = useStore();
  
  // Initialize shaders when component mounts
  useEffect(() => {
    initializeShaders();
  }, [initializeShaders]);
  
  return (
    <Routes>
      <Route path="/" element={
        <Layout>
          <Home />
        </Layout>
      } />
      <Route path="/library" element={
        <Layout>
          <Library />
        </Layout>
      } />
      <Route path="/shader/:id" element={
        <Layout>
          <ShaderDetail />
        </Layout>
      } />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
