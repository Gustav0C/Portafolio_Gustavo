"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import styles from "./ThemeToggle.module.css";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "dark";

    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "dark" || saved === "light") return saved;

    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

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
