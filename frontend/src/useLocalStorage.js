import React, { useEffect, useState } from 'react'

export default function useLocalStorage(key, firstValue = null) {
    const initialState = localStorage.getItem(key) || firstValue

    const [item, setitem] = useState(initialState)

    useEffect(function setKeyInLocalStorage() {

        if (item === null) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, item);
        }
    }, [key, item]);

    return item

}
