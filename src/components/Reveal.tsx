"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Reveal.module.css";

export default function Reveal({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
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

	useEffect(() => {
		const el = ref.current;
		if (!el || !mounted) return;

		// If reduced motion, show immediately
		if (reducedMotion) {
			el.classList.add(styles.visible);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					el.classList.add(styles.visible);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [reducedMotion, mounted]);

	return (
		<div ref={ref} className={`${styles.reveal} ${className}`}>
			{children}
		</div>
	);
}
