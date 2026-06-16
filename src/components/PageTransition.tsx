"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./PageTransition.module.css";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // After first render, enable animation for future route changes
  useEffect(() => {
    // Skip animation on the very first mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Animate on route changes
    setShouldAnimate(false);
    requestAnimationFrame(() => {
      setShouldAnimate(true);
    });
  }, [pathname]);

  // Respect reduced motion — show instantly if enabled
  if (reducedMotion) {
    return <div className={styles.container}>{children}</div>;
  }

  return (
    <div
      key={pathname}
      className={`${styles.container} ${shouldAnimate ? styles.fadeIn : ""}`}
    >
      {children}
    </div>
  );
}
