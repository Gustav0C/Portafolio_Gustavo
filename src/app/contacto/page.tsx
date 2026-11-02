"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Contacto() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
		website: "",
	});
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [submitted, setSubmitted] = useState(false);
	const [sending, setSending] = useState(false);
	const [serverError, setServerError] = useState<string | null>(null);

	// Guardamos el timestamp de carga para el anti-spam timing check
	const [loadTimestamp] = useState(() => Date.now());

	const activeErrorCount = Object.values(errors).filter(Boolean).length;
	const nameErrorId = errors.name ? "contact-name-error" : undefined;
	const emailErrorId = errors.email ? "contact-email-error" : undefined;
	const messageErrorId = errors.message ? "contact-message-error" : undefined;

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "El nombre es requerido";
		}

		if (!formData.email.trim()) {
			newErrors.email = "El email es requerido";
		} else if (!validateEmail(formData.email)) {
			newErrors.email = "Email inválido";
		}

		if (!formData.message.trim()) {
			newErrors.message = "El mensaje es requerido";
		} else if (formData.message.trim().length < 10) {
			newErrors.message = "El mensaje debe tener al menos 10 caracteres";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setServerError(null);

		if (!validate()) return;

		setSending(true);

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					loadTimestamp,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				setServerError(data.error || "Error al enviar el mensaje.");
				setSending(false);
				return;
			}

			setSubmitted(true);
			setFormData({ name: "", email: "", message: "", website: "" });
		} catch {
			setServerError("Error de conexión. Verificá tu internet e intentá de nuevo.");
		} finally {
			setSending(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[name];
				return next;
			});
		}
	};

	if (submitted) {
		return (
			<div className={styles.contacto}>
				<div className={styles.header}>
					<span className={styles.tag}>{"// 05. TRANSMISIÓN COMPLETADA"}</span>
					<h1 className={styles.title}>Contacto</h1>
				</div>

				<div className={styles.success} role="status" aria-live="polite">
					<div className={styles.successHeader}>
						<span className={styles.successTag}>[TRANSMISSION-CONFIRMED]</span>
						<span className={styles.successDot} aria-hidden="true" />
					</div>
					<p>¡Mensaje enviado!</p>
					<p className={styles.successText}>
						Gracias por contactarme. Te responderé pronto.
					</p>
					<div className={styles.successFooter}>
						<button
							onClick={() => {
								setSubmitted(false);
								setServerError(null);
								setErrors({});
							}}
							className={styles.btn}
						>
							Enviar otro mensaje
						</button>
						<Link href="/proyectos" className={styles.btnSecondary}>
							Ver Proyectos &rarr;
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.contacto}>
			{/* Page Header */}
			<div className={styles.header}>
				<div className={styles.tagGroup}>
					<span className={styles.tag}>{"// 05. DESPACHO & CANALES DIRECTOS"}</span>
					<div className={styles.statusPill}>
						<span className={styles.statusDot} aria-hidden="true" />
						<span>DISPONIBLE · ICA, PE</span>
					</div>
				</div>

				<h1 className={styles.title}>Contacto</h1>
				<p className={styles.subtitle}>
					¿Tienes preguntas o quieres trabajar juntos? Escríbeme.
				</p>
			</div>

			<p className={styles.srOnly} aria-live="polite" aria-atomic="true">
				{activeErrorCount > 0
					? `El formulario tiene ${activeErrorCount} error${activeErrorCount > 1 ? "es" : ""}.`
					: ""}
			</p>

			{/* Main Grid: Info + Form */}
			<div className={styles.grid}>
				{/* Column 1: Direct Information & Channels */}
				<aside className={styles.infoCol} aria-label="Información de contacto directo">
					<div className={styles.infoCard}>
						<div className={styles.cardHeader}>
							<span className={styles.cardPrompt}>[SYS-COMM // DIRECT]</span>
							<span className={styles.cardStatus}>ONLINE</span>
						</div>

						<div className={styles.channelList}>
							<div className={styles.channelItem}>
								<span className={styles.channelPrefix} aria-hidden="true">&gt;</span>
								<div className={styles.channelContent}>
									<span className={styles.channelLabel}>Email directo:</span>
									<a href="mailto:gcanales58@gmail.com" className={styles.channelLink}>
										gcanales58@gmail.com
									</a>
								</div>
							</div>

							<div className={styles.channelItem}>
								<span className={styles.channelPrefix} aria-hidden="true">&gt;</span>
								<div className={styles.channelContent}>
									<span className={styles.channelLabel}>Ubicación:</span>
									<span className={styles.channelValue}>Ica, Perú (GMT-5) · Remoto</span>
								</div>
							</div>

							<div className={styles.channelItem}>
								<span className={styles.channelPrefix} aria-hidden="true">&gt;</span>
								<div className={styles.channelContent}>
									<span className={styles.channelLabel}>Tiempo de respuesta:</span>
									<span className={styles.channelValue}>&lt; 24 horas</span>
								</div>
							</div>
						</div>

						<div className={styles.socialNav}>
							<span className={styles.socialTitle}>Perfiles Profesionales:</span>
							<div className={styles.socialPills}>
								<a
									href="https://github.com/Gustav0C"
									target="_blank"
									rel="noopener noreferrer"
									className={styles.socialPill}
								>
									<span className={styles.socialSymbol} aria-hidden="true">↗</span>
									<span>GitHub</span>
									<span className={styles.socialBadge}>@Gustav0C</span>
								</a>
								<a
									href="https://www.linkedin.com/in/gscp/"
									target="_blank"
									rel="noopener noreferrer"
									className={styles.socialPill}
								>
									<span className={styles.socialSymbol} aria-hidden="true">↗</span>
									<span>LinkedIn</span>
									<span className={styles.socialBadge}>in/gscp</span>
								</a>
							</div>
						</div>
					</div>

					<div className={styles.securityNote}>
						<span className={styles.securityDot} aria-hidden="true" />
						<span>
							Canal protegido con honeypot y verificación temporal anti-bot. Privacidad garantizada.
						</span>
					</div>
				</aside>

				{/* Column 2: Terminal Interactive Form */}
				<div className={styles.formCol}>
					<div className={styles.terminalCard}>
						<div className={styles.terminalHeader}>
							<div className={styles.terminalPrompt}>
								<span className={styles.promptArrow} aria-hidden="true">&gt;</span>
								<span>dispatch_message.ts --secure</span>
							</div>
							<div className={styles.terminalBadge}>
								<span>FORM_MODE: ACTIVE</span>
							</div>
						</div>

						<form className={styles.form} onSubmit={handleSubmit} noValidate>
							{/* Honeypot: invisible para humanos, los bots lo completan */}
							<div className={styles.honeypot} aria-hidden="true">
								<label htmlFor="website">No llenar</label>
								<input
									id="website"
									name="website"
									type="text"
									tabIndex={-1}
									autoComplete="off"
									value={formData.website || ""}
									onChange={(e) =>
										setFormData((prev) => ({ ...prev, website: e.target.value }))
									}
								/>
							</div>

							{serverError && (
								<div className={styles.serverError} role="alert">
									{serverError}
								</div>
							)}

							<div className={styles.formGroup}>
								<label htmlFor="name" className={styles.label}>
									Nombre
								</label>
								<input
									id="name"
									name="name"
									type="text"
									className={styles.input}
									placeholder="Tu nombre completo o empresa"
									value={formData.name}
									onChange={handleChange}
									aria-invalid={Boolean(errors.name)}
									aria-describedby={nameErrorId}
								/>
								{errors.name && (
									<p id="contact-name-error" className={styles.error} role="alert">
										{errors.name}
									</p>
								)}
							</div>

							<div className={styles.formGroup}>
								<label htmlFor="email" className={styles.label}>
									Email
								</label>
								<input
									id="email"
									name="email"
									type="email"
									className={styles.input}
									placeholder="tu@email.com"
									value={formData.email}
									onChange={handleChange}
									aria-invalid={Boolean(errors.email)}
									aria-describedby={emailErrorId}
								/>
								{errors.email && (
									<p id="contact-email-error" className={styles.error} role="alert">
										{errors.email}
									</p>
								)}
							</div>

							<div className={styles.formGroup}>
								<div className={styles.labelRow}>
									<label htmlFor="message" className={styles.label}>
										Mensaje
									</label>
									<span className={styles.charCount}>
										{formData.message.trim().length} caracteres (mín. 10)
									</span>
								</div>
								<textarea
									id="message"
									name="message"
									className={styles.textarea}
									placeholder="Describí los requerimientos de tu proyecto, vacante o consulta técnica..."
									value={formData.message}
									onChange={handleChange}
									aria-invalid={Boolean(errors.message)}
									aria-describedby={messageErrorId}
								/>
								{errors.message && (
									<p id="contact-message-error" className={styles.error} role="alert">
										{errors.message}
									</p>
								)}
							</div>

							<div className={styles.submitRow}>
								<button type="submit" className={styles.btn} disabled={sending}>
									{sending ? "Enviando..." : "Enviar Mensaje"}
								</button>
								<span className={styles.submitHint}>
									Presioná Enter o click para transmitir
								</span>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
