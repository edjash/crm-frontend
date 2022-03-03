import { useState } from "react";

/**
 * This is used as opposed to useEffect(() => {}, []),
 * as the latter triggers missing dependency linting errors.
 **/

export default function useOnce(callBack: () => void) {
    const [called, setCalled] = useState(false);
    if (!called) {
        setCalled(true);
        callBack();
    }
};
