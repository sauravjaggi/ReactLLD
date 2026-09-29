import { useEffect, useRef, useState } from "react";

export const useThrottle = <T,>(value: T, delay: number) => {
  const [throttleValue, setThrottleValue] = useState(value);
  const lastExec = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const remaining = delay - (now - lastExec.current);
    if (remaining <= 0) {
      setThrottleValue(value);
      lastExec.current = now;
      return;
    }

    const timeOutId = setTimeout(() => {
      setThrottleValue(value);
      lastExec.current = now;
    }, remaining);
    return () => clearTimeout(timeOutId);
  }, [value, delay]);

  return throttleValue;
};
