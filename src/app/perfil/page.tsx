import Image from "next/image";
import Link from "next/link";
import TechIcon from "@/components/TechIcon";
import { profileData } from "@/data/profile";
import styles from "./page.module.css";

export default function Perfil() {
	return (
		<div className={styles.profile}>
			{/* Identity Header */}
			<header className={styles.header}>
				<div className={styles.avatarWrapper}>
					<div className={styles.avatar}>
						<Image
							src={profileData.avatarUrl}
							alt={`${profileData.name} - ${profileData.role}`}
							fill
							sizes="140px"
							priority
							className={styles.avatarImage}
						/>
					</div>
					<div className={styles.avatarStatus} aria-label="Estado activo">
						<span className={styles.statusDot} aria-hidden="true" />
						<span>{profileData.statusBadge}</span>
					</div>
				</div>

				<div className={styles.identity}>
					<div className={styles.statusBadge}>
						<span className={styles.statusDot} aria-hidden="true" />
						<span className={styles.statusText}>
							{profileData.status} · {profileData.location.toUpperCase()}
						</span>
					</div>

					<h1 className={styles.name}>{profileData.name}</h1>
					<p className={styles.role}>{profileData.role}</p>

					<div className={styles.promptLine} aria-hidden="true">
						<span className={styles.promptSymbol}>&gt;</span>
						<span className={styles.promptCommand}>
							{profileData.handle} --status=active --domain=fullstack+ai
						</span>
					</div>

					<p className={styles.bio}>{profileData.bio}</p>

					<div className={styles.actions}>
						<Link href="/contacto" className={styles.btnPrimary}>
							Contactar
						</Link>
						<Link href="/proyectos" className={styles.btnSecondary}>
							Ver Proyectos
						</Link>
					</div>

					{/* Direct Links Bar */}
					<nav className={styles.linksNav} aria-label="Enlaces directos">
						{profileData.links.map((link) => {
							const isExternal = link.kind === "external" || link.kind === "email";
							return isExternal ? (
								<a
									key={link.id}
									href={link.url}
									className={styles.linkPill}
									target={link.kind === "external" ? "_blank" : undefined}
									rel={link.kind === "external" ? "noopener noreferrer" : undefined}
								>
									<span className={styles.linkPrefix} aria-hidden="true">
										{link.kind === "email" ? "@" : "↗"}
									</span>
									<span className={styles.linkLabel}>{link.label}</span>
									{link.badge && (
										<span className={styles.linkBadge}>{link.badge}</span>
									)}
								</a>
							) : (
								<Link key={link.id} href={link.url} className={styles.linkPill}>
									<span className={styles.linkPrefix} aria-hidden="true">
										/
									</span>
									<span className={styles.linkLabel}>{link.label}</span>
								</Link>
							);
						})}
					</nav>
				</div>
			</header>

			{/* Telemetry Bar */}
			<section className={styles.telemetryBar} aria-label="Telemetría de perfil">
				{profileData.telemetry.map((item) => (
					<div key={item.label} className={styles.telemetryItem}>
						<span className={styles.telemetryLabel}>{item.label}</span>
						<span className={styles.telemetryValue}>{item.value}</span>
					</div>
				))}
			</section>

			{/* Engineering Philosophy Section */}
			<section className={styles.section} aria-labelledby="principles-heading">
				<div className={styles.sectionHeader}>
					<span className={styles.sectionTag}>{"// 01. FILOSOFÍA DE INGENIERÍA"}</span>
					<h2 id="principles-heading" className={styles.sectionTitle}>
						Criterio &amp; Filosofía Técnica
					</h2>
					<p className={styles.sectionSubtitle}>
						Principios de arquitectura y buenas prácticas que guían cada línea de código que escribo.
					</p>
				</div>

				<div className={styles.principlesGrid}>
					{profileData.principles.map((principle) => (
						<article key={principle.id} className={styles.principleCard}>
							<div className={styles.principleHeader}>
								<span className={styles.principleIndex}>
									{principle.index} {"//"}
								</span>
								<h3 className={styles.principleTitle}>{principle.title}</h3>
							</div>
							<p className={styles.principleDesc}>{principle.description}</p>
						</article>
					))}
				</div>
			</section>

			{/* Experience Section */}
			<section className={styles.section} aria-labelledby="experience-heading">
				<div className={styles.sectionHeader}>
					<span className={styles.sectionTag}>{"// 02. TRAYECTORIA PROFESIONAL"}</span>
					<h2 id="experience-heading" className={styles.sectionTitle}>
						Experiencia &amp; Trayectoria
					</h2>
					<p className={styles.sectionSubtitle}>
						Construcción de software en producción, optimización continua e impacto medible.
					</p>
				</div>

				<div className={styles.timeline}>
					{profileData.experience.map((item) => (
						<article key={item.id} className={styles.timelineCard}>
							<div className={styles.timelineMeta}>
								<span className={styles.timelinePeriod}>{item.period}</span>
								<span className={styles.timelineLocation}>{item.location}</span>
							</div>

							<div className={styles.timelineBody}>
								<div className={styles.timelineHeader}>
									<h3 className={styles.timelineRole}>{item.role}</h3>
									<p className={styles.timelineCompany}>{item.company}</p>
								</div>

								<ul className={styles.highlightsList}>
									{item.highlights.map((highlight, idx) => (
										<li key={idx} className={styles.highlightItem}>
											<span className={styles.bulletSymbol} aria-hidden="true">
												&gt;
											</span>
											<span>{highlight}</span>
										</li>
									))}
								</ul>

								<div className={styles.techPills}>
									{item.technologies.map((tech) => (
										<span key={tech} className={styles.techPill}>
											{tech}
										</span>
									))}
								</div>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Technical Arsenal Section */}
			<section className={styles.section} aria-labelledby="skills-heading">
				<div className={styles.sectionHeader}>
					<span className={styles.sectionTag}>{"// 03. ARSENAL TÉCNICO & DOMINIO"}</span>
					<h2 id="skills-heading" className={styles.sectionTitle}>
						Arsenal Técnico
					</h2>
					<p className={styles.sectionSubtitle}>
						Herramientas, frameworks y librerías que domino para frontend, backend e inteligencia artificial.
					</p>
				</div>

				<div className={styles.skillsGrid}>
					{profileData.skills.map((category) => (
						<article key={category.id} className={styles.skillCategoryCard}>
							<div className={styles.categoryHeader}>
								<div className={styles.categoryTitleGroup}>
									<span className={styles.categoryIndex}>
										{category.index} {"//"}
									</span>
									<h3 className={styles.categoryTitle}>{category.title}</h3>
								</div>
								<p className={styles.categoryDesc}>{category.description}</p>
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

			{/* Education Section */}
			<section className={styles.section} aria-labelledby="education-heading">
				<div className={styles.sectionHeader}>
					<span className={styles.sectionTag}>{"// 04. FORMACIÓN & APRENDIZAJE"}</span>
					<h2 id="education-heading" className={styles.sectionTitle}>
						Educación &amp; Formación
					</h2>
					<p className={styles.sectionSubtitle}>
						Bases académicas sólidas complementadas con investigación autodidacta continua.
					</p>
				</div>

				<div className={styles.educationGrid}>
					{profileData.education.map((item) => (
						<article key={item.id} className={styles.educationCard}>
							<div className={styles.educationMeta}>
								<span className={styles.educationPeriod}>{item.period}</span>
							</div>
							<div className={styles.educationContent}>
								<h3 className={styles.educationTitle}>{item.title}</h3>
								<p className={styles.educationInstitution}>{item.institution}</p>
								<p className={styles.educationDesc}>{item.description}</p>
							</div>
						</article>
					))}
				</div>
			</section>

			{/* Contact & Availability Terminal Card */}
			<section className={styles.dispatchSection} aria-labelledby="dispatch-heading">
				<div className={styles.dispatchCard}>
					<div className={styles.dispatchHeader}>
						<span className={styles.dispatchPrompt}>[DISPATCH-ONLINE]</span>
						<div className={styles.dispatchBadge}>
							<span className={styles.statusDot} aria-hidden="true" />
							<span>ICA, PERÚ · REMOTO</span>
						</div>
					</div>

					<div className={styles.dispatchBody}>
						<h2 id="dispatch-heading" className={styles.dispatchTitle}>
							¿Listo para construir software de alto impacto?
						</h2>
						<p className={styles.dispatchText}>
							Disponible para roles de ingeniería, consultorías y proyectos desafiantes. Hablemos de requerimientos, arquitectura y cómo puedo sumar valor a tu equipo.
						</p>

						<div className={styles.dispatchLines}>
							<div className={styles.dispatchLine}>
								<span className={styles.lineSymbol} aria-hidden="true">&gt;</span>
								<span className={styles.lineLabel}>Email directo:</span>
								<a href="mailto:gcanales58@gmail.com" className={styles.lineLink}>
									gcanales58@gmail.com
								</a>
							</div>
							<div className={styles.dispatchLine}>
								<span className={styles.lineSymbol} aria-hidden="true">&gt;</span>
								<span className={styles.lineLabel}>Disponibilidad:</span>
								<span className={styles.lineValue}>Inmediata para nuevos proyectos</span>
							</div>
							<div className={styles.dispatchLine}>
								<span className={styles.lineSymbol} aria-hidden="true">&gt;</span>
								<span className={styles.lineLabel}>Tiempo de respuesta:</span>
								<span className={styles.lineValue}>Menos de 24 horas</span>
							</div>
						</div>

						<div className={styles.dispatchFooter}>
							<Link href="/contacto" className={styles.btnPrimary}>
								Ir al Formulario de Contacto &rarr;
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
