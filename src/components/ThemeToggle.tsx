"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button className={styles.toggle} aria-label="Toggle theme">
        <span className={styles.track}>
          <span className={styles.thumb} />
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
      title={`Cambiar a modo ${theme === "dark" ? "claro" : "oscuro"}`}
    >
      <span className={styles.iconWrapper}>
        {theme === "dark" ? (
          <Moon className={styles.icon} size={18} />
        ) : (
          <Sun className={styles.icon} size={18} />
        )}
      </span>
      <span className={styles.track}>
        <span className={`${styles.thumb} ${theme === "light" ? styles.thumbLight : ""}`} />
      </span>
    </button>
  );
}