import { useState, useEffect } from "react";

export const useDebounce = <T,>(userInput: T, delay: number) => {
  const [debounceInput, setDebounceInput] = useState<T>(userInput);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceInput(userInput);
    }, delay);

    return () => clearTimeout(timer);
  }, [userInput, delay]);

  return debounceInput;
};
