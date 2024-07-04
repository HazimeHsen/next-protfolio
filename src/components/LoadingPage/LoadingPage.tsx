import React from "react";
import "@/styles/LoadingPage.css";
import HeroBg from "../HeroBg";

const LoadingPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="loader">
        <div data-glitch="Loading..." className="glitch">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
