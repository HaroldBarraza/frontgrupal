import { useState, useEffect } from "react";

export default function useDebounce<T>(valor: T, delay: number = 1000): T {
  const [debounced, setDebounced] = useState<T>(valor);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timer);
  }, [valor, delay]);
  return debounced;
}
