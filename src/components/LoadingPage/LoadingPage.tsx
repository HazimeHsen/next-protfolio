import React from "react";
import "@/styles/LoadingPage.css";

const LoadingPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="loader" />
    </div>
  );
};

export default LoadingPage;

// import React from "react";
// import LoadingPage from "@/components/LoadingPage/LoadingPage";

// const Loading = () => {
//   return <LoadingPage />;
// };

// export default Loading;
