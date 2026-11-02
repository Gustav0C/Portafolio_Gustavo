"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/features/projects/types";
import { fetchProjects } from "@/features/projects/api";
import styles from "./FeaturedProjects.module.css";

export default function FeaturedProjects() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [fetchDone, setFetchDone] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
		fetchProjects()
			.then((data) => {
				setProjects(data.projects);
				setFetchDone(true);
			})
			.catch(() => {
				setFetchDone(true);
			});
	}, []);

	// Show only main applications on the landing page (commercial / mobile / private)
	const hasExplicitMainProjects = projects.some(
		(p) => p.isPrivate || p.category === "commercial" || !p.githubUrl,
	);

	const displayedProjects = hasExplicitMainProjects
		? projects.filter(
				(p) => p.isPrivate || p.category === "commercial" || !p.githubUrl,
		  )
		: projects.filter((p) => p.category !== "opensource");

	return (
		<section
			className={styles.section}
			aria-labelledby="featured-projects-heading"
		>
			<div className={styles.header}>
				<div className={styles.sectionTag}>
					{"// 03. PROYECTOS DESTACADOS"}
				</div>
				<h2 id="featured-projects-heading" className={styles.sectionTitle}>
					Software en Producción &amp; Casos de Estudio
				</h2>
				<p className={styles.sectionSubtitle}>
					Aplicaciones principales y sistemas desarrollados con foco en arquitectura sólida, velocidad y código limpio.
				</p>
			</div>

			{!mounted || !fetchDone ? (
				<div
					className={styles.loadingSkeleton}
					aria-label="Cargando proyectos..."
				>
					<div className={styles.skeletonCard} />
					<div className={styles.skeletonCard} />
				</div>
			) : displayedProjects.length > 0 ? (
				<div className={styles.grid}>
					{displayedProjects.map((project, i) => {
						const getDeviceType = (): "mobile" | "system" | "web" => {
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

						const deviceType = getDeviceType();

						return (
							<article key={project.id} className={styles.card}>
								{/* Screenshot: Phone (Mobile), Terminal (System/API), Laptop (Web) */}
								{project.image && (
									deviceType === "mobile" ? (
										<a
											href={
												project.demoUrl ||
												(!project.isPrivate && project.githubUrl
													? project.githubUrl
													: "#")
											}
											target={
												project.demoUrl ||
												(!project.isPrivate && project.githubUrl)
													? "_blank"
													: "_self"
											}
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
															alt={`Captura del proyecto ${project.title}`}
															fill
															sizes="220px"
															className={styles.mobileProjectImage}
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
											href={
												project.demoUrl ||
												(!project.isPrivate && project.githubUrl
													? project.githubUrl
													: "#")
											}
											target={
												project.demoUrl ||
												(!project.isPrivate && project.githubUrl)
													? "_blank"
													: "_self"
											}
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
															alt={`Captura del proyecto ${project.title}`}
															fill
															sizes="(max-width: 768px) 100vw, 50vw"
															className={styles.terminalProjectImage}
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
											href={
												project.demoUrl ||
												(!project.isPrivate && project.githubUrl
													? project.githubUrl
													: "#")
											}
											target={
												project.demoUrl ||
												(!project.isPrivate && project.githubUrl)
													? "_blank"
													: "_self"
											}
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
																alt={`Captura del proyecto ${project.title}`}
																fill
																sizes="(max-width: 768px) 100vw, 50vw"
																className={styles.laptopProjectImage}
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

								<div className={styles.cardBody}>
								<div className={styles.cardHeader}>
									<span className={styles.cardId}>
										[PRJ-{String(i + 1).padStart(2, "0")}]
									</span>
									{!project.isPrivate && project.stars > 0 && (
										<span className={styles.stars}>
											★ {project.stars}
										</span>
									)}
								</div>

								<h3 className={styles.cardTitle}>{project.title}</h3>
								<p className={styles.cardDesc}>{project.description}</p>

								{project.technologies.length > 0 && (
									<div className={styles.techList}>
										{project.technologies.map((tech) => (
											<span key={tech} className={styles.techTag}>
												<span className={styles.techPrompt} aria-hidden="true">
													&gt;
												</span>
												<span>{tech}</span>
											</span>
										))}
									</div>
								)}

								<div className={styles.cardFooter}>
									<div className={styles.cardLinks}>
										{project.githubUrl && !project.isPrivate && (
											<a
												href={project.githubUrl}
												target="_blank"
												rel="noopener noreferrer"
												className={styles.cardLink}
											>
												Repo
											</a>
										)}
										{project.demoUrl && (
											<a
												href={project.demoUrl}
												target="_blank"
												rel="noopener noreferrer"
												className={styles.cardDemoLink}
											>
												Demo &rarr;
											</a>
										)}
									</div>
								</div>
							</div>
						</article>
					);
				})}
				</div>
			) : (
				<div className={styles.emptyState}>
					<p className={styles.empty}>No hay proyectos destacados aún.</p>
				</div>
			)}

			{fetchDone && displayedProjects.length > 0 && (
				<div className={styles.sectionFooter}>
					<Link href="/proyectos" className={styles.sectionCta}>
						Ver más proyectos &rarr;
					</Link>
				</div>
			)}
		</section>
	);
}
