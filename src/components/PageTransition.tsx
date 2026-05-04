"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import styles from "./PageTransition.module.css";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Simple fade-in only - no exit animation
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
