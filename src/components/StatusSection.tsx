import Link from "next/link";
import styles from "./StatusSection.module.css";

const statusLines = [
	{ label: "Estado:", value: "Disponible para nuevos proyectos" },
	{ label: "Respuesta:", value: "< 24h" },
	{ label: "Email:", value: "gcanales58@gmail.com" },
] as const;

export default function StatusSection() {
	return (
		<section className={styles.section} aria-labelledby="status-heading">
			<div className={styles.header}>
				<div className={styles.sectionTag}>
					{"// 04. DISPONIBILIDAD & CONTACTO"}
				</div>
				<h2 id="status-heading" className={styles.sectionTitle}>
					¿Tenés un proyecto o puesto en mente?
				</h2>
				<p className={styles.sectionSubtitle}>
					Hablemos de objetivos, arquitectura y cómo puedo ayudarte a construir software sólido desde el primer día.
				</p>
			</div>

			<div className={styles.statusCard}>
				<div className={styles.cardHeader}>
					<span className={styles.cardId}>[DISPATCH-ONLINE]</span>
					<div className={styles.badge}>
						<span className={styles.statusDot} aria-hidden="true" />
						<span>ICA, PE</span>
					</div>
				</div>

				<div className={styles.statusBlock}>
					{statusLines.map((line) => (
						<div key={line.label} className={styles.statusLine}>
							<span className={styles.statusPrompt} aria-hidden="true">
								&gt;
							</span>
							<span className={styles.statusLabel}>{line.label}</span>
							{line.label === "Email:" ? (
								<a
									href={`mailto:${line.value}`}
									className={styles.statusLink}
								>
									{line.value}
								</a>
							) : (
								<span className={styles.statusValue}>{line.value}</span>
							)}
						</div>
					))}
				</div>

				<div className={styles.cardFooter}>
					<Link href="/contacto" className={styles.cta}>
						Contactar &rarr;
					</Link>
				</div>
			</div>
		</section>
	);
}
