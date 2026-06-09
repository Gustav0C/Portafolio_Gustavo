"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import styles from "./ServicesSection.module.css";

const services = [
	{
		title: "Desarrollo Web Full Stack",
		desc: "Aplicaciones web modernas, APIs y sistemas escalables desde cero.",
		features: [
			"Apps con React, Next.js, TypeScript",
			"APIs y backend con Node.js, Python",
			"Bases de datos SQL y NoSQL",
			"Deploy y DevOps en Vercel, Docker",
		],
	},
	{
		title: "Integración de IA",
		desc: "Agentes inteligentes, automatizaciones y asistentes personalizados.",
		features: [
			"Agentes y automatizaciones con IA",
			"Asistentes inteligentes a medida",
			"Optimización de workflows",
			"Integración de LLMs y APIs de IA",
		],
	},
	{
		title: "Consultoría Técnica",
		desc: "Arquitectura, code review y mentoría para llevar tu proyecto al nivel siguiente.",
		features: [
			"Arquitectura de software y code review",
			"Migraciones y optimización de proyectos",
			"Mentoría técnica para equipos",
			"UI/UX con foco en rendimiento",
		],
	},
];

export default function ServicesSection() {
	const [hasBeenVisible, setHasBeenVisible] = useState(false);
	const [typedText, setTypedText] = useState("");
	const [showCards, setShowCards] = useState(false);
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

  		const command = "cat servicios.txt";
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
  	}, [hasBeenVisible, reducedMotion, mounted]);

 	// For reduced motion, show everything immediately
 	const displayTypedText = reducedMotion ? "cat servicios.txt" : typedText;
 	const displayShowCursor = reducedMotion ? false : showCursor;
 	const displayShowCards = reducedMotion ? true : showCards;

 	// During SSR or before mount, render placeholder to avoid hydration mismatch
 	if (!mounted) {
 		return (
 			<section ref={sectionRef} className={styles.section}>
 				<div className={styles.commandLine}>
 					<span className={styles.commandPlaceholder}>&nbsp;</span>
 				</div>
 				<div className={styles.grid}>
 					{services.map((service) => (
 						<article key={service.title} className={styles.card}>
 							<h3 className={styles.cardTitle}>{service.title}</h3>
 							<p className={styles.cardDesc}>{service.desc}</p>
 							<ul className={styles.features}>
 								{service.features.map((feature) => (
 									<li key={feature} className={styles.featureItem}>
 										<span className={styles.featurePrompt}>&gt;</span>
 										{feature}
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

			{/* Cards grid */}
			<div className={`${styles.grid} ${displayShowCards ? styles.gridVisible : ""}`}>
				{services.map((service, i) => (
					<article
						key={service.title}
						className={styles.card}
						style={{ transitionDelay: reducedMotion ? "0ms" : `${i * 120}ms` }}
					>
						<h3 className={styles.cardTitle}>{service.title}</h3>
						<p className={styles.cardDesc}>{service.desc}</p>

						<ul className={styles.features}>
							{service.features.map((feature) => (
								<li key={feature} className={styles.featureItem}>
									<span className={styles.featurePrompt}>&gt;</span>
									{feature}
								</li>
							))}
						</ul>

						<Link href="/contacto" className={styles.cardCta}>
							Solicitar &rarr;
						</Link>
					</article>
				))}
			</div>
		</section>
	);
}
