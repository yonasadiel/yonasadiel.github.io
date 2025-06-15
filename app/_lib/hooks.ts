import { useEffect, useState } from 'react'

export const useDelayed = <T>(factory: () => Promise<T>, initial: T, deps?: unknown[]) => {
    const [val, setVal] = useState<T>(initial)
    useEffect(() => { factory().then((newVal) => setVal(newVal)) }, deps)
    return val
}
