"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import styles from "@/app/layout.module.css";

const links = [
	{ href: "/", label: "Inicio", index: "01" },
	{ href: "/perfil", label: "Perfil", index: "02" },
	{ href: "/proyectos", label: "Proyectos", index: "03" },
	{ href: "/contacto", label: "Contacto", index: "04" },
];

export default function MobileNav() {
	const [isOpen, setIsOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);
	const pathname = usePathname();

	// Body scroll lock
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	// Focus trap when menu is open
	useEffect(() => {
		if (!isOpen) return;

		const panel = panelRef.current;
		if (!panel) return;

		// Store the element that had focus before opening
		previousActiveElement.current = document.activeElement as HTMLElement;

		// Get all focusable elements in the panel
		const focusableElements = panel.querySelectorAll<HTMLElement>(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		);

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		// Focus first element
		firstElement?.focus();

		const handleTab = (event: KeyboardEvent) => {
			if (event.key !== "Tab") return;

			if (event.shiftKey) {
				if (document.activeElement === firstElement) {
					event.preventDefault();
					lastElement?.focus();
				}
			} else {
				if (document.activeElement === lastElement) {
					event.preventDefault();
					firstElement?.focus();
				}
			}
		};

		panel.addEventListener("keydown", handleTab);
		return () => {
			panel.removeEventListener("keydown", handleTab);
			previousActiveElement.current?.focus();
		};
	}, [isOpen]);

	// Escape key handler
	useEffect(() => {
		const onEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		};

		window.addEventListener("keydown", onEscape);
		return () => window.removeEventListener("keydown", onEscape);
	}, [isOpen]);

	return (
		<div className={styles.mobileNavWrapper}>
			<button
				type="button"
				className={styles.mobileMenuButton}
				aria-expanded={isOpen}
				aria-controls="mobile-nav-panel"
				aria-label={
					isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
				}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				{isOpen ? <X size={18} /> : <Menu size={18} />}
			</button>

			{isOpen && (
				<>
					{/* Backdrop */}
					<div
						className={styles.mobileBackdrop}
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>

					{/* Fullscreen Panel */}
					<div
						ref={panelRef}
						className={styles.mobileMenuPanel}
						id="mobile-nav-panel"
						role="dialog"
						aria-modal="true"
						aria-label="Menú de navegación"
					>
						<div className={styles.mobilePanelHeader}>
							<span className={styles.mobilePanelTag}>
								{"// NAVEGACIÓN"}
							</span>
							<button
								type="button"
								className={styles.mobileMenuButton}
								aria-label="Cerrar menú de navegación"
								onClick={() => setIsOpen(false)}
							>
								<X size={18} />
							</button>
						</div>

						<nav className={styles.mobileNavLinks} aria-label="Navegación principal móvil">
							{links.map(({ href, label, index }) => {
								const isActive =
									href === "/" ? pathname === "/" : pathname.startsWith(href);
								return (
									<Link
										key={href}
										href={href}
										className={`${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ""}`}
										onClick={() => setIsOpen(false)}
									>
										<span className={styles.mobileNavIndex} aria-hidden="true">
											{index} {"//"}
										</span>
										<span className={styles.mobileNavLabel}>{label}</span>
										{isActive && (
											<span className={styles.mobileNavActive} aria-hidden="true">
												ACTIVE
											</span>
										)}
									</Link>
								);
							})}
						</nav>

						<div className={styles.mobilePanelFooter}>
							<div className={styles.mobilePanelStatus}>
								<span className={styles.statusDot} aria-hidden="true" />
								<span>ONLINE · ICA, PERÚ</span>
							</div>
							<div className={styles.mobilePanelLinks}>
								<a
									href="https://github.com/Gustav0C"
									target="_blank"
									rel="noopener noreferrer"
									className={styles.mobilePanelLink}
								>
									GitHub
								</a>
								<a
									href="https://www.linkedin.com/in/gscp/"
									target="_blank"
									rel="noopener noreferrer"
									className={styles.mobilePanelLink}
								>
									LinkedIn
								</a>
								<a
									href="mailto:gcanales58@gmail.com"
									className={styles.mobilePanelLink}
								>
									Email
								</a>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
