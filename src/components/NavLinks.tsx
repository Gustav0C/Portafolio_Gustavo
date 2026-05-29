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
	{ href: "/", label: "Home" },
	{ href: "/perfil", label: "Perfil" },
	{ href: "/proyectos", label: "Proyectos" },
	{ href: "/contacto", label: "Contacto" },
];

export default function NavLinks({
	className = "",
	onNavigate,
	id,
}: NavLinksProps) {
	const pathname = usePathname();

	return (
		<ul id={id} className={`${styles.navLinks} ${className}`.trim()}>
			{links.map(({ href, label }) => {
				const isActive =
					href === "/" ? pathname === "/" : pathname.startsWith(href);
				return (
					<li key={href}>
						<Link
							href={href}
							className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
							onClick={onNavigate}
						>
							{label}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
