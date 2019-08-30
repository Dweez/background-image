import React, { useState, useEffect, useRef } from "react";

import "./background.css";
import "./spinner.css";

const BackgroundImage = props => {
  const {
    src,
    color,
    opacity,
    transition,
    width,
    height,
    radius,
    position
  } = props;
  const [loading, setLoading] = useState(true);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const ghost = useRef();
  const image = useRef();

  const [bgContainerStyle, setBgContainerStyle] = useState({
    position: position,
    width: width,
    height: height,
    backgroundColor: color,
    borderRadius: radius
  });
  const [bgStyle, setBgStyle] = useState({
    // background: `url(${src}) no-repeat center center fixed`,
    background: `url(${src}) no-repeat center center`,
    backgroundSize: "cover", // cover|auto|contain
    width: width,
    height: height,
    borderRadius: radius
  });

  useEffect(() => {
    setLoading(true);
    if (src) {
      ghost.current = new Image();
      ghost.current.src = src;
      ghost.current.onload = () => {
        if (width !== "100%" && (!height || height === "auto")) {
          const intWidth = parseInt(width.replace("px", ""), 10);
          const heightWRatio = parseInt(
            ghost.current.height / (ghost.current.width / intWidth),
            10
          );
          setDimension({ width: `${intWidth}px`, height: `${heightWRatio}px` });
        } else {
          setDimension({ width: width, height: height });
        }
        setBgStyle(prev => ({
          ...prev,
          background: `url(${src}) no-repeat center center`
        }));

        setLoading(false);
      };
    }
  }, [src, width, height]);

  useEffect(() => {
    image.current.style.opacity = 0;
    if (!loading) {
      if (width !== "100%") {
        setBgContainerStyle(prev => ({ ...prev, ...dimension }));
        setBgStyle(prev => ({ ...prev, ...dimension }));
      }
      image.current.style.transition = `opacity ${transition}`;
      image.current.style.opacity = opacity;
      image.current.style.backgroundSize = "cover"; // cover|auto|contain
    }
  }, [loading, transition, opacity, width, dimension]);

  return (
    <div className="bgContainer" style={bgContainerStyle}>
      <div ref={image} className="bg" style={bgStyle} />
      {loading && (
        <div className="spinner">
          <div className="bounce1" />
          <div className="bounce2" />
          <div className="bounce3" />
        </div>
      )}
      <div style={{ position: "relative" }}>{!loading && props.children}</div>
    </div>
  );
};

BackgroundImage.defaultProps = {
  src: "",
  position: "absolute",
  width: "100%",
  height: "100%",
  opacity: 1,
  color: "#ccc",
  transition: "1s",
  radius: 0
};

export default BackgroundImage;
