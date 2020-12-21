import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import './App.css';
import Measured from "./components/Measured";

const onResize = box => console.log(box);

function App({
  zoomSensitivity = 0.001,
}) {
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState([0, 0]);
  const [zoom, setZoom] = useState(1);
  const mousePosition = useRef([0, 0]);
  
  const onMouseDown = useCallback(e => {
    setIsPanning(true);
  }, []);

  const onMouseUp = useCallback(e => {
    setIsPanning(false);
  }, []);

  const onScroll = useCallback(e => {
    setZoom(prevZoom => Math.max(prevZoom + e.deltaY * zoomSensitivity, .05));
  }, [zoomSensitivity]);

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onScroll);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    }
  }, [onMouseUp, onMouseDown, onScroll]);

  useEffect(() => {
    let newX;
    let newY;
    const onMouseMove = e => {
      if (isPanning) {
        const difX = e.clientX - mousePosition.current[0];
        const difY = e.clientY - mousePosition.current[1];
        setPan(prevPan => {
          newX = (newX ?? prevPan[0]) + difX * zoom;
          newY = (newY ?? prevPan[1]) + difY * zoom;
          return [newX, newY];
        });
      }
      mousePosition.current = [e.clientX, e.clientY];
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isPanning, zoom]);

  const panContainerStyle = useMemo(() => {
    return {
      transform: `translate3d(${pan[0]}px, ${pan[1]}px, 0)`,
    };
  }, [pan]);

  const zoomContainerStyle = useMemo(() => {
    return {
      transform: `scale(${1/zoom})`,
    };
  }, [zoom]);

  return (
    <div style={zoomContainerStyle}>
      <div
        className="pan-container"
        style={panContainerStyle}
      >
        hallo
        <div className="first">
          <h2>This is some context</h2>
        </div>
        <Measured onMeasure={onResize} className="second">
          <h1>This is different stuff</h1>
          <p>This is some context</p>
        </Measured>
    </div>
    </div>
  );
}

export default App;
