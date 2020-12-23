import { useRef, useContext, useMemo, useLayoutEffect } from "react";
import TransformContext from "../contexts/TransformContext";
import VisibilityContext from "../contexts/VisibilityContext";

const Node = ({
    children,
    x,
    y,
    width,
    height,
    ...props
}) => {
    const parentTransform = useContext(TransformContext);

    const transform = useMemo(() => {
        return {
            x: parentTransform.x + x,
            y: parentTransform.y + y,
        };
    }, [x, y, parentTransform]);

    const { visibleItems, tree } = useContext(VisibilityContext);

    const bBox = useMemo(() => {
        return {
            minX: transform.x,
            minY: transform.y,
            maxX: transform.x + width,
            maxY: transform.y + height,
        };
    }, [transform, x, y, width, height]);

    useLayoutEffect(() => {
        if (!bBox) return;
        tree.insert(bBox);
        console.log("inserting")
        return () => tree.remove(bBox);
    }, [bBox, tree]);

    const isVisible = useMemo(() => visibleItems.has(bBox), [visibleItems]);

    return useMemo(() => {
        if (!isVisible) return null;

        const style = {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
            width,
            height,
            position: "absolute",
            overflow: "hidden",
        };
    
        return (
            <TransformContext.Provider value={transform}>
                <div {...props} style={style}>
                    {children}
                </div>
            </TransformContext.Provider>
        );
    }, [isVisible, transform, x, y, width, height]);
};

export default Node;
