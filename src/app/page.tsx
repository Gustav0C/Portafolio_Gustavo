import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Background from "@/components/Background";
import HomeTerminal from "@/components/HomeTerminal";
import Reveal from "@/components/Reveal";
import styles from "./page.module.css";

const ServicesSection = dynamic(() => import("@/components/ServicesSection"));
const SkillsSection = dynamic(() => import("@/components/SkillsSection"));
const FeaturedProjects = dynamic(() => import("@/components/FeaturedProjects"));
const StatusSection = dynamic(() => import("@/components/StatusSection"));

export const metadata: Metadata = {
	title: "Inicio | Gustavo Canales - Desarrollador Full Stack",
	description:
		"Bienvenido al portafolio de Gustavo Canales. Desarrollador Full Stack con experiencia en React, Next.js y TypeScript. Explore mis proyectos y servicios.",
	openGraph: {
		title: "Gustavo Canales - Desarrollador Full Stack",
		description:
			"Portafolio profesional con proyectos en React, Next.js y tecnologías web modernas",
		url: "https://gcanales.is-a.dev",
		type: "website",
	},
	alternates: {
		canonical: "https://gcanales.is-a.dev/",
	},
};

export default function Home() {
	return (
		<>
			<Background className={styles.background} />
			<div className={styles.content}>
				<section className={styles.hero} aria-labelledby="hero-title">
					<div className={styles.heroMain}>
						<div className={styles.statusBadge}>
							<span className={styles.statusDot} aria-hidden="true" />
							<span className={styles.statusText}>
								DISPONIBLE PARA PROYECTOS · ICA, PERÚ
							</span>
						</div>

						<h1 id="hero-title" className={styles.title}>
							Gustavo Canales
						</h1>

						<p className={styles.role}>
							Full Stack Engineer &amp; AI Integrator
						</p>

						<p className={styles.pitch}>
							Desarrollo aplicaciones web de alto rendimiento con React, Next.js y
							TypeScript, e integro agentes autónomos de IA y APIs robustas. Foco
							en arquitectura limpia, tipado estricto y ejecución sin rodeos.
						</p>

						<div className={styles.cta}>
							<Link href="/proyectos" className={styles.btnPrimary}>
								Ver Proyectos
							</Link>
							<Link href="/contacto" className={styles.btnSecondary}>
								Contactar
							</Link>
						</div>

						<div className={styles.metaRow}>
							<span className={styles.metaLabel}>core_stack:</span>
							<span className={styles.metaStack}>
								next.js · react · typescript · python · ai
							</span>
						</div>
					</div>

					<div className={styles.heroVisual}>
						<HomeTerminal />
					</div>
				</section>

				<Reveal>
					<ServicesSection />
				</Reveal>

				<Reveal>
					<SkillsSection />
				</Reveal>

				<Reveal>
					<FeaturedProjects />
				</Reveal>

				<Reveal>
					<StatusSection />
				</Reveal>
			</div>
		</>
	);
}
