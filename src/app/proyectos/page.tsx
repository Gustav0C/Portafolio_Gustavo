"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ExternalLink, Plus, Trash2, Code, Upload, Sparkles, Pencil } from "lucide-react";
import styles from "./page.module.css";
import type { Project } from "@/features/projects/types";
import { getTechIcon } from "@/features/projects/tech-icons";
import {
	fetchProjects,
	getAdminToken,
	importProjectFromGitHub,
	persistProjects,
	validateAdminToken,
	uploadProjectImage,
} from "@/features/projects/api";

const GitHubIcon = () => (
	<svg
		width="15"
		height="15"
		viewBox="0 0 24 24"
		fill="currentColor"
		aria-hidden="true"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
		/>
	</svg>
);

type FilterTab = "all" | "commercial" | "opensource";
type FormMode = "manual" | "github";

export default function Proyectos() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [isAdminUser, setIsAdminUser] = useState(false);
	const [filterTab, setFilterTab] = useState<FilterTab>("all");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [adminError, setAdminError] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [adminHint, setAdminHint] = useState(false);
	const [adminPassword, setAdminPassword] = useState("");
	const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

	// Form mode (manual vs github)
	const [formMode, setFormMode] = useState<FormMode>("manual");

	// GitHub import mode state
	const [githubUrl, setGithubUrl] = useState("");

	// Manual mode form states
	const [manualTitle, setManualTitle] = useState("");
	const [manualDescription, setManualDescription] = useState("");
	const [manualProjectType, setManualProjectType] = useState<"mobile" | "web" | "system">("mobile");
	const [manualDemoUrl, setManualDemoUrl] = useState("");
	const [manualTechnologies, setManualTechnologies] = useState("");
	const [manualImageUrl, setManualImageUrl] = useState("");
	const [manualImageFile, setManualImageFile] = useState<File | null>(null);
	const [manualImagePreview, setManualImagePreview] = useState("");
	const [manualIsPrivate, setManualIsPrivate] = useState(true);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const adminHintId = "admin-hint-live";

	// Secret keyboard shortcut (Ctrl + Alt + 9) for admin token prompt
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.altKey && e.key === "9") {
				e.preventDefault();
				setAdminHint(true);
				const liveRegion = document.getElementById(adminHintId);
				if (liveRegion) {
					liveRegion.textContent =
						"Modo administrador activado. Ingresá el token para editar proyectos.";
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Initial fetch
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

	// Handle Image File selection for manual upload
	const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setManualImageFile(file);
		const reader = new FileReader();
		reader.onloadend = () => {
			setManualImagePreview(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	// Reset manual form fields
	const resetFormFields = () => {
		setEditingProjectId(null);
		setManualTitle("");
		setManualDescription("");
		setManualProjectType("mobile");
		setManualDemoUrl("");
		setManualTechnologies("");
		setManualImageUrl("");
		setManualImageFile(null);
		setManualImagePreview("");
		setManualIsPrivate(true);
		setGithubUrl("");
		setError("");
	};

	// Start editing a project
	const handleEditClick = (project: Project) => {
		setEditingProjectId(project.id);
		setFormMode("manual");
		setShowForm(true);

		setManualTitle(project.title);
		setManualDescription(project.description);
		setManualProjectType(project.projectType || "mobile");
		setManualDemoUrl(project.demoUrl || "");
		setManualTechnologies(project.technologies.join(", "));
		setManualImageUrl(project.image || "");
		setManualImagePreview(project.image || "");
		setManualIsPrivate(Boolean(project.isPrivate));
		setGithubUrl(project.githubUrl || "");
		setManualImageFile(null);
		setError("");

		window.scrollTo({ top: 120, behavior: "smooth" });
	};

	// Add Project from GitHub (Public repos)
	const handleAddGitHubProject = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!githubUrl.trim()) {
			setError("Ingresá una URL de GitHub válida");
			return;
		}

		if (!githubUrl.includes("github.com/")) {
			setError("Debe ser una URL de GitHub válida");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const importedProject = await importProjectFromGitHub(githubUrl);
			const newProject: Project = {
				...importedProject,
				isPrivate: false,
				category: "opensource",
			};

			const updatedProjects = [newProject, ...projects];
			await persistProjects(updatedProjects);

			setProjects(updatedProjects);
			resetFormFields();
			setShowForm(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al importar el proyecto");
		} finally {
			setLoading(false);
		}
	};

	// Add Project Manually (Private repos, Mobile apps, Client apps)
	const handleAddManualProject = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!manualTitle.trim()) {
			setError("El título del proyecto es obligatorio");
			return;
		}

		if (!manualDescription.trim()) {
			setError("La descripción del proyecto es obligatoria");
			return;
		}

		setLoading(true);
		setError("");

		try {
			let finalImageUrl = manualImageUrl.trim();

			// If file was selected, upload it via API
			if (manualImageFile) {
				try {
					finalImageUrl = await uploadProjectImage(manualImageFile);
				} catch {
					// Fallback to Base64 data URL if upload fails
					finalImageUrl = manualImagePreview || "";
				}
			}

			// If still no image provided, generate fallback OpenGraph image
			if (!finalImageUrl) {
				finalImageUrl = `https://opengraph.github.com/api/og-image?title=${encodeURIComponent(
					manualTitle.trim(),
				)}&theme=dark`;
			}

			const techArray = manualTechnologies
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean);

			let updatedProjects: Project[];

			if (editingProjectId) {
				updatedProjects = projects.map((p) => {
					if (p.id === editingProjectId) {
						return {
							...p,
							title: manualTitle.trim(),
							description: manualDescription.trim(),
							demoUrl: manualDemoUrl.trim() || undefined,
							image: finalImageUrl || p.image,
							technologies: techArray.length > 0 ? techArray : p.technologies,
							githubUrl: manualIsPrivate ? "" : (githubUrl.trim() || p.githubUrl),
							isPrivate: Boolean(manualIsPrivate),
							category: manualIsPrivate ? "commercial" : "opensource",
							projectType: manualProjectType,
						};
					}
					return p;
				});
			} else {
				const newProject: Project = {
					id: String(Date.now()),
					title: manualTitle.trim(),
					description: manualDescription.trim(),
					demoUrl: manualDemoUrl.trim() || undefined,
					image: finalImageUrl,
					technologies: techArray.length > 0 ? techArray : ["Software", "React"],
					stars: 0,
					githubUrl: manualIsPrivate ? "" : githubUrl.trim(),
					isPrivate: Boolean(manualIsPrivate),
					category: manualIsPrivate ? "commercial" : "opensource",
					projectType: manualProjectType,
				};
				updatedProjects = [newProject, ...projects];
			}

			await persistProjects(updatedProjects);

			setProjects(updatedProjects);
			resetFormFields();
			setShowForm(false);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error al guardar el proyecto");
		} finally {
			setLoading(false);
		}
	};

	// Delete Project
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

	// Admin Login
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

	// Categorize projects: Commercial/Privados FIRST, Open Source SECOND
	const commercialProjects = projects.filter(
		(p) => p.isPrivate || p.category === "commercial" || !p.githubUrl,
	);
	const openSourceProjects = projects.filter(
		(p) => !p.isPrivate && Boolean(p.githubUrl) && p.category !== "commercial",
	);

	// Helper to determine device mockup type: mobile (celular), system (terminal), or web (laptop)
	const getProjectDeviceType = (project: Project): "mobile" | "system" | "web" => {
		if (project.projectType === "mobile") return "mobile";
		if (project.projectType === "system") return "system";
		if (project.projectType === "web") return "web";

		if (
			project.technologies.some((t) =>
				/react native|flutter|android|ios|swift|kotlin|mobile|expo/i.test(t),
			)
		) {
			return "mobile";
		}

		if (
			project.technologies.some((t) =>
				/api|fastapi|backend|system|mcp|grpc|cli|terminal/i.test(t),
			)
		) {
			return "system";
		}

		return "web";
	};

	// Helper to render a project card
	const renderProjectCard = (project: Project, index: number) => {
		const deviceType = getProjectDeviceType(project);

		return (
			<article key={project.id} className={styles.card}>
				{/* Screenshot Header: Phone (Mobile), Terminal (System/API), Laptop (Web) */}
				{project.image && (
					deviceType === "mobile" ? (
						<a
							href={project.demoUrl || (project.githubUrl && !project.isPrivate ? project.githubUrl : "#")}
							target={project.demoUrl || (project.githubUrl && !project.isPrivate) ? "_blank" : "_self"}
							rel="noopener noreferrer"
							className={styles.mobileCardImageWrapper}
							aria-label={`Ver proyecto ${project.title}`}
							tabIndex={-1}
						>
							<div className={styles.mobileDeviceBar} aria-hidden="true">
								<span className={styles.mobileDeviceBadge}>📱 APP MÓVIL</span>
								<span className={styles.mobileDeviceStatus}>NATIVE PREVIEW</span>
							</div>
							<div className={styles.mobileFrameContainer}>
								<div className={styles.phoneMockup}>
									<div className={styles.phoneSpeaker} aria-hidden="true">
										<span className={styles.phoneCamera} />
									</div>
									<div className={styles.phoneScreen}>
										<Image
											src={project.image}
											alt={`${project.title} - Captura de app móvil`}
											className={styles.mobileProjectImage}
											fill
											sizes="220px"
											onError={(e) => {
												const target = e.currentTarget as HTMLImageElement;
												target.src = `https://opengraph.github.com/api/og-image?title=${encodeURIComponent(
													project.title,
												)}&theme=dark`;
											}}
										/>
									</div>
								</div>
							</div>
						</a>
					) : deviceType === "system" ? (
						<a
							href={project.demoUrl || (project.githubUrl && !project.isPrivate ? project.githubUrl : "#")}
							target={project.demoUrl || (project.githubUrl && !project.isPrivate) ? "_blank" : "_self"}
							rel="noopener noreferrer"
							className={styles.terminalCardImageWrapper}
							aria-label={`Ver proyecto ${project.title}`}
							tabIndex={-1}
						>
							<div className={styles.terminalDeviceBar} aria-hidden="true">
								<span className={styles.terminalDeviceBadge}>⚡ SISTEMA / API</span>
								<span className={styles.terminalDeviceStatus}>
									{project.demoUrl
										? project.demoUrl.replace(/^https?:\/\//, "")
										: `github.com/Gustav0C/${project.title}`}
								</span>
							</div>
							<div className={styles.terminalFrameContainer}>
								<div className={styles.terminalMockup}>
									<div className={styles.terminalWindowBar} aria-hidden="true">
										<div className={styles.chromeDots}>
											<span className={styles.dot} />
											<span className={styles.dot} />
											<span className={styles.dot} />
										</div>
										<span className={styles.terminalWindowTitle}>
											{`api@gscp-sys: ~/${project.title.toLowerCase()}`}
										</span>
										<span className={styles.terminalWindowBadge}>CLI / API</span>
									</div>
									<div className={styles.terminalDisplay}>
										<Image
											src={project.image}
											alt={`${project.title} - Captura de terminal o sistema`}
											className={styles.terminalProjectImage}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											onError={(e) => {
												const target = e.currentTarget as HTMLImageElement;
												target.src = `https://opengraph.github.com/api/og-image?title=${encodeURIComponent(
													project.title,
												)}&theme=dark`;
											}}
										/>
									</div>
								</div>
							</div>
						</a>
					) : (
						<a
							href={project.demoUrl || (project.githubUrl && !project.isPrivate ? project.githubUrl : "#")}
							target={project.demoUrl || (project.githubUrl && !project.isPrivate) ? "_blank" : "_self"}
							rel="noopener noreferrer"
							className={styles.laptopCardImageWrapper}
							aria-label={`Ver proyecto ${project.title}`}
							tabIndex={-1}
						>
							<div className={styles.laptopDeviceBar} aria-hidden="true">
								<span className={styles.laptopDeviceBadge}>💻 WEB APP</span>
								<span className={styles.laptopDeviceStatus}>
									{project.demoUrl
										? project.demoUrl.replace(/^https?:\/\//, "")
										: `github.com/Gustav0C/${project.title}`}
								</span>
							</div>
							<div className={styles.laptopFrameContainer}>
								<div className={styles.laptopMockup}>
									<div className={styles.laptopScreen}>
										<div className={styles.laptopCamera} aria-hidden="true" />
										<div className={styles.laptopBrowserBar} aria-hidden="true">
											<div className={styles.chromeDots}>
												<span className={styles.dot} />
												<span className={styles.dot} />
												<span className={styles.dot} />
											</div>
											<span className={styles.laptopUrlBar}>
												{project.demoUrl
													? project.demoUrl.replace(/^https?:\/\//, "")
													: "https://localhost:3000"}
											</span>
										</div>
										<div className={styles.laptopDisplay}>
											<Image
												src={project.image}
												alt={`${project.title} - Captura de pantalla`}
												className={styles.laptopProjectImage}
												fill
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
												onError={(e) => {
													const target = e.currentTarget as HTMLImageElement;
													target.src = `https://opengraph.github.com/api/og-image?title=${encodeURIComponent(
														project.title,
													)}&theme=dark`;
												}}
											/>
										</div>
									</div>
									<div className={styles.laptopBase} aria-hidden="true">
										<div className={styles.laptopNotch} />
									</div>
								</div>
							</div>
						</a>
					)
				)}

				<div className={styles.cardContent}>
					<div className={styles.cardMeta}>
						<span className={styles.cardId}>
							[PRJ-{String(index + 1).padStart(2, "0")}]
						</span>
						{!project.isPrivate && project.stars > 0 && (
							<span className={styles.cardTypeBadge}>
								★ {project.stars}
							</span>
						)}
					</div>

					<h3 className={styles.cardTitle}>{project.title}</h3>
					<p className={styles.cardDescription}>{project.description}</p>

					{project.technologies.length > 0 && (
						<div className={styles.techs}>
							{project.technologies.map((tech) => {
								const Icon = getTechIcon(tech);
								return (
									<span key={tech} className={styles.techBadge} title={tech}>
										<Icon size={12} aria-hidden="true" />
										{tech}
									</span>
								);
							})}
						</div>
					)}

					<div className={styles.cardFooter}>
						<div className={styles.links}>
							{/* Only show GitHub link if repo is public */}
							{project.githubUrl && !project.isPrivate && (
								<a
									href={project.githubUrl}
									target="_blank"
									rel="noopener noreferrer"
									className={styles.link}
									title="Ver en GitHub"
									aria-label={`Ver ${project.title} en GitHub`}
								>
									<GitHubIcon />
									<span>Repo</span>
								</a>
							)}

							{/* Show Demo if available */}
							{project.demoUrl && (
								<a
									href={project.demoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className={styles.demoLink}
									title="Ver Demo en Vivo"
									aria-label={`Ver demo de ${project.title}`}
								>
									<span>Demo en vivo</span>
									<ExternalLink size={13} aria-hidden="true" />
								</a>
							)}

							{/* Admin action buttons */}
							{isAdminUser && (
								<>
									<button
										type="button"
										onClick={() => handleEditClick(project)}
										className={styles.editBtn}
										title="Editar proyecto"
										aria-label={`Editar proyecto ${project.title}`}
									>
										<Pencil size={14} aria-hidden="true" />
										<span>Editar</span>
									</button>
									<button
										type="button"
										onClick={() => handleDeleteProject(project.id)}
										className={styles.deleteBtn}
										title="Eliminar proyecto"
										aria-label={`Eliminar proyecto ${project.title}`}
									>
										<Trash2 size={14} aria-hidden="true" />
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</article>
		);
	};

	return (
		<div className={styles.proyectos}>
			{/* Page Header */}
			<div className={styles.header}>
				<div>
					<div className={styles.sectionTag}>
						{"// INVENTARIO DE SOFTWARE & SISTEMAS"}
					</div>
					<h1 className={styles.title}>Proyectos &amp; Aplicaciones</h1>
					<p className={styles.subtitle}>
						Sistemas comerciales, aplicaciones móviles y herramientas de código abierto construidas para producción.
					</p>
				</div>

				{/* Admin Login shortcut container */}
				<div
					id={adminHintId}
					aria-live="polite"
					aria-atomic="true"
					className={styles.liveRegion}
				/>

				{adminHint && !isAdminUser && (
					<div className={styles.adminLogin}>
						<input
							type="password"
							placeholder="Token admin"
							className={styles.adminInput}
							value={adminPassword}
							onChange={(e) => setAdminPassword(e.target.value)}
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
							<p className={styles.adminError} role="alert">
								{adminError}
							</p>
						)}
					</div>
				)}

				{isAdminUser && (
					<button
						type="button"
						onClick={() => {
							if (showForm) {
								resetFormFields();
								setShowForm(false);
							} else {
								resetFormFields();
								setShowForm(true);
							}
						}}
						className={styles.addBtn}
					>
						<Plus size={16} />
						{showForm ? (editingProjectId ? "Cancelar Edición" : "Cerrar Formulario") : "Agregar Proyecto"}
					</button>
				)}
			</div>

			{/* Filter Tabs */}
			<div className={styles.filterBar}>
				<button
					type="button"
					className={`${styles.filterTab} ${filterTab === "all" ? styles.filterTabActive : ""}`}
					onClick={() => setFilterTab("all")}
				>
					Todos ({projects.length})
				</button>
				<button
					type="button"
					className={`${styles.filterTab} ${filterTab === "commercial" ? styles.filterTabActive : ""}`}
					onClick={() => setFilterTab("commercial")}
				>
					Aplicaciones Principales ({commercialProjects.length})
				</button>
				<button
					type="button"
					className={`${styles.filterTab} ${filterTab === "opensource" ? styles.filterTabActive : ""}`}
					onClick={() => setFilterTab("opensource")}
				>
					Open Source ({openSourceProjects.length})
				</button>
			</div>

			{/* Admin Add / Edit Project Form */}
			{showForm && isAdminUser && (
				<div className={styles.formContainer}>
					{!editingProjectId && (
						<div className={styles.formModeSelector}>
							<button
								type="button"
								className={`${styles.modeBtn} ${formMode === "manual" ? styles.modeBtnActive : ""}`}
								onClick={() => setFormMode("manual")}
							>
								<Sparkles size={16} />
								<span>Carga Manual / App Móvil / Privado</span>
							</button>
							<button
								type="button"
								className={`${styles.modeBtn} ${formMode === "github" ? styles.modeBtnActive : ""}`}
								onClick={() => setFormMode("github")}
							>
								<GitHubIcon />
								<span>Importar de GitHub (Público)</span>
							</button>
						</div>
					)}

					{/* Manual Form */}
					{formMode === "manual" && (
						<form className={styles.form} onSubmit={handleAddManualProject} noValidate>
							<h2 className={styles.formTitle}>
								{editingProjectId ? "Editar Proyecto" : "Nuevo Proyecto (Carga Manual)"}
							</h2>

							<div className={styles.formGrid}>
								<div className={styles.formGroup}>
									<label htmlFor="manualTitle" className={styles.label}>
										Título del Proyecto *
									</label>
									<input
										id="manualTitle"
										type="text"
										className={styles.input}
										placeholder="Ej: FoodDelivery App / Sistema POS"
										value={manualTitle}
										onChange={(e) => setManualTitle(e.target.value)}
										disabled={loading}
									/>
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="manualProjectType" className={styles.label}>
										Tipo de Proyecto
									</label>
									<select
										id="manualProjectType"
										className={styles.select}
										value={manualProjectType}
										onChange={(e) =>
											setManualProjectType(
												e.target.value as "mobile" | "web" | "system",
											)
										}
										disabled={loading}
									>
										<option value="mobile">App Móvil (React Native / Flutter / Android)</option>
										<option value="web">Web App / SaaS Comercial</option>
										<option value="system">Sistema / API / AI Backend</option>
									</select>
								</div>
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="manualDescription" className={styles.label}>
									Descripción del Proyecto *
								</label>
								<textarea
									id="manualDescription"
									rows={3}
									className={styles.textarea}
									placeholder="Describe la solución, el impacto y qué problema resuelve..."
									value={manualDescription}
									onChange={(e) => setManualDescription(e.target.value)}
									disabled={loading}
								/>
							</div>

							<div className={styles.formGrid}>
								<div className={styles.formGroup}>
									<label htmlFor="manualDemoUrl" className={styles.label}>
										URL de la Demo en Vivo (opcional)
									</label>
									<input
										id="manualDemoUrl"
										type="url"
										className={styles.input}
										placeholder="https://tudemo.vercel.app (dejar vacío si es app móvil sin landing)"
										value={manualDemoUrl}
										onChange={(e) => setManualDemoUrl(e.target.value)}
										disabled={loading}
									/>
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="manualTechnologies" className={styles.label}>
										Tecnologías (separadas por coma)
									</label>
									<input
										id="manualTechnologies"
										type="text"
										className={styles.input}
										placeholder="React Native, TypeScript, Supabase, Expo"
										value={manualTechnologies}
										onChange={(e) => setManualTechnologies(e.target.value)}
										disabled={loading}
									/>
								</div>
							</div>

							{/* Photo / Screenshot Upload */}
							<div className={styles.formGroup}>
								<label className={styles.label}>
									Captura / Foto del Proyecto *
								</label>
								<div className={styles.uploadBox}>
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										className={styles.fileInput}
										onChange={handleImageFileChange}
										disabled={loading}
									/>
									<button
										type="button"
										className={styles.uploadTriggerBtn}
										onClick={() => fileInputRef.current?.click()}
										disabled={loading}
									>
										<Upload size={16} />
										<span>{manualImageFile ? manualImageFile.name : "Subir foto desde tu computadora"}</span>
									</button>

									<span className={styles.uploadOr}>o ingresá una URL directa:</span>
									<input
										type="url"
										className={styles.inputCompact}
										placeholder="https://tudominio.com/captura.png"
										value={manualImageUrl}
										onChange={(e) => {
											setManualImageUrl(e.target.value);
											setManualImagePreview(e.target.value);
										}}
										disabled={loading}
									/>
								</div>

								{manualImagePreview && (
									<div className={styles.previewContainer}>
										<span className={styles.previewLabel}>
											Vista previa ({manualProjectType === "mobile" ? "Formato Celular / App Móvil" : manualProjectType === "system" ? "Formato Terminal / API" : "Formato Laptop / Web App"}):
										</span>
										{manualProjectType === "mobile" ? (
											<div className={styles.mobilePreviewWrapper}>
												<div className={styles.phoneMockup}>
													<div className={styles.phoneSpeaker} aria-hidden="true">
														<span className={styles.phoneCamera} />
													</div>
													<div className={styles.phoneScreen}>
														{/* eslint-disable-next-line @next/next/no-img-element */}
														<img
															src={manualImagePreview}
															alt="Vista previa de app móvil"
															className={styles.mobileProjectImage}
														/>
													</div>
												</div>
											</div>
										) : manualProjectType === "system" ? (
											<div className={styles.terminalPreviewWrapper}>
												<div className={styles.terminalMockup}>
													<div className={styles.terminalWindowBar} aria-hidden="true">
														<div className={styles.chromeDots}>
															<span className={styles.dot} />
															<span className={styles.dot} />
															<span className={styles.dot} />
														</div>
														<span className={styles.terminalWindowTitle}>
															{manualTitle ? `api@gscp-sys: ~/${manualTitle.toLowerCase()}` : "api@gscp-sys: ~/system"}
														</span>
														<span className={styles.terminalWindowBadge}>CLI / API</span>
													</div>
													<div className={styles.terminalDisplay}>
														{/* eslint-disable-next-line @next/next/no-img-element */}
														<img
															src={manualImagePreview}
															alt="Vista previa de terminal o sistema"
															className={styles.terminalProjectImage}
														/>
													</div>
												</div>
											</div>
										) : (
											<div className={styles.laptopPreviewWrapper}>
												<div className={styles.laptopMockup}>
													<div className={styles.laptopScreen}>
														<div className={styles.laptopCamera} aria-hidden="true" />
														<div className={styles.laptopBrowserBar} aria-hidden="true">
															<div className={styles.chromeDots}>
																<span className={styles.dot} />
																<span className={styles.dot} />
																<span className={styles.dot} />
															</div>
															<span className={styles.laptopUrlBar}>
																{manualDemoUrl ? manualDemoUrl.replace(/^https?:\/\//, "") : "https://localhost:3000"}
															</span>
														</div>
														<div className={styles.laptopDisplay}>
															{/* eslint-disable-next-line @next/next/no-img-element */}
															<img
																src={manualImagePreview}
																alt="Vista previa de web"
																className={styles.laptopProjectImage}
															/>
														</div>
													</div>
													<div className={styles.laptopBase} aria-hidden="true">
														<div className={styles.laptopNotch} />
													</div>
												</div>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Private project checkbox */}
							<div className={styles.checkboxGroup}>
								<label className={styles.checkboxLabel}>
									<input
										type="checkbox"
										checked={manualIsPrivate}
										onChange={(e) => setManualIsPrivate(e.target.checked)}
										className={styles.checkbox}
									/>
									<span>Proyecto Privado (no mostrar botón a repositorio GitHub público)</span>
								</label>
							</div>

							{error && <p className={styles.error}>{error}</p>}

							<div className={styles.formActions}>
								<button type="submit" className={styles.submitBtn} disabled={loading}>
									{loading
										? "Guardando..."
										: editingProjectId
										? "Actualizar Proyecto"
										: "Guardar Proyecto"}
								</button>
								{editingProjectId && (
									<button
										type="button"
										onClick={() => {
											resetFormFields();
											setShowForm(false);
										}}
										className={styles.cancelBtn}
										disabled={loading}
									>
										Cancelar Edición
									</button>
								)}
							</div>
						</form>
					)}

					{/* GitHub Import Form */}
					{formMode === "github" && (
						<form className={styles.form} onSubmit={handleAddGitHubProject} noValidate>
							<h2 className={styles.formTitle}>Importar desde GitHub (Repositorio Público)</h2>
							<div className={styles.formGroup}>
								<label htmlFor="githubUrl" className={styles.label}>
									URL del Repositorio de GitHub
								</label>
								<input
									id="githubUrl"
									type="url"
									className={styles.input}
									placeholder="https://github.com/Gustav0C/repositorio"
									value={githubUrl}
									onChange={(e) => setGithubUrl(e.target.value)}
									disabled={loading}
								/>
							</div>

							{error && <p className={styles.error}>{error}</p>}

							<button type="submit" className={styles.submitBtn} disabled={loading}>
								{loading ? "Importando..." : "Importar Proyecto"}
							</button>
						</form>
					)}
				</div>
			)}

			{/* Project Lists: Normal/Commercial Projects FIRST, Open Source SECOND */}
			{projects.length > 0 ? (
				<div className={styles.sectionsContainer}>
					{/* Commercial / Mobile / Main Projects Section */}
					{(filterTab === "all" || filterTab === "commercial") && commercialProjects.length > 0 && (
						<section className={styles.subSection} aria-label="Aplicaciones & Proyectos Principales">
							<div className={styles.subHeader}>
								<span className={styles.subTag}>{"// 01. APLICACIONES & PROYECTOS PRINCIPALES"}</span>
								<h2 className={styles.subTitle}>Sistemas Comerciales &amp; Apps Móviles</h2>
							</div>
							<div className={styles.grid}>
								{commercialProjects.map((project, i) => renderProjectCard(project, i))}
							</div>
						</section>
					)}

					{/* Open Source Projects Section */}
					{(filterTab === "all" || filterTab === "opensource") && openSourceProjects.length > 0 && (
						<section className={styles.subSection} aria-label="Proyectos Open Source">
							<div className={styles.subHeader}>
								<span className={styles.subTag}>{"// 02. ECOSISTEMA OPEN SOURCE"}</span>
								<h2 className={styles.subTitle}>Repositorios Públicos &amp; Herramientas</h2>
							</div>
							<div className={styles.grid}>
								{openSourceProjects.map((project, i) =>
									renderProjectCard(project, commercialProjects.length + i),
								)}
							</div>
						</section>
					)}
				</div>
			) : (
				<div className={styles.empty}>
					<Code size={48} />
					<p>No hay proyectos cargados aún.</p>
				</div>
			)}
		</div>
	);
}
