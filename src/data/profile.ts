import type { ComponentProps } from "react";
import type TechIcon from "@/components/TechIcon";

export type TechIconName = ComponentProps<typeof TechIcon>["name"];

export interface ProfileLink {
	id: string;
	label: string;
	url: string;
	kind: "internal" | "external" | "email";
	badge?: string;
	description?: string;
}

export interface EngineeringPrinciple {
	id: string;
	index: string;
	title: string;
	description: string;
}

export interface ExperienceItem {
	id: string;
	role: string;
	company: string;
	period: string;
	location: string;
	highlights: string[];
	technologies: string[];
}

export interface EducationItem {
	id: string;
	title: string;
	institution: string;
	period: string;
	description: string;
}

export interface SkillItem {
	name: string;
	icon: TechIconName;
}

export interface SkillCategory {
	id: string;
	index: string;
	title: string;
	description: string;
	skills: SkillItem[];
}

export interface TelemetryItem {
	label: string;
	value: string;
}

export interface ProfileData {
	name: string;
	handle: string;
	role: string;
	location: string;
	status: string;
	statusBadge: string;
	bio: string;
	avatarUrl: string;
	telemetry: TelemetryItem[];
	links: ProfileLink[];
	principles: EngineeringPrinciple[];
	skills: SkillCategory[];
	experience: ExperienceItem[];
	education: EducationItem[];
}

export const profileData: ProfileData = {
	name: "Gustavo Canales",
	handle: "gscp",
	role: "Full Stack Engineer & AI Integrator",
	location: "Ica, Perú",
	status: "DISPONIBLE PARA PROYECTOS",
	statusBadge: "ONLINE",
	bio: "Ingeniero de software enfocado en el ecosistema React, Next.js y TypeScript, con bases firmes en Clean Architecture, testing y diseño de sistemas tipados. Integro agentes autónomos de IA y APIs de alto rendimiento para construir aplicaciones rápidas, predecibles y mantenibles.",
	avatarUrl: "/perfil.webp",
	telemetry: [
		{
			label: "CORE_STACK:",
			value: "Next.js 16 · React 19 · TypeScript · Python · AI Agents",
		},
		{
			label: "PARADIGMA:",
			value: "Clean Architecture · Tipado Estricto · Modularidad",
		},
		{
			label: "CALIDAD:",
			value: "Test-Driven · Flat Terminal UI · Zero Regressions",
		},
		{
			label: "UBICACIÓN:",
			value: "Ica, Perú (GMT-5) · Remoto / Híbrido",
		},
	],
	links: [
		{
			id: "github",
			label: "GitHub",
			url: "https://github.com/Gustav0C",
			kind: "external",
			badge: "@Gustav0C",
			description: "Repositorios, proyectos open source y actividad de código",
		},
		{
			id: "linkedin",
			label: "LinkedIn",
			url: "https://www.linkedin.com/in/gscp/",
			kind: "external",
			badge: "in/gscp",
			description: "Trayectoria profesional, conexiones y experiencia",
		},
		{
			id: "email",
			label: "Email",
			url: "mailto:gcanales58@gmail.com",
			kind: "email",
			badge: "gcanales58@gmail.com",
			description: "Contacto directo por correo electrónico",
		},
		{
			id: "contacto",
			label: "Contactar",
			url: "/contacto",
			kind: "internal",
			badge: "/contacto",
			description: "Formulario de contacto directo con protección anti-bot",
		},
		{
			id: "proyectos",
			label: "Ver Proyectos",
			url: "/proyectos",
			kind: "internal",
			badge: "/proyectos",
			description: "Catálogo completo de proyectos desarrollados",
		},
	],
	principles: [
		{
			id: "arch",
			index: "01",
			title: "ARQUITECTURA & TIPADO ESTRICTO",
			description:
				"Diseño modular basado en Clean Architecture, separación nítida entre capas de presentación y dominio, y TypeScript en modo estricto para erradicar errores en tiempo de compilación.",
		},
		{
			id: "ai",
			index: "02",
			title: "IA COMO MULTIPLICADOR",
			description:
				"Adopción profunda de agentes autónomos y tooling de última generación (OpenCode, Claude Code) para acelerar la cadencia de entrega sin sacrificar rigurosidad técnica ni calidad.",
		},
		{
			id: "testing",
			index: "03",
			title: "TESTING & CONFIABILIDAD",
			description:
				"Desarrollo guiado por pruebas (Vitest, Testing Library). Cada cambio se valida con tests unitarios y de integración para garantizar cero regresiones y despliegues seguros.",
		},
		{
			id: "performance",
			index: "04",
			title: "PRAGMATISMO & PERFORMANCE",
			description:
				"Prioridad en Core Web Vitals, SSR/PPR, bundles optimizados y código legible por sobre complejidades innecesarias o abstracciones prematuras.",
		},
	],
	skills: [
		{
			id: "frontend",
			index: "01",
			title: "FRONTEND & INTERFACES",
			description:
				"Sistemas reactivos, SSR/PPR, arquitectura de componentes accesibles y diseño terminal.",
			skills: [
				{ name: "React", icon: "react" },
				{ name: "Next.js", icon: "nextjs" },
				{ name: "TypeScript", icon: "typescript" },
				{ name: "JavaScript", icon: "js" },
				{ name: "Tailwind CSS", icon: "tailwindcss" },
				{ name: "HTML5 / CSS3", icon: "web" },
				{ name: "Vite", icon: "vitejs" },
			],
		},
		{
			id: "backend",
			index: "02",
			title: "BACKEND & DATOS",
			description:
				"Servicios distribuidos, APIs tipadas, autenticación y persistencia relacional.",
			skills: [
				{ name: "Node.js", icon: "nodejs" },
				{ name: "Python", icon: "python" },
				{ name: "PostgreSQL", icon: "postgresql" },
				{ name: "Supabase", icon: "supabase" },
				{ name: "Express", icon: "expressjs" },
				{ name: "MongoDB", icon: "mongodb" },
				{ name: "Redis", icon: "redis" },
			],
		},
		{
			id: "ai",
			index: "03",
			title: "IA & SISTEMAS AUTÓNOMOS",
			description:
				"Tooling agentic para ingeniería de software, orquestación y workflows de automatización.",
			skills: [
				{ name: "OpenCode", icon: "opencode" },
				{ name: "Claude Code", icon: "claude" },
				{ name: "Codex", icon: "codex" },
				{ name: "Agentes Autónomos", icon: "agent" },
				{ name: "Machine Learning", icon: "ml" },
				{ name: "Workflows", icon: "workflow" },
			],
		},
		{
			id: "devops",
			index: "04",
			title: "DEVOPS & CALIDAD",
			description:
				"Entornos reproducibles, testing automatizado e infraestructura de despliegue continuo.",
			skills: [
				{ name: "Docker", icon: "docker" },
				{ name: "Git", icon: "git" },
				{ name: "Vercel", icon: "vercel" },
				{ name: "AWS", icon: "aws" },
				{ name: "ESLint", icon: "eslint" },
				{ name: "Prettier", icon: "prettier" },
				{ name: "Vitest", icon: "vitest" },
			],
		},
	],
	experience: [
		{
			id: "exp-freelance",
			role: "Desarrollador Full Stack & Consultor Web",
			company: "Proyectos Independientes & Freelance",
			period: "2024 - Presente",
			location: "Remoto / Ica, Perú",
			highlights: [
				"Diseño e implementación de aplicaciones web de alto rendimiento con Next.js (App Router), React 19 y TypeScript, asegurando accesibilidad WCAG 2.2 y SEO técnico.",
				"Construcción de arquitecturas desacopladas con APIs tipadas, autenticación segura y persistencia en bases de datos relacionales (PostgreSQL, Supabase).",
				"Integración de tooling de agentes autónomos de IA y automatización de pipelines de desarrollo, optimizando tiempos de ciclo y calidad de entrega.",
			],
			technologies: [
				"Next.js",
				"React",
				"TypeScript",
				"Python",
				"Supabase",
				"PostgreSQL",
				"Docker",
				"Tailwind CSS",
				"AI Agents",
			],
		},
		{
			id: "exp-web",
			role: "Desarrollador Frontend & Web",
			company: "Desarrollo Web & Soluciones Digitales",
			period: "2022 - 2024",
			location: "Perú",
			highlights: [
				"Desarrollo de interfaces dinámicas, responsivas y componentes modulares con JavaScript moderno, React y Node.js.",
				"Integración con servicios RESTful de terceros, manejo de estado y testing de componentes clave.",
				"Optimización de experiencia de usuario, tiempos de carga y compatibilidad cross-browser.",
			],
			technologies: [
				"JavaScript",
				"React",
				"Node.js",
				"HTML5 / CSS3",
				"Git",
				"REST APIs",
			],
		},
	],
	education: [
		{
			id: "edu-carrera",
			title: "Carrera de Tecnología en Desarrollo de Software",
			institution: "Formación Superior en Tecnología",
			period: "2024 - Presente",
			description:
				"Formación integral en ingeniería de software, algoritmos, estructuras de datos, modelado de bases de datos relacionales, patrones de arquitectura y metodologías ágiles.",
		},
		{
			id: "edu-continua",
			title: "Especialización Continua & Autodidacta",
			institution: "Ecosistema Open Source & Comunidades Técnicas",
			period: "Constante",
			description:
				"Profundización constante en Clean Architecture, Domain-Driven Design pragmático, Next.js interno, ingeniería de agentes autónomos con IA, accesibilidad web y performance.",
		},
	],
};
