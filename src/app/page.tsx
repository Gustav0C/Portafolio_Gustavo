import Link from "next/link";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import GhostAvatar from "@/components/GhostAvatar";
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
		url: "https://gustavo-canales.vercel.app",
		type: "website",
	},
	alternates: {
		canonical: "https://gustavo-canales.vercel.app/",
	},
};

export default function Home() {
	return (
		<>
			<Background className={styles.background} />
			<div className={styles.content}>
				<div className={styles.hero}>
					<GhostAvatar size={120} />
					<h1 className={styles.title}>Gustavo Canales</h1>
					<p className={styles.subtitle}>
						Desarrollador Full Stack con pasión por crear soluciones elegantes y
						experiencias de usuario excepcionales.
					</p>

					<HomeTerminal />

					<div className={styles.cta}>
						<Link href="/proyectos" className={styles.btnPrimary}>
							Ver Proyectos
						</Link>
						<Link href="/contacto" className={styles.btnAccent}>
							Contactar
						</Link>
					</div>
				</div>

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
