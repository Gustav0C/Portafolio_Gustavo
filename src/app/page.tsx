import Link from "next/link";
import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Inicio | Gustavo Canales - Desarrollador Full Stack",
  description:
    "Bienvenido al portafolio de Gustavo Canales. Desarrollador Full Stack con experiencia en React, Next.js y TypeScript. Explore mis proyectos y servicios.",
  openGraph: {
    title: "Gustavo Canales - Desarrollador Full Stack",
    description:
      "Portafolio profesional con proyectos en React, Next.js y tecnologías web modernas",
    url: "https://gustavo-canales.vercel.app",
    type: "website",
  },
  alternates: {
    canonical: "https://gustavo-canales.vercel.app/",
  },
};

export default function Home() {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>Gustavo Canales</h1>
      <p className={styles.subtitle}>
        Desarrollador Full Stack con pasión por crear soluciones elegantes y
        experiencias de usuario excepcionales.
      </p>

      {/* Terminal decorative element */}
      <div className={styles.terminal}>
        <div className={styles.terminalLine}>
          <span className={styles.prompt}>$</span> whoami
        </div>
        <div className={styles.terminalLine}>
          Gustavo Canales - Full Stack Developer
        </div>
        <div className={styles.terminalLine}>
          <span className={styles.prompt}>$</span> cat skills.txt
        </div>
        <div className={styles.terminalLine}>
          React, TypeScript, Next.js, Python, SQL
        </div>
        <div className={styles.terminalLine}>
          <span className={styles.prompt}>$</span>
          <span className={styles.typingCursor}></span>
        </div>
      </div>

      <div className={styles.cta}>
        <Link href="/proyectos" className={styles.btnPrimary}>
          Ver Proyectos
        </Link>
        <Link href="/contacto" className={styles.btnAccent}>
          Contactar
        </Link>
      </div>
    </div>
  );
}
