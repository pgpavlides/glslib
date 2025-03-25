import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaImages, FaCode, FaInfoCircle, FaDownload, FaBookOpen } from "react-icons/fa";
import { useStore } from "../store";

const SideNav = () => {
  const location = useLocation();
  const { shaders } = useStore();
  const [selected, setSelected] = useState(0);
  
  // Update selected based on current route
  useEffect(() => {
    if (location.pathname === "/") {
      setSelected(0);
    } else if (location.pathname === "/library") {
      setSelected(1);
    } else if (location.pathname.startsWith("/shader/")) {
      // Extract shader ID from URL
      const shaderId = location.pathname.split("/").pop();
      // Find the shader's index in the array + 2 (to account for Home and Library)
      const shaderIndex = shaders.findIndex(shader => shader.id === shaderId);
      if (shaderIndex !== -1) {
        setSelected(shaderIndex + 2);
      }
    }
  }, [location.pathname, shaders]);

  return (
    <nav className="h-screen w-fit bg-slate-950 p-4 flex flex-col items-center gap-2 fixed left-0 top-0 z-50">
      {/* Logo */}
      <Link to="/" className="mb-8 mt-2">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0ZM20 10C14.477 10 10 14.477 10 20C10 25.523 14.477 30 20 30C25.523 30 30 25.523 30 20C30 14.477 25.523 10 20 10Z"
            fill="#3B82F6"
          />
        </svg>
      </Link>
      
      {/* Navigation Icons */}
      <NavItem
        selected={selected === 0}
        id={0}
        setSelected={setSelected}
        to="/"
        tooltip="Home"
      >
        <FaHome />
      </NavItem>
      
      <NavItem
        selected={selected === 1}
        id={1}
        setSelected={setSelected}
        to="/library"
        tooltip="Shader Library"
      >
        <FaImages />
      </NavItem>

      {/* Divider */}
      <div className="w-8 h-px bg-slate-700 my-2"></div>

      {/* Dynamic shader links - shown when in a shader page */}
      {location.pathname.startsWith("/shader/") && (
        <>
          <NavItem
            selected={false}
            id={-1}
            onClick={() => {
              // Use the exposed window functions from ShaderDetail
              if (window.toggleShaderCode) {
                window.toggleShaderCode();
              }
            }}
            tooltip="View Code"
          >
            <FaCode />
          </NavItem>
          
          <NavItem
            selected={false}
            id={-1}
            onClick={() => {
              // Use the exposed window functions from ShaderDetail
              if (window.toggleShaderInfo) {
                window.toggleShaderInfo();
              }
            }}
            tooltip="Info"
          >
            <FaInfoCircle />
          </NavItem>

          <NavItem
            selected={false}
            id={-1}
            onClick={() => {
              // Use the exposed explanation toggle function from ShaderDetail
              if (window.toggleShaderExplanation) {
                window.toggleShaderExplanation();
              }
            }}
            tooltip="Explanation"
          >
            <FaBookOpen />
          </NavItem>

          <NavItem
            selected={false}
            id={-1}
            onClick={() => {
              // Use the exposed export function from ShaderDetail
              if (window.exportShader) {
                window.exportShader();
              }
            }}
            tooltip="Export HTML"
          >
            <FaDownload />
          </NavItem>
        </>
      )}
    </nav>
  );
};

const NavItem = ({ children, selected, id, setSelected, to, tooltip, onClick }) => {
  const content = (
    <motion.button
      className="p-3 text-xl bg-slate-800 hover:bg-slate-700 rounded-md transition-colors relative group"
      onClick={() => {
        if (onClick) {
          onClick();
        } else if (setSelected) {
          setSelected(id);
        }
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="block relative z-10">{children}</span>
      
      {/* Tooltip */}
      {tooltip && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {tooltip}
        </div>
      )}
      
      <AnimatePresence>
        {selected && (
          <motion.span
            className="absolute inset-0 rounded-md bg-blue-600 z-0"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          ></motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }
  
  return content;
};

export default SideNav;
