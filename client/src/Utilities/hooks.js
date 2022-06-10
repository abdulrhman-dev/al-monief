

import { useRef } from 'react';

// ? https://stackoverflow.com/a/68682693

const BOUNCE_RATE = 2000;


export const useDebounce = () => {
    const busy = useRef(false);

    const debounce = async (callback) => {
        setTimeout(() => {
            busy.current = false;
        }, BOUNCE_RATE);

        if (!busy.current) {
            busy.current = true;
            callback();
        }
    };

    return { debounce };
};
