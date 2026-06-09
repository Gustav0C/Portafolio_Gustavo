"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "@/components/NavLinks";
import styles from "@/app/layout.module.css";

export default function MobileNav() {
	const [isOpen, setIsOpen] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

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
				// Shift + Tab - going backwards
				if (document.activeElement === firstElement) {
					event.preventDefault();
					lastElement?.focus();
				}
			} else {
				// Tab - going forwards
				if (document.activeElement === lastElement) {
					event.preventDefault();
					firstElement?.focus();
				}
			}
		};

		panel.addEventListener("keydown", handleTab);
		return () => {
			panel.removeEventListener("keydown", handleTab);
			// Restore focus to trigger element
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
				aria-controls="mobile-nav-links"
				aria-label={
					isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"
				}
				onClick={() => setIsOpen((prev) => !prev)}
			>
				{isOpen ? <X size={18} /> : <Menu size={18} />}
			</button>

			{isOpen && (
				<div
					ref={panelRef}
					className={styles.mobileMenuPanel}
					id="mobile-nav-links"
					role="dialog"
					aria-modal="true"
					aria-label="Menú de navegación"
				>
					<NavLinks
						id="mobile-nav-links"
						className={styles.mobileNavLinks}
						onNavigate={() => setIsOpen(false)}
					/>
				</div>
			)}
		</div>
	);
}
