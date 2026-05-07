"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/app/layout.module.css";

const links = [
  { href: "/", label: "Home" },
  { href: "/perfil", label: "Perfil" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/contacto", label: "Contacto" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className={styles.navLinks}>
      {links.map(({ href, label }) => {
        const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <li key={href}>
            <Link
              href={href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
