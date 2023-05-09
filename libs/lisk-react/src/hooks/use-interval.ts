import { useEffect, useRef } from 'react';

type IntervalFunction = () => unknown | void;

export function useInterval(callback: IntervalFunction, delay: number | null) {
  const savedCallback = useRef<IntervalFunction | null>(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null) {
        savedCallback.current();
      }
    }
    if (delay) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    } else {
      return () => '';
    }
  }, [delay]);
}
