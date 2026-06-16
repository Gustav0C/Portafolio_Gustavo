"use client";

import { useEffect, useState, useRef } from "react";
import TechIcon from "./TechIcon";
import styles from "./SkillsSection.module.css";

const skillCategories = [
	{
		title: "Frontend",
		skills: [
			{ name: "React", icon: "react" },
			{ name: "Next.js", icon: "nextjs" },
			{ name: "TypeScript", icon: "typescript" },
			{ name: "JavaScript", icon: "js" },
			{ name: "HTML", icon: "html5" },
			{ name: "CSS", icon: "css3" },
			{ name: "Tailwind", icon: "tailwindcss" },
		],
	},
	{
		title: "Backend",
		skills: [
			{ name: "Node.js", icon: "nodejs" },
			{ name: "Express", icon: "expressjs" },
			{ name: "Python", icon: "python" },
			{ name: "SQL", icon: "postgresql" },
			{ name: "PostgreSQL", icon: "postgresql" },
			{ name: "MongoDB", icon: "mongodb" },
			{ name: "Redis", icon: "redis" },
		],
	},
	{
		title: "DevOps & Tools",
		skills: [
			{ name: "Docker", icon: "docker" },
			{ name: "Git", icon: "git" },
			{ name: "Vercel", icon: "vercel" },
			{ name: "AWS", icon: "aws" },
			{ name: "Vite", icon: "vitejs" },
			{ name: "ESLint", icon: "eslint" },
			{ name: "Prettier", icon: "prettier" },
		],
	},
];

export default function SkillsSection() {
	const [hasBeenVisible, setHasBeenVisible] = useState(false);
	const [typedText, setTypedText] = useState("");
	const [showCategories, setShowCategories] = useState(false);
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

		const command = "cat skills.txt";
		let index = 0;

		const interval = setInterval(() => {
			index++;
			setTypedText(command.slice(0, index));

			if (index >= command.length) {
				clearInterval(interval);
				setShowCursor(false);

				// Reveal categories after typing finishes
				setTimeout(() => setShowCategories(true), 400);
			}
		}, 45);

		return () => clearInterval(interval);
	}, [hasBeenVisible, reducedMotion, mounted]);

	// For reduced motion, show everything immediately
	const displayTypedText = reducedMotion ? "cat skills.txt" : typedText;
	const displayShowCursor = reducedMotion ? false : showCursor;
	const displayShowCategories = reducedMotion ? true : showCategories;

	// During SSR or before mount, render placeholder to avoid hydration mismatch
	if (!mounted) {
		return (
			<section ref={sectionRef} className={styles.section}>
				<div className={styles.commandLine}>
					<span className={styles.commandPlaceholder}>&nbsp;</span>
				</div>
				<div className={styles.grid}>
					{skillCategories.map((category) => (
						<article key={category.title} className={styles.category}>
							<h3 className={styles.categoryTitle}>{category.title}</h3>
							<ul className={styles.skillsList}>
								{category.skills.map((skill) => (
									<li key={skill.name} className={styles.skillItem}>
										<TechIcon
											name={skill.icon as "react" | "nextjs" | "typescript" | "js" | "html5" | "css3" | "tailwindcss" | "nodejs" | "expressjs" | "python" | "postgresql" | "mongodb" | "redis" | "docker" | "git" | "vercel" | "aws" | "vitejs" | "eslint" | "prettier"}
											variant="grayscale"
											className={styles.skillIcon}
											aria-hidden="true"
										/>
										{skill.name}
									</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</section>
		);
	}

	return (
		<section ref={sectionRef} className={styles.section}>
			{/* Terminal command line */}
			{hasBeenVisible && (
				<div className={styles.commandLine}>
					<span className={styles.commandPrompt}>$</span>
					{displayTypedText}
					{displayShowCursor && <span className={styles.cursor} />}
				</div>
			)}

			{/* Categories grid */}
			<div className={`${styles.grid} ${displayShowCategories ? styles.gridVisible : ""}`}>
				{skillCategories.map((category, i) => (
					<article
						key={category.title}
						className={styles.category}
						style={{ transitionDelay: reducedMotion ? "0ms" : `${i * 150}ms` }}
					>
						<h3 className={styles.categoryTitle}>{category.title}</h3>
						<ul className={styles.skillsList}>
							{category.skills.map((skill) => (
								<li key={skill.name} className={styles.skillItem}>
									<TechIcon
										name={skill.icon as "react" | "nextjs" | "typescript" | "js" | "html5" | "css3" | "tailwindcss" | "nodejs" | "expressjs" | "python" | "postgresql" | "mongodb" | "redis" | "docker" | "git" | "vercel" | "aws" | "vitejs" | "eslint" | "prettier"}
										variant="grayscale"
										className={styles.skillIcon}
										aria-hidden="true"
									/>
									{skill.name}
								</li>
							))}
						</ul>
					</article>
				))}
			</div>
		</section>
	);
}