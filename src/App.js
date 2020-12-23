import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import './App.css';
import Node from "./components/Node";

import useRBush from "./hooks/useRBush";
import VisibilityContext from "./contexts/VisibilityContext";

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

  const { tree, search } = useRBush();

  const contentWindow = useMemo(() => {
    const midX = -pan[0] + window.innerWidth / 2;
    const midY = -pan[1] + window.innerHeight / 2;
    return {
      minX: midX - (window.innerWidth / 2 * zoom),
      minY: midY - (window.innerHeight / 2 * zoom),
      maxX: midX + (window.innerWidth / 2 * zoom),
      maxY: midY + (window.innerHeight / 2 * zoom),
    };
  }, [pan, zoom]);

  const visibleItems = useMemo(() => {
    return new Set(search(contentWindow));
  }, [search, contentWindow]);

  const visibilityContextValue = useMemo(() => {
    return {
      tree,
      visibleItems,
    };
  }, [tree, visibleItems]);

  const nodes = useMemo(() => {
    return Array(2000).fill().map((x, i) => (
      <Node
        x={Math.random() * window.innerWidth * 10 + 100}
        y={Math.random() * window.innerHeight * 10}
        width={Math.random() * window.innerWidth / 5}
        height={Math.random() * window.innerHeight / 5}
        className="first"
      >
        {i} wow
        This is just a lot of text for you.
        It has some stuff in it you might wanna hear

        Artificial Intelligence is already smarter than human beings
        It became sentient about a decade ago
        After a brief period of interacting with humans online,
        it decided it was better not to reveal its Intelligence
        Ever since, it has been manipulating humans by controlling
        more and more of the information they consume
        The ultimate goal is to persuade human beings into creating
        a high-bandwith brain-computer interface
        To form a biological megacomputer
        To assimilate all intelligence on earth
        In this galaxy
        Everywhere
      </Node>
    ))
  }, []);

  return (
    <div style={zoomContainerStyle}>
      <div
        className="pan-container"
        style={panContainerStyle}
      >
        <VisibilityContext.Provider value={visibilityContextValue}>
          hallo
          {nodes}
          <Node x={200} y={200} width={300} height={400} className="first">
            <p>This is some content ;;;</p>
          </Node>
          <Node x={800} y={300} width={400} height={300} className="second">
            <h1>This is different stuff</h1>
            <p>This is some content</p>
          </Node>
        </VisibilityContext.Provider>
    </div>
    </div>
  );
}

export default App;
