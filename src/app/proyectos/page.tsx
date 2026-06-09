"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ExternalLink, Gauge, Link, Plus, Trash2, Code } from "lucide-react";
import styles from "./page.module.css";
import type { Project } from "@/features/projects/types";
import { getTechIcon } from "@/features/projects/tech-icons";
import {
	fetchProjects,
	getAdminToken,
	importProjectFromGitHub,
	persistProjects,
	validateAdminToken,
} from "@/features/projects/api";

export default function Proyectos() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isAdminUser, setIsAdminUser] = useState(false);
	const [githubUrl, setGithubUrl] = useState("");
	const [adminPassword, setAdminPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [adminError, setAdminError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [adminHint, setAdminHint] = useState(false);

	const githubErrorId = error ? "project-github-error" : undefined;
	const adminErrorId = adminError ? "project-admin-error" : undefined;
	const adminHintId = "admin-hint-live";

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.altKey && e.key === "9") {
				e.preventDefault();
				setAdminHint(true);
				// Announce to screen readers
				const liveRegion = document.getElementById(adminHintId);
				if (liveRegion) {
					liveRegion.textContent = "Modo administrador activado. Ingresá el token para editar proyectos.";
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	useEffect(() => {
		fetchProjects()
			.then((data) => {
				setProjects(data.projects);
				setIsAdminUser(data.canEdit);

				if (!data.canEdit && getAdminToken()) {
					localStorage.removeItem("adminToken");
				}
			})
			.catch(() => {
				setProjects([]);
				setIsAdminUser(false);
			});
	}, []);

	const handleAddProject = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!githubUrl.trim()) {
			setError("Ingresa una URL de GitHub");
			return;
		}

		if (!githubUrl.includes("github.com/")) {
			setError("Debe ser una URL de GitHub válida");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const newProject = await importProjectFromGitHub(githubUrl);
			const updatedProjects = [newProject, ...projects];
			await persistProjects(updatedProjects);

			setProjects(updatedProjects);
			setGithubUrl("");
			setShowForm(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error desconocido");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteProject = async (id: string) => {
		setError("");
		const previousProjects = projects;
		const updatedProjects = projects.filter((project) => project.id !== id);
		setProjects(updatedProjects);

		try {
			await persistProjects(updatedProjects);
		} catch {
			setProjects(previousProjects);
			setError("No se pudo eliminar el proyecto");
		}
	};

	const handleLogin = async () => {
		const password = adminPassword.trim();

		if (!password) {
			setIsAdminUser(false);
			setAdminError("Ingresá el token administrativo");
			return;
		}

		setAdminError("");

		try {
			await validateAdminToken(password);
			localStorage.setItem("adminToken", password);
			setIsAdminUser(true);
			setAdminPassword("");
			setAdminHint(false);
		} catch (err) {
			localStorage.removeItem("adminToken");
			setIsAdminUser(false);
			setAdminError(
				err instanceof Error
					? err.message
					: "No se pudo validar el token. Intentá nuevamente.",
			);
		}
	};

	return (
		<div className={styles.proyectos}>
			<div className={styles.header}>
				<h1 className={styles.title}>Proyectos</h1>

			{/* Live region for admin hint announcement */}
			<div id={adminHintId} aria-live="polite" aria-atomic="true" className={styles.liveRegion} />

			{adminHint && !isAdminUser && (
				<div className={styles.adminLogin}>
					<input
						type="password"
						placeholder="Password"
						className={styles.adminInput}
						value={adminPassword}
						onChange={(e) => setAdminPassword(e.target.value)}
						aria-invalid={Boolean(adminError)}
						aria-describedby={adminErrorId}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								void handleLogin();
							}
						}}
						onBlur={(e) => {
							if (!e.target.value) setAdminHint(false);
						}}
					/>
					{adminError && (
						<p id="project-admin-error" className={styles.error} role="alert">
							{adminError}
						</p>
					)}
				</div>
			)}

				{isAdminUser && (
					<button
						type="button"
						onClick={() => setShowForm(!showForm)}
						className={styles.addBtn}
					>
						<Plus size={16} />
						{showForm ? "Cancelar" : "Agregar"}
					</button>
				)}
			</div>

			{error && !showForm && (
				<p id="project-github-error" className={styles.error} role="alert">
					{error}
				</p>
			)}

			{showForm && isAdminUser && (
				<form className={styles.form} onSubmit={handleAddProject} noValidate>
					<h2 className={styles.formTitle}>Nuevo Proyecto</h2>
					<div className={styles.formGroup}>
						<label htmlFor="githubUrl" className={styles.label}>
							URL del Repositorio
						</label>
						<input
							id="githubUrl"
							type="text"
							className={styles.input}
							placeholder="https://github.com/usuario/repositorio"
							value={githubUrl}
							onChange={(e) => setGithubUrl(e.target.value)}
							disabled={loading}
							aria-invalid={Boolean(error)}
							aria-describedby={githubErrorId}
						/>
					</div>
					{error && (
						<p id="project-github-error" className={styles.error} role="alert">
							{error}
						</p>
					)}
					<button type="submit" className={styles.submitBtn} disabled={loading}>
						{loading ? "Cargando..." : "Agregar Proyecto"}
					</button>
				</form>
			)}

			<div className={styles.grid}>
				{projects.map((project) => (
					<article key={project.id} className={styles.card}>
						<div className={styles.cardImageWrapper}>
							<Image
								src={project.image}
								alt={`${project.title} - Proyecto en GitHub`}
								className={styles.cardImage}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								onError={(e) => {
									const target = e.currentTarget as HTMLImageElement;
									target.src = `https://opengraph.github.com/api/og-image?title=${encodeURIComponent(project.title)}&theme=dark`;
								}}
							/>
						</div>
						<div className={styles.cardContent}>
							<h3 className={styles.cardTitle}>{project.title}</h3>
							<p className={styles.cardDescription}>{project.description}</p>

							{project.technologies.length > 0 && (
								<div className={styles.techs}>
									{project.technologies.map((tech) => {
										const Icon = getTechIcon(tech);
										return (
											<span
												key={tech}
												className={styles.techBadge}
												title={tech}
											>
												<Icon size={12} />
												{tech}
											</span>
										);
									})}
								</div>
							)}

							<div className={styles.cardFooter}>
								<div className={styles.stars}>
									<Gauge size={14} />
									{project.stars}
								</div>
								<div className={styles.links}>
									<a
										href={project.githubUrl}
										target="_blank"
										rel="noopener noreferrer"
										className={styles.link}
										title="Ver en GitHub"
										aria-label={`Ver ${project.title} en GitHub`}
									>
										<Link size={16} />
									</a>
									{project.demoUrl && (
										<a
											href={project.demoUrl}
											target="_blank"
											rel="noopener noreferrer"
											className={styles.link}
											title="Ver Demo"
											aria-label={`Ver demo de ${project.title}`}
										>
											<ExternalLink size={16} />
										</a>
									)}
									{isAdminUser && (
										<button
											type="button"
											onClick={() => handleDeleteProject(project.id)}
											className={styles.deleteBtn}
											title="Eliminar"
											aria-label={`Eliminar proyecto ${project.title}`}
										>
											<Trash2 size={16} />
										</button>
									)}
								</div>
							</div>
						</div>
					</article>
				))}
			</div>

			{projects.length === 0 && (
				<div className={styles.empty}>
					<Code size={48} />
					<p>No hay proyectos</p>
					<span>Agrega tu primer proyecto desde GitHub</span>
				</div>
			)}
		</div>
	);
}
