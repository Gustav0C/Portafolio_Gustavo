"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { Project } from "@/features/projects/types";
import { fetchProjects } from "@/features/projects/api";
import styles from "./FeaturedProjects.module.css";

export default function FeaturedProjects() {
	const [hasBeenVisible, setHasBeenVisible] = useState(false);
	const [typedText, setTypedText] = useState("");
	const [showCards, setShowCards] = useState(false);
	const [showCursor, setShowCursor] = useState(true);
	const [reducedMotion, setReducedMotion] = useState(false);
	const [mounted, setMounted] = useState(false);
	const [projects, setProjects] = useState<Project[]>([]);
	const [fetchDone, setFetchDone] = useState(false);
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

	// Fetch projects after mount
	useEffect(() => {
		if (!mounted) return;

		fetchProjects()
			.then((data) => {
				setProjects(data.projects);
				setFetchDone(true);
			})
			.catch(() => {
				setFetchDone(true);
			});
	}, [mounted]);

	// IntersectionObserver — trigger animation once when section scrolls into view
	useEffect(() => {
		const el = sectionRef.current;
		if (!el || !mounted || !fetchDone) return;

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
	}, [mounted, fetchDone]);

	// Typewriter effect (skip if reduced motion)
	useEffect(() => {
		if (!hasBeenVisible || !mounted || !fetchDone) return;

		if (reducedMotion) {
			return;
		}

		const command = "cat projects.txt";
		let index = 0;

		const interval = setInterval(() => {
			index++;
			setTypedText(command.slice(0, index));

			if (index >= command.length) {
				clearInterval(interval);
				setShowCursor(false);

				// Reveal cards after typing finishes
				setTimeout(() => setShowCards(true), 400);
			}
		}, 45);

		return () => clearInterval(interval);
	}, [hasBeenVisible, reducedMotion, mounted, fetchDone]);

	// For reduced motion, show everything immediately
	const displayTypedText = reducedMotion ? "cat projects.txt" : typedText;
	const displayShowCursor = reducedMotion ? false : showCursor;
	const displayShowCards = reducedMotion ? true : showCards;

	// During SSR or before mount, render placeholder to avoid hydration mismatch
	if (!mounted) {
		return (
			<section ref={sectionRef} className={styles.section}>
				<div className={styles.commandLine}>
					<span className={styles.commandPlaceholder}>&nbsp;</span>
				</div>
			</section>
		);
	}

	// Loading state while fetching projects
	if (!fetchDone) {
		return (
			<section ref={sectionRef} className={styles.section}>
				<div className={styles.commandLine}>
					<span className={styles.commandPlaceholder}>&nbsp;</span>
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

			{/* Projects grid */}
			{projects.length > 0 ? (
				<div
					className={`${styles.grid} ${displayShowCards ? styles.gridVisible : ""}`}
				>
					{projects.map((project, i) => (
						<article
							key={project.id}
							className={styles.card}
							style={{
								transitionDelay: reducedMotion
									? "0ms"
									: `${i * 120}ms`,
							}}
						>
							<h3 className={styles.cardTitle}>{project.title}</h3>
							<p className={styles.cardDesc}>{project.description}</p>

							{/* Technologies */}
							{project.technologies.length > 0 && (
								<div className={styles.techList}>
									{project.technologies.map((tech) => (
										<span key={tech} className={styles.techTag}>
											<span className={styles.techPrompt}>&gt;</span>
											{tech}
										</span>
									))}
								</div>
							)}

							{/* Stars & Links */}
							<div className={styles.cardFooter}>
								<span className={styles.stars}>
									★ {project.stars}
								</span>
								<div className={styles.cardLinks}>
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className={styles.cardLink}
									>
										Repo
									</a>
									{project.demoUrl && (
										<a
											href={project.demoUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.cardLink}
										>
											Demo →
										</a>
									)}
								</div>
							</div>
						</article>
					))}
				</div>
			) : (
				<p className={styles.empty}>
					No hay proyectos destacados aún.
				</p>
			)}

			{/* Section CTA */}
			{projects.length > 0 && (
				<Link href="/proyectos" className={styles.sectionCta}>
					Ver más proyectos →
				</Link>
			)}
		</section>
	);
}
