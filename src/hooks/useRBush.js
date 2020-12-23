import { useState, useCallback, useMemo } from "react";
import RBush from "rbush";

const rbush = new RBush();

const useRBush = () => {
    const [, setCount] = useState(0);

    const insert = useCallback((rectangle) => {
        rbush.insert(rectangle);
        setCount(old => ++old);
    }, []);

    const remove = useCallback((rectangle) => {
        rbush.remove(rectangle);
        setCount(old => ++old);
    }, []);

    const tree = useMemo(() => ({ insert, remove }), [insert, remove]);

    return {
        tree,
        search: rbush.search.bind(rbush),
    };
};

export default useRBush;
