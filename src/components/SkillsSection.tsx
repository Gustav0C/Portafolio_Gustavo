import TechIcon from "./TechIcon";
import styles from "./SkillsSection.module.css";

type TechIconName =
	| "react"
	| "nextjs"
	| "typescript"
	| "js"
	| "html5"
	| "css3"
	| "tailwindcss"
	| "nodejs"
	| "expressjs"
	| "python"
	| "postgresql"
	| "mongodb"
	| "redis"
	| "docker"
	| "git"
	| "vercel"
	| "aws"
	| "vitejs"
	| "eslint"
	| "prettier"
	| "supabase"
	| "opencode"
	| "claude"
	| "codex"
	| "web"
	| "agent"
	| "ml"
	| "workflow"
	| "vitest";

interface SkillItem {
	name: string;
	icon: TechIconName;
}

interface SkillCategory {
	id: string;
	title: string;
	desc: string;
	skills: SkillItem[];
}

const categories: SkillCategory[] = [
	{
		id: "01",
		title: "FRONTEND & INTERFACES",
		desc: "Sistemas reactivos, SSR/PPR, arquitectura de componentes y diseño accesible.",
		skills: [
			{ name: "React", icon: "react" },
			{ name: "Next.js", icon: "nextjs" },
			{ name: "TypeScript", icon: "typescript" },
			{ name: "Tailwind CSS", icon: "tailwindcss" },
			{ name: "HTML, CSS & JavaScript", icon: "web" },
			{ name: "Vite", icon: "vitejs" },
		],
	},
	{
		id: "02",
		title: "BACKEND & PERSISTENCIA",
		desc: "Servicios distribuidos, APIs tipadas, autenticación y modelado de datos.",
		skills: [
			{ name: "Node.js", icon: "nodejs" },
			{ name: "Python", icon: "python" },
			{ name: "Supabase", icon: "supabase" },
			{ name: "PostgreSQL", icon: "postgresql" },
			{ name: "Express", icon: "expressjs" },
			{ name: "MongoDB", icon: "mongodb" },
		],
	},
	{
		id: "03",
		title: "IA & SISTEMAS AUTÓNOMOS",
		desc: "Herramientas de IA de vanguardia para ingeniería, agentes y modelos de Machine Learning.",
		skills: [
			{ name: "OpenCode", icon: "opencode" },
			{ name: "Claude Code", icon: "claude" },
			{ name: "Codex", icon: "codex" },
			{ name: "Agentes Autónomos", icon: "agent" },
			{ name: "Machine Learning", icon: "ml" },
			{ name: "Automatizaciones", icon: "workflow" },
		],
	},
	{
		id: "04",
		title: "DEVOPS & CALIDAD",
		desc: "Entornos reproducibles, testing automatizado e infraestructura cloud.",
		skills: [
			{ name: "Docker", icon: "docker" },
			{ name: "Git", icon: "git" },
			{ name: "Vercel", icon: "vercel" },
			{ name: "AWS", icon: "aws" },
			{ name: "ESLint", icon: "eslint" },
			{ name: "Prettier", icon: "prettier" },
		],
	},
];

export default function SkillsSection() {
	return (
		<section className={styles.section} aria-labelledby="skills-heading">
			<div className={styles.header}>
				<div className={styles.sectionTag}>
					{"// 02. ARSENAL TÉCNICO & HERRAMIENTAS"}
				</div>
				<h2 id="skills-heading" className={styles.sectionTitle}>
					Stack de Especialidad &amp; Tecnologías
				</h2>
				<p className={styles.sectionSubtitle}>
					Tecnologías comprobadas e IAs de vanguardia para construir software predecible, rápido y mantenible.
				</p>

				<div className={styles.telemetryBar}>
					<div className={styles.telemetryItem}>
						<span className={styles.telemetryLabel}>CORE_STACK:</span>
						<span className={styles.telemetryValue}>
							Next.js · React · TypeScript · Python · Supabase · AI
						</span>
					</div>
					<div className={styles.telemetryItem}>
						<span className={styles.telemetryLabel}>PARADIGMA:</span>
						<span className={styles.telemetryValue}>
							Tipado Estricto · Clean Architecture
						</span>
					</div>
					<div className={styles.telemetryItem}>
						<span className={styles.telemetryLabel}>VERIFICACIÓN:</span>
						<span className={styles.telemetryValue}>
							Test-Driven · 100% Flat Design
						</span>
					</div>
				</div>
			</div>

			<div className={styles.grid}>
				{categories.map((category) => (
					<article key={category.id} className={styles.categoryCard}>
						<div className={styles.categoryHeader}>
							<div className={styles.categoryTitleGroup}>
								<span className={styles.categoryIndex}>
									{category.id} {"//"}
								</span>
								<h3 className={styles.categoryTitle}>{category.title}</h3>
							</div>
							<p className={styles.categoryDesc}>{category.desc}</p>
						</div>

						<ul className={styles.skillsList}>
							{category.skills.map((skill) => (
								<li key={skill.name} className={styles.skillItem}>
									<TechIcon
										name={skill.icon}
										variant="grayscale"
										className={styles.skillIcon}
										aria-hidden="true"
									/>
									<span className={styles.skillName}>{skill.name}</span>
								</li>
							))}
						</ul>
					</article>
				))}
			</div>
		</section>
	);
}
