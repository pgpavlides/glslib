import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Library from './pages/Library';
import ShaderDetail from './pages/ShaderDetail';

// Layout component that conditionally renders the Navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const isShaderPage = location.pathname.startsWith('/shader/');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!isShaderPage && <Navbar />}
      <main className={isShaderPage ? "" : "pt-4"}>
        {children}
      </main>
    </div>
  );
};

// App component with routes
const AppRoutes = () => {
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
