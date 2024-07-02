import React from "react";
import "@/styles/LoadingPage.css";
import HeroBg from "../HeroBg";

const LoadingPage = () => {
  return (
    <div className="z-[1000]">
      <HeroBg
        className="absolute inset-0 z-50"
        quantity={160}
        ease={100}
        size={0.4}
        staticity={40}
        color={"#ffffff"}
      />
      <div data-js="astro" className="astronaut">
        <div className="head"></div>
        <div className="arm arm-left"></div>
        <div className="arm arm-right"></div>
        <div className="body">
          <div className="panel"></div>
        </div>
        <div className="leg leg-left"></div>
        <div className="leg leg-right"></div>
        <div className="schoolbag"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
