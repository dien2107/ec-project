import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [valueDebounce, setValueDebounce] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setValueDebounce(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return valueDebounce;
}
