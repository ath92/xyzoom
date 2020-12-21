import { useRef, useCallback } from "react";
import useResizeObserver from "../hooks/useResizeObserver";

export default ({
    children,
    onMeasure,
    ...props
}) => {
    const wrapper = useRef(null);
    useResizeObserver(wrapper, onMeasure);
    return (
        <div ref={wrapper} {...props}>
            {children}
        </div>
    );
}