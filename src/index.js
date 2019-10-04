import React, { useState } from "react"
import ReactDOM from "react-dom"

import BackgroundImage from "./components/background-image"

import "./styles.css"

function App() {
  const [src, setSrc] = useState("https://source.unsplash.com/featured/?skate")
  
  const refresh = () => {
    // reset `src` to trig css event `transition` exit
    setSrc("")
    // we deliberately delay loading the new image so that our beautiful spinner is visible :)
    setTimeout(
      () =>
        setSrc(
          `https://source.unsplash.com/featured/?skate&ts=${new Date().getTime()}`
        ),
      600
    )
  }

  return (
    <div className="App">
      <BackgroundImage
        src={src}
        opacity={.6}
        color="#56cdad"
        width="100%"
        height="100vh"
        // onClick={refresh}
      >
        {/*<div className="card"><h2>Your content here</h2></div>*/}
      </BackgroundImage>
      <div className="menu">
        <button onClick={refresh}>refresh</button>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)
