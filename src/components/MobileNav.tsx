"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "@/components/NavLinks";
import styles from "@/app/layout.module.css";

export default function MobileNav() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const onEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsOpen(false);
			}
		};

		window.addEventListener("keydown", onEscape);
		return () => window.removeEventListener("keydown", onEscape);
	}, []);

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
				<div className={styles.mobileMenuPanel}>
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
