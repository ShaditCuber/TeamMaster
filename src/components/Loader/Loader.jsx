import { useEffect } from "react";
import "./styles.css";

const Loader = () => {
  return (
    <main className="grid place-items-center place-content-center h-screen ">
      <div className="cube">
        <div className="cube__face" id="cube__face--front">
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
        </div>

        <div className="cube__face" id="cube__face--back">
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
        </div>

        <div className="cube__face" id="cube__face--right">
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
        </div>

        <div className="cube__face" id="cube__face--left">
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
        </div>

        <div className="cube__face" id="cube__face--top">
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
        </div>

        <div className="cube__face" id="cube__face--bottom">
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
          <span className="faceBox"></span>
        </div>
      </div>
    </main>
  );
};

export default Loader;
