"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Owns scroll position across route changes, because leaving it to the router
 * plus `scroll-behavior: smooth` produced two distinct bugs:
 *
 *   - Navigating from the bottom of a long page landed part-way down the new
 *     one. The browser clamps the old offset to the new document's maximum and
 *     applies that AFTER the router's reset, so a single scrollTo lost the
 *     race. Hence re-asserting on the next frame and once more after layout.
 *   - A cross-route hash link (/#pricing from /privacy) scrolled nowhere, so
 *     the target is resolved here by id instead of being left to the router.
 *
 * Back and forward are left alone: the browser's own restoration is what you
 * want there, and it already works.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const firstRender = useRef(true);
  const cameFromHistory = useRef(false);

  useEffect(() => {
    const onPopState = () => {
      cameFromHistory.current = true;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    // Don't fight the browser on the very first load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (cameFromHistory.current) {
      cameFromHistory.current = false;
      return;
    }

    const id = window.location.hash.slice(1);

    const apply = () => {
      if (id) {
        const target = document.getElementById(id);
        if (target) {
          // scroll-padding-top on <html> keeps this clear of the sticky header.
          target.scrollIntoView({ behavior: "instant", block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    apply();
    const frame = requestAnimationFrame(apply);
    const timer = setTimeout(apply, 120);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
