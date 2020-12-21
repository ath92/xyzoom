import { useEffect } from "react";

const callbackMap = new Map();

const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
        const callback = callbackMap.get(entry.target);
        if (callback) callback(entry.contentRect);
    }
});

const useResizeObserver = (targetRef, callback) => {
    useEffect(() => {
        const el = targetRef.current;
        if (!el || !callback) return;
        callbackMap.set(el, callback);
        observer.observe(el);
        return () => {
            observer.unobserve(el);
            callbackMap.delete(el);
        };
    }, [callback, targetRef]);
};

export default useResizeObserver;
