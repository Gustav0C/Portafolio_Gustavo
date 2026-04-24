"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styles from "./PageTransition.module.css";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Skip animation on first render to avoid double animation
  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  // Simple fade-in only - no exit animation to avoid double effect
  return (
    <motion.div
      key={pathname}
      className={styles.container}
      initial={isFirstRender.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.08, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}