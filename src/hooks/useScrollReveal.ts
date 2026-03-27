"use client";

import { useEffect, useRef } from "react";

/**
 * Observes all `.scroll-reveal` children in a container
 * and adds `.revealed` class when they enter the viewport.
 * Pass deps to re-observe after dynamic content loads.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any[] = []
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    container.querySelectorAll(".scroll-reveal:not(.revealed)").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
