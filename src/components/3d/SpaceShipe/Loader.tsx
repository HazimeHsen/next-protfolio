import React from "react";

interface LoaderProps {
  progress: number;
}

const Loader: React.FC<LoaderProps> = ({ progress }) => {
  return (
    <div className="w-64 h-4 bg-gray-300 relative">
      <div
        className="absolute top-0 left-0 h-full bg-blue-600"
        style={{ width: `${progress}%`, transition: "width 0.1s ease-out" }}
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white font-semibold">
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default Loader;
