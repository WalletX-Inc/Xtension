import React from "react";

const Loader = () => (
  <div
    className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-700 bg-opacity-50 z-50 transition-opacity duration-[3000s] ease-in-out"
    style={{ backdropFilter: "blur(4px)" }}
  >
    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

export default Loader;
