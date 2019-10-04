import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"

import "./index.css"

import Spinner from "../spinner"

const BackgroundImage = props => {
  const {
    src,
    color,
    opacity,
    transition,
    width,
    height,
    radius,
    position,
    size,
    onClick
  } = props
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const ghost = useRef()
  const image = useRef()

  const [bgContainerStyle, setBgContainerStyle] = useState({
    position: position,
    width: width,
    height: height,
    backgroundColor: color,
    borderRadius: radius,
  })
  
  const [bgStyle, setBgStyle] = useState({
    // background: `url(${src}) no-repeat center center fixed`,
    background: `url(${src}) no-repeat center center`,
    backgroundSize: size, // cover|auto|contain
    width: width,
    height: height,
    borderRadius: radius,
    transition: `opacity ${transition}`,
  })
  
  const getCalculatedDimension = (width, height) => {
    // FIXME
    // à repenser complètement
    if (width !== "100%" && (!height || height === "auto")) {
      const intWidth = parseInt(width.replace("px", ""), 10)
      const heightWRatio = parseInt(
        ghost.current.height / (ghost.current.width / intWidth),
        10
      )
      return { width: `${intWidth}px`, height: `${heightWRatio}px` }
    } else {
      return { width: width, height: height }
      // return { width: ghost.current.width, height: ghost.current.height }
    }
  }

  useEffect(() => {
    setError(false)
    setLoading(true)
    if (src) {
      ghost.current = new Image()
      ghost.current.src = src
      ghost.current.onload = () => {
        setBgContainerStyle(prev => ({ ...prev, ...getCalculatedDimension(width, height) }))
        setBgStyle(prev => ({
          ...prev,
          ...getCalculatedDimension(width, height),
          background: `url(${src}) no-repeat center center`
        }))
        setLoading(false)
      };
      ghost.current.onerror = () => {
        setLoading(false)
        setBgStyle(prev => ({
          ...prev,
          background: ``
        }));
        setError("Image not found")
      };
    }
  }, [src, width, height])

  useEffect(() => {
    image.current.style.opacity = 0
    if (!loading) {
      // opacity et backgroundSize ne passent que par le biais de la ref, 
      // seulement une fois que l'image est réellement loadée
      image.current.style.opacity = opacity
      image.current.style.backgroundSize = size
    }
  }, [loading, size, opacity])

  return (
    <div className="bgContainer" style={bgContainerStyle} onClick={onClick}>
      <div ref={image} className="bg" style={bgStyle} />
      {loading && (
        <Spinner />
      )}
      <div style={{ position: "relative" }}>{(!loading && !error) && props.children}{error}</div>
    </div>
  )
}

BackgroundImage.propTypes = {
  src: PropTypes.string.isRequired,
  position: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  opacity: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  color: PropTypes.string,
  transition: PropTypes.string,
  radius: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func
}

BackgroundImage.defaultProps = {
  src: "",
  position: "relative",
  width: "300px",
  height: "300px",
  opacity: "1",
  color: "#ccc",
  transition: "1s",
  radius: "0",
  size: "cover",
  onClick: () => {}
}

export default BackgroundImage
