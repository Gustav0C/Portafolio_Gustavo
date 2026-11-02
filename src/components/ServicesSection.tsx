import Link from "next/link";
import styles from "./ServicesSection.module.css";

export default function ServicesSection() {
	return (
		<section className={styles.section} aria-labelledby="services-heading">
			{/* Section Header */}
			<div className={styles.header}>
				<div className={styles.sectionTag}>
					{"// 01. CAPACIDADES & SERVICIOS"}
				</div>
				<h2 id="services-heading" className={styles.sectionTitle}>
					Soluciones de Software &amp; Sistemas de IA
				</h2>
				<p className={styles.sectionSubtitle}>
					Ingeniería de software orientada a resultados: productos digitales escalables, automatizaciones inteligentes y código blindado para producción.
				</p>
			</div>

			{/* Bento Grid Asimétrico */}
			<div className={styles.bentoGrid}>
				{/* 1. Bloque Principal (Tarjeta Ancha Destacada) */}
				<article className={styles.featuredCard}>
					<div className={styles.cardMainContent}>
						<div className={styles.cardHeader}>
							<span className={styles.cardTag}>
								[01] FULL-STACK &amp; PRODUCTOS DIGITALES
							</span>
							<div className={styles.statusBadge} aria-hidden="true">
								<span className={styles.statusDot} />
								<span>ready for production</span>
							</div>
						</div>

						<h3 className={styles.featuredTitle}>
							Aplicaciones web y móviles escalables, desde la arquitectura inicial hasta producción.
						</h3>

						<ul className={styles.pointsList}>
							<li className={styles.pointItem}>
								<span className={styles.checkIcon} aria-hidden="true">✓</span>
								<span>MVPs funcionales en tiempo récord</span>
							</li>
							<li className={styles.pointItem}>
								<span className={styles.checkIcon} aria-hidden="true">✓</span>
								<span>Apps móviles nativas/cross-platform</span>
							</li>
							<li className={styles.pointItem}>
								<span className={styles.checkIcon} aria-hidden="true">✓</span>
								<span>Backend seguro y APIs de alto rendimiento</span>
							</li>
						</ul>

						<Link href="/contacto" className={styles.btnPrimaryCta}>
							<span>Cotizar proyecto</span>
							<span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
						</Link>
					</div>

					{/* Elemento visual decorativo: Micro simulación de terminal */}
					<div className={styles.terminalSim} aria-hidden="true">
						<div className={styles.terminalSimHeader}>
							<div className={styles.chromeDots}>
								<span className={styles.dot} />
								<span className={styles.dot} />
								<span className={styles.dot} />
							</div>
							<span className={styles.terminalSimTitle}>deploy.sh</span>
							<span className={styles.terminalSimStatus}>ACTIVE</span>
						</div>
						<div className={styles.terminalSimBody}>
							<div className={styles.simLine}>
								<span className={styles.simPrompt}>$</span>
								<span className={styles.simCmd}>deploy --env=production</span>
							</div>
							<div className={styles.simOutputSuccess}>
								✓ architecture: clean &amp; scalable
							</div>
							<div className={styles.simOutputSuccess}>
								✓ typecheck: 0 errors (strict mode)
							</div>
							<div className={styles.simOutputSuccess}>
								✓ performance: web vitals 100%
							</div>
							<div className={styles.simSummary}>
								STATUS: 100% OPERATIONAL
							</div>
						</div>
					</div>
				</article>

				{/* 2. Bloque Secundario: Agentes IA & Automatización */}
				<article className={styles.secondaryCard}>
					<div className={styles.cardHeader}>
						<span className={styles.cardTag}>
							[02] AGENTES IA &amp; AUTOMATIZACIÓN
						</span>
						<span className={styles.categoryBadge}>AI PIPELINES</span>
					</div>

					<h3 className={styles.cardTitle}>
						Flujos de trabajo autónomos y pipelines inteligentes para reducir horas operativas y costos manuales.
					</h3>

					<ul className={styles.pointsList}>
						<li className={styles.pointItem}>
							<span className={styles.checkIcon} aria-hidden="true">✓</span>
							<span>Agentes con tool-use y memoria</span>
						</li>
						<li className={styles.pointItem}>
							<span className={styles.checkIcon} aria-hidden="true">✓</span>
							<span>Pipelines RAG con datos del negocio</span>
						</li>
						<li className={styles.pointItem}>
							<span className={styles.checkIcon} aria-hidden="true">✓</span>
							<span>Automatización end-to-end</span>
						</li>
					</ul>

					<div className={styles.cardFooter}>
						<Link href="/contacto" className={styles.btnOutlineCta}>
							<span>Explorar soluciones</span>
							<span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				</article>

				{/* 3. Bloque de Especialidad: Auditoría & Rescate de Código IA */}
				<article className={styles.secondaryCard}>
					<div className={styles.cardHeader}>
						<span className={styles.cardTag}>
							[03] AUDITORÍA &amp; RESCATE DE CÓDIGO IA
						</span>
						<span className={styles.categoryBadge}>ESPECIALIDAD</span>
					</div>

					<h3 className={styles.cardTitle}>
						Blindaje técnico, tipado estricto y refactorización para prototipos o código generado por herramientas de IA.
					</h3>

					<ul className={styles.pointsList}>
						<li className={styles.pointItem}>
							<span className={styles.checkIcon} aria-hidden="true">✓</span>
							<span>De prototipo inestable a producción limpia</span>
						</li>
						<li className={styles.pointItem}>
							<span className={styles.checkIcon} aria-hidden="true">✓</span>
							<span>Tipado estricto y testing</span>
						</li>
						<li className={styles.pointItem}>
							<span className={styles.checkIcon} aria-hidden="true">✓</span>
							<span>Cero deuda técnica</span>
						</li>
					</ul>

					<div className={styles.cardFooter}>
						<Link href="/contacto" className={styles.btnOutlineCta}>
							<span>Solicitar auditoría</span>
							<span className={styles.ctaArrow} aria-hidden="true">&rarr;</span>
						</Link>
					</div>
				</article>
			</div>
		</section>
	);
}
