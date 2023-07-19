import { useState } from "react";

export const useLocalStorage = () => {
    const [value, setValue] = useState(null)

    const setItem = (key, value) => {
        window.localStorage.setItem(key, value)
        setValue(value)
    }
    
    const getItem = (key) =>{
        const value = window.localStorage.getItem(key)
        setValue(value)
        return value
    }

    const removeItem = (key) => {
        window.localStorage.removeItem(key)
        setValue(null)
    }

    return { value, setItem, getItem, removeItem}
}