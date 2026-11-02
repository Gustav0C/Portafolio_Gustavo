"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.css";

type NavLinksProps = {
	className?: string;
	onNavigate?: () => void;
	id?: string;
};

const links = [
	{ href: "/", label: "Home", index: "01" },
	{ href: "/perfil", label: "Perfil", index: "02" },
	{ href: "/proyectos", label: "Proyectos", index: "03" },
	{ href: "/contacto", label: "Contacto", index: "04" },
];

export default function NavLinks({
	className = "",
	onNavigate,
	id,
}: NavLinksProps) {
	const pathname = usePathname();

	return (
		<ul id={id} className={`${styles.navLinks} ${className}`.trim()}>
			{links.map(({ href, label, index }) => {
				const isActive =
					href === "/" ? pathname === "/" : pathname.startsWith(href);
				return (
					<li key={href}>
						<Link
							href={href}
							className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
							onClick={onNavigate}
						>
							<span className={styles.navIndex} aria-hidden="true">
								{index}
							</span>
							<span className={styles.navLabel}>{label}</span>
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
