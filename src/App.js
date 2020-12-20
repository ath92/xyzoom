import { useState, useCallback, useEffect, useMemo } from "react";

import './App.css';

function App() {
  const [isPanning, setIsPanning] = useState(false);
  const [pan, setPan] = useState([0, 0]);
  
  const onMouseDown = useCallback(e => {
    setIsPanning(true);
  }, []);

  const onMouseUp = useCallback(e => {
    setIsPanning(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    }
  }, [onMouseUp, onMouseDown]);

  useEffect(() => {
    if (!isPanning) return () => {};
    let prevScreenX;
    let prevScreenY;
    let newX;
    let newY;
    const onMouseMove = e => {
      prevScreenX = prevScreenX ?? e.screenX;
      prevScreenY = prevScreenY ?? e.screenY;
      const difX = e.screenX - prevScreenX;
      const difY = e.screenY - prevScreenY;
      setPan(prevPan => {
        newX = (newX ?? prevPan[0]) + difX;
        newY = (newY ?? prevPan[1]) + difY;
        return [newX, newY];
      })
      prevScreenX = e.screenX;
      prevScreenY = e.screenY;
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isPanning]);

  const containerStyle = useMemo(() => {
    return {
      transform: `translate3d(${pan[0]}px, ${pan[1]}px, 0)`,
    };
  }, [pan]);

  return (
    <div
      className="container"
      style={containerStyle}
    >
      hallo
      <div className="first">
        <h2>This is some context</h2>
      </div>
      <div className="second">
        <h1>This is different stuff</h1>
        <p>This is some context</p>
      </div>
    </div>
  );
}

export default App;
