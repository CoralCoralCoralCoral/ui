import { useEffect, useState } from "react"

export default function useDebounce<T>(value: T, delay: number) {
    const [debounced, setDebounced] = useState<T>(value)

    useEffect(() => {
        const to = setTimeout(() => {
            setDebounced(value)
        }, delay)

        return () => {
            clearTimeout(to)
        }
    }, [value, delay])

    return debounced
}
