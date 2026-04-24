import Link from "next/link";
import styles from "./page.module.css";

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
        <Link href="/proyectos" className={`${styles.btnPrimary} hover-lift btn-press`}>
          Ver Proyectos
        </Link>
        <Link href="/contacto" className={`${styles.btnAccent} hover-lift btn-press`}>
          Contactar
        </Link>
      </div>
    </div>
  );
}