"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./StatusSection.module.css";

const statusLines = [
	{ label: "Estado:", value: "Disponible para nuevos proyectos" },
	{ label: "Respuesta:", value: "< 24h" },
	{ label: "Email:", value: "gcanales58@gmail.com" },
] as const;

export default function StatusSection() {
	const [hasBeenVisible, setHasBeenVisible] = useState(false);
	const [typedText, setTypedText] = useState("");
	const [showContent, setShowContent] = useState(false);
	const [showCursor, setShowCursor] = useState(true);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [mounted, setMounted] = useState(false);
	const sectionRef = useRef<HTMLElement>(null);

	// Check for reduced motion preference - initialize on mount, then subscribe
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

	// IntersectionObserver — trigger animation once when section scrolls into view
	useEffect(() => {
		const el = sectionRef.current;
		if (!el || !mounted) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setHasBeenVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [mounted]);

	// Typewriter effect (skip if reduced motion)
	useEffect(() => {
		if (!hasBeenVisible || !mounted) return;

		if (reducedMotion) {
			return;
		}

		const command = "./status.sh";
		let index = 0;

		const interval = setInterval(() => {
			index++;
			setTypedText(command.slice(0, index));

			if (index >= command.length) {
				clearInterval(interval);
				setShowCursor(false);

				// Reveal content after typing finishes
				setTimeout(() => setShowContent(true), 400);
			}
		}, 45);

		return () => clearInterval(interval);
	}, [hasBeenVisible, reducedMotion, mounted]);

	// For reduced motion, show everything immediately
	const displayTypedText = reducedMotion ? "./status.sh" : typedText;
	const displayShowCursor = reducedMotion ? false : showCursor;
	const displayShowContent = reducedMotion ? true : showContent;

	// During SSR or before mount, render placeholder to avoid hydration mismatch
	if (!mounted) {
		return (
			<section ref={sectionRef} className={styles.section}>
				<div className={styles.commandLine}>
					<span className={styles.commandPlaceholder}>&nbsp;</span>
				</div>
				<div className={styles.content}>
					<div className={styles.statusBlock}>
						{statusLines.map((line) => (
							<div key={line.label} className={styles.statusLine}>
								<span className={styles.statusPrompt}>&gt;</span>
								<span className={styles.statusLabel}>{line.label}</span>
								{line.label === "Email:" ? (
									<a
										href={`mailto:${line.value}`}
										className={styles.statusLink}
									>
										{line.value}
									</a>
								) : (
									<span className={styles.statusValue}>{line.value}</span>
								)}
							</div>
						))}
					</div>
					<Link href="/contacto" className={styles.cta}>
						Contactar &rarr;
					</Link>
				</div>
			</section>
		);
	}

	return (
		<section ref={sectionRef} className={styles.section}>
			{/* Terminal command line */}
			<div className={styles.commandLine}>
				{hasBeenVisible ? (
					<>
						<span className={styles.commandPrompt}>$</span>
						{displayTypedText}
						{displayShowCursor && <span className={styles.cursor} />}
					</>
				) : (
					<span className={styles.commandPlaceholder}>&nbsp;</span>
				)}
			</div>

			{/* Status content */}
			<div
				className={`${styles.content} ${displayShowContent ? styles.contentVisible : ""}`}
			>
				<div className={styles.statusBlock}>
					{statusLines.map((line) => (
						<div key={line.label} className={styles.statusLine}>
							<span className={styles.statusPrompt}>&gt;</span>
							<span className={styles.statusLabel}>{line.label}</span>
							{line.label === "Email:" ? (
								<a
									href={`mailto:${line.value}`}
									className={styles.statusLink}
								>
									{line.value}
								</a>
							) : (
								<span className={styles.statusValue}>{line.value}</span>
							)}
						</div>
					))}
				</div>
				<Link href="/contacto" className={styles.cta}>
					Contactar &rarr;
				</Link>
			</div>
		</section>
	);
}
