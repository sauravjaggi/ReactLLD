import { useRef } from "react";

export const useCache = <K, V>() => {
  const cache = useRef<Map<K, V>>(new Map());

  const set = (Key: K, Value: V) => {
    cache.current.set(Key, Value);
  };

  const get = (Key: K) => {
    return cache.current.get(Key);
  };

  const has = (Key: K) => {
    return cache.current.has(Key);
  };
  const remove = (Key: K) => {
    return cache.current.delete(Key);
  };

  const size = () => {
    return cache.current.size;
  };

  const clear = () => {
    return cache.current.clear();
  };

  return {
    set,
    get,
    has,
    remove,
    size,
    clear,
  };
};
