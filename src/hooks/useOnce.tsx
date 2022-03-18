import { useState } from "react";

/**
 * This executes BEFORE a component is mounted and rendered,
 * as opposed to useEffect(()=>, []).
 * Could be thought as a useConstrutor
 **/

export default function useOnce(callBack: () => void) {
    const [called, setCalled] = useState(false);
    if (!called) {
        setCalled(true);
        callBack();
    }
};
