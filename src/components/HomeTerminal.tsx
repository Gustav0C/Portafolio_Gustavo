"use client";

import { useEffect, useState, useRef } from "react";
import GhostAvatar from "./GhostAvatar";
import styles from "./HomeTerminal.module.css";

interface TerminalLine {
	prompt?: string;
	text: string;
	isLast?: boolean;
}

const lines: TerminalLine[] = [
	{ prompt: "$", text: " whoami" },
	{ text: "Gustavo Canales — Full Stack & AI Systems" },
	{ prompt: "$", text: " cat focus.json" },
	{ text: '["Next.js", "TypeScript", "React", "AI Agents"]' },
	{ prompt: "$", text: " echo $STATUS" },
	{ text: "available_for_hire: true [ica, pe]" },
	{ prompt: "$", text: "", isLast: true },
];

const TYPING_SPEED = 30;

export default function HomeTerminal() {
	const [visibleLines, setVisibleLines] = useState<number>(0);
	const [typedText, setTypedText] = useState("");
	const [showCursor, setShowCursor] = useState(true);
	const [done, setDone] = useState(false);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [mounted, setMounted] = useState(false);
	const sectionRef = useRef<HTMLDivElement>(null);
	const liveRegionRef = useRef<HTMLDivElement>(null);

	const startAnimation = useRef(() => {
		let lineIndex = 0;
		let charIndex = 0;
		let currentText = "";

		setVisibleLines(1);

		const interval = setInterval(() => {
			const line = lines[lineIndex];

			if (charIndex < line.text.length) {
				charIndex++;
				currentText = line.text.slice(0, charIndex);
				setTypedText(currentText);

				// Announce typed text to screen readers
				if (liveRegionRef.current) {
					liveRegionRef.current.textContent = currentText;
				}
			} else {
				// Line complete
				lineIndex++;
				charIndex = 0;
				currentText = "";

				if (lineIndex < lines.length) {
					setVisibleLines(lineIndex + 1);
					setTypedText("");
				} else {
					clearInterval(interval);
					setShowCursor(false);
					setDone(true);
				}
			}
		}, TYPING_SPEED);

		return () => clearInterval(interval);
	});

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

	useEffect(() => {
		const el = sectionRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					if (reducedMotion) {
						// Show all content instantly for reduced motion
						setVisibleLines(lines.length);
						setDone(true);
						setShowCursor(false);
					} else {
						startAnimation.current();
					}
				}
			},
			{ threshold: 0.2 },
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [reducedMotion]);

	// Render window chrome helper
	const renderHeader = () => (
		<div className={styles.terminalHeader}>
			<div className={styles.windowControls} aria-hidden="true">
				<span className={styles.controlDot} />
				<span className={styles.controlDot} />
				<span className={styles.controlDot} />
			</div>
			<div className={styles.terminalTitle}>
				<span>gscp@workstation: ~/portfolio</span>
			</div>
			<div className={styles.sessionBadge} title="Sesión activa">
				<GhostAvatar size={18} className={styles.headerGhost} />
			</div>
		</div>
	);

	// If reduced motion, render all lines immediately
	if (mounted && reducedMotion) {
		return (
			<div ref={sectionRef} className={styles.terminal}>
				{renderHeader()}
				<div className={styles.terminalBody}>
					{lines.map((line, i) => (
						<div key={i} className={styles.line}>
							{line.prompt && (
								<span className={styles.prompt}>{line.prompt}</span>
							)}
							<span>{line.text}</span>
						</div>
					))}
				</div>
			</div>
		);
	}

	// During SSR or before mount, render empty terminal frame
	if (!mounted) {
		return (
			<div ref={sectionRef} className={styles.terminal}>
				{renderHeader()}
				<div className={styles.terminalBody} />
			</div>
		);
	}

	return (
		<div ref={sectionRef} className={styles.terminal}>
			{renderHeader()}
			<div className={styles.terminalBody}>
				{/* Live region for screen readers */}
				<div
					ref={liveRegionRef}
					aria-live="polite"
					aria-atomic="true"
					className={styles.liveRegion}
				/>
				{lines.map((line, i) => {
					const isCurrentlyTyping = i === visibleLines - 1 && !done;
					const isComplete = i < visibleLines - 1 || done;
					const isLastLine = i === lines.length - 1;

					if (!isComplete && !isCurrentlyTyping) return null;

					return (
						<div key={i} className={styles.line}>
							{line.prompt && (
								<span className={styles.prompt}>{line.prompt}</span>
							)}
							<span>{isCurrentlyTyping ? typedText : line.text}</span>
							{isCurrentlyTyping && showCursor && (
								<span className={styles.cursor} />
							)}
							{isLastLine && done && <span className={styles.cursor} />}
						</div>
					);
				})}
			</div>
		</div>
	);
}
