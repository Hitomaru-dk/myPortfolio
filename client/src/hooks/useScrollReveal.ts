import { useEffect, useRef, useState, type RefObject } from 'react';

interface ScrollRevealOptions {
  /** Intersection threshold (0-1). Default 0.15 */
  threshold?: number;
  /** Delay in ms before triggering the animation. Useful for staggering. */
  delay?: number;
  /** Only trigger once (default true) */
  once?: boolean;
  /** Root margin for early/late triggering */
  rootMargin?: string;
}

/**
 * Custom hook that uses Intersection Observer to reveal elements on scroll.
 * Returns a ref to attach to the element and a boolean `isVisible`.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.15, delay = 0, once = true, rootMargin = '0px 0px -40px 0px' } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            const timer = setTimeout(() => setIsVisible(true), delay);
            // Clean up timer if element leaves viewport before delay
            return () => clearTimeout(timer);
          } else {
            setIsVisible(true);
          }

          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [threshold, delay, once, rootMargin]);

  return [ref, isVisible];
}

/**
 * Hook that returns multiple refs for stagger-animating a list of items.
 * Each item gets a progressive delay.
 */
export function useStaggerReveal(
  count: number,
  baseDelay: number = 60,
  options: Omit<ScrollRevealOptions, 'delay'> = {}
) {
  const { threshold = 0.1, once = true, rootMargin = '0px 0px -20px 0px' } = options;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));

  useEffect(() => {
    setVisibleItems(new Array(count).fill(false));
  }, [count]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger each item
          for (let i = 0; i < count; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, i * baseDelay);
          }
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [count, baseDelay, threshold, once, rootMargin]);

  return { containerRef, visibleItems };
}
