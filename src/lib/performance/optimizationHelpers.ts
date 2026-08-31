/**
 * Performance Optimization Helpers
 * Utilities for memoization, callback optimization, and render prevention
 */

import { useCallback, useMemo, useEffect, useRef, ReactNode, useState, RefObject } from "react";
import * as React from "react";

/**
 * Memoized button click handler (prevents re-creation on every render)
 * Use this for button callbacks in list items or frequently-rendering components
 */
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: any[]
): T => {
  return useCallback(callback, deps) as T;
};

/**
 * Memoized object selector (prevents unnecessary re-renders)
 * Use this to select specific properties from complex objects
 */
export const useMemoizedSelector = <T, R>(
  data: T,
  selector: (data: T) => R,
  deps?: any[]
): R => {
  return useMemo(() => selector(data), [data, ...(deps || [])]);
};

/**
 * Debounced callback (prevents excessive function calls)
 * Use this for resize events, scroll listeners, search input
 */
export const useDebouncedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: any[]
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    deps
  ) as T;
};

/**
 * Throttled callback (limits function calls frequency)
 * Use this for animation frames, scroll events, frequent updates
 */
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: any[]
): T => {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: any[]) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallRef.current;

      if (timeSinceLastCall >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay - timeSinceLastCall);
      }
    },
    deps
  ) as T;
};

/**
 * Lazy load component (defer non-critical component rendering)
 * Use this for modals, popovers, heavy components
 */
export const useLazyComponent = (
  shouldLoad: boolean,
  delay: number = 100
): boolean => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!shouldLoad) {
      setIsLoaded(false);
      return;
    }

    const timer = setTimeout(() => setIsLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [shouldLoad, delay]);

  return isLoaded;
};

/**
 * Intersection Observer hook (trigger actions when element enters viewport)
 * Use this for lazy loading images, infinite scroll, animation triggers
 */
export const useIntersectionObserver = (
  ref: RefObject<HTMLElement>,
  options?: IntersectionObserverInit
): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, options]);

  return isVisible;
};

/**
 * Request animation frame hook (batch updates to single frame)
 * Use this for smooth animations without blocking main thread
 */
export const useAnimationFrame = (
  callback: (deltaTime: number) => void,
  enabled: boolean = true
): void => {
  const animationIdRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;

    const animate = (currentTime: number) => {
      const deltaTime = lastTimeRef.current ? currentTime - lastTimeRef.current : 0;
      lastTimeRef.current = currentTime;

      callback(deltaTime);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [callback, enabled]);
};

/**
 * Batch state updates to prevent multiple re-renders
 * Use this when updating multiple state variables in sequence
 */
export const useBatchUpdates = <T extends Record<string, any>>(
  initialState: T
): [T, (updates: Partial<T>) => void] => {
  const [state, setState] = useState<T>(initialState);
  const batchUpdateRef = useRef<Partial<T>>({});
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const batchUpdate = useCallback((updates: Partial<T>) => {
    batchUpdateRef.current = { ...batchUpdateRef.current, ...updates };

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, ...batchUpdateRef.current }));
      batchUpdateRef.current = {};
    }, 0);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return [state, batchUpdate];
};

/**
 * Prevent layout thrashing (read-modify-write cycles)
 * Use this when reading and writing DOM properties
 */
export const useLayoutOptimization = (): {
  readDOM: (fn: () => void) => void;
  writeDOM: (fn: () => void) => void;
} => {
  const readQueueRef = useRef<(() => void)[]>([]);
  const writeQueueRef = useRef<(() => void)[]>([]);
  const measureIdRef = useRef<number | undefined>(undefined);

  const processQueues = () => {
    // Read phase
    readQueueRef.current.forEach((fn) => fn());
    readQueueRef.current = [];

    // Write phase
    measureIdRef.current = requestAnimationFrame(() => {
      writeQueueRef.current.forEach((fn) => fn());
      writeQueueRef.current = [];
    });
  };

  const readDOM = useCallback((fn: () => void) => {
    readQueueRef.current.push(fn);
    if (readQueueRef.current.length === 1) {
      processQueues();
    }
  }, []);

  const writeDOM = useCallback((fn: () => void) => {
    writeQueueRef.current.push(fn);
  }, []);

  useEffect(() => {
    return () => {
      if (measureIdRef.current) cancelAnimationFrame(measureIdRef.current);
    };
  }, []);

  return { readDOM, writeDOM };
};

/**
 * Lazy load image with blur placeholder
 * Use this for hero images, large images
 */
export const useLazyImage = (
  src: string,
  blurSrc?: string
): {
  isLoaded: boolean;
  imageSrc: string;
} => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true); // Still show placeholder on error
    img.src = src;
  }, [src]);

  return {
    isLoaded,
    imageSrc: isLoaded ? src : blurSrc || src,
  };
};

/**
 * Batch Supabase queries to reduce DB hits
 * Use this when loading multiple datasets
 */
export const useBatchSupabaseQuery = <T,>(
  queries: Array<{
    key: string;
    query: () => Promise<T>;
  }>,
  deps: any[] = []
): Record<string, T | null> => {
  const [results, setResults] = useState<Record<string, T | null>>(
    Object.fromEntries(queries.map((q) => [q.key, null]))
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const batchResults = await Promise.all(queries.map((q) => q.query()));
        const resultMap = Object.fromEntries(
          queries.map((q, i) => [q.key, batchResults[i]])
        );
        setResults(resultMap);
      } catch (error) {
        console.error("Batch query error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, deps);

  return results;
};

/**
 * Memoize expensive calculations
 * Use this for complex math, string processing, transformations
 */
export const useExpensiveCalculation = <T,>(
  fn: () => T,
  deps: any[]
): T => {
  return useMemo(() => fn(), deps);
};

/**
 * Detect if component is in focus (not background tab)
 * Use this to pause expensive operations when not visible
 */
export const usePageFocus = (): boolean => {
  const [isFocused, setIsFocused] = useState(true);

  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return isFocused;
};

/**
 * Memoize children to prevent re-rendering
 * Use this in container components with expensive children
 */
export const useMemoizedChildren = (
  children: ReactNode,
  deps: any[]
): ReactNode => {
  return useMemo(() => children, deps);
};
