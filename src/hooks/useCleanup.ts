import { useEffect, useRef } from 'react';

// Custom hook for cleanup management
export const useCleanup = (cleanupFn: () => void) => {
  const cleanupRef = useRef(cleanupFn);
  cleanupRef.current = cleanupFn;

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);
};

// Custom hook for debounced cleanup
export const useDebouncedCleanup = (cleanupFn: () => void, delay: number = 300) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupRef = useRef(cleanupFn);
  cleanupRef.current = cleanupFn;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      cleanupRef.current();
    };
  }, []);

  const debouncedCleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      cleanupRef.current();
    }, delay);
  };

  return debouncedCleanup;
};

// Custom hook for intersection observer cleanup
export const useIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(callback, options);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [callback, options]);

  return observerRef.current;
};
