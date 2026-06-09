"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./PageTransition.module.css";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // During SSR or before mount, render children without animation to avoid hydration mismatch
  if (!mounted) {
    return <div className={styles.container}>{children}</div>;
  }

  // Simple fade-in only - no exit animation
  // Respect reduced motion - show instantly if enabled
  if (reducedMotion) {
    return <div className={styles.container}>{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
