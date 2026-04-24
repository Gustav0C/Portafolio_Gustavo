import Image from "next/image";
import styles from "./page.module.css";

export default function Perfil() {
  const skills = [
    // Frontend
    { name: "React", category: "frontend" },
    { name: "Next.js", category: "frontend" },
    { name: "TypeScript", category: "frontend" },
    { name: "JavaScript", category: "frontend" },
    { name: "HTML/CSS", category: "frontend" },
    { name: "Tailwind", category: "frontend" },
    // Backend
    { name: "Node.js", category: "backend" },
    { name: "Python", category: "backend" },
    { name: "Express", category: "backend" },
    { name: "SQL", category: "backend" },
    // Database
    { name: "PostgreSQL", category: "database" },
    { name: "MongoDB", category: "database" },
    // DevOps & Tools
    { name: "Git", category: "tools" },
    { name: "Docker", category: "tools" },
    { name: "VS Code", category: "tools" },
    // AI & Modernos
    { name: "Claude Code", category: "ai" },
    { name: "OpenCode", category: "ai" },
    { name: "Cursor", category: "ai" },
    { name: "GitHub Copilot", category: "ai" },
    { name: "ChatGPT", category: "ai" },
  ];

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <Image
            src="/perfil.webp"
            alt="Gustavo Canales"
            fill
            className={styles.avatarImage}
          />
        </div>
        <div className={styles.info}>
          <h1>Gustavo Canales</h1>
          <p className={styles.title}>Desarrollador Full Stack</p>
          <p className={styles.bio}>
            Profesional con pasión por crear soluciones tecnológicas innovadoras.
            Especializado en desarrollo web moderno con React, Next.js y herramientas de IA.
            Siempre en busca de nuevos desafíos y oportunidades de aprendizaje.
          </p>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Habilidades</h2>
        <div className={styles.skillsGrid}>
          <div className={styles.skillCategory}>
            <h3>Frontend</h3>
            <ul className={styles.skills}>
              {skills.filter(s => s.category === "frontend").map(s => (
                <li key={s.name} className={styles.skill}>{s.name}</li>
              ))}
            </ul>
          </div>
          <div className={styles.skillCategory}>
            <h3>Backend</h3>
            <ul className={styles.skills}>
              {skills.filter(s => s.category === "backend").map(s => (
                <li key={s.name} className={styles.skill}>{s.name}</li>
              ))}
            </ul>
          </div>
          <div className={styles.skillCategory}>
            <h3>Database</h3>
            <ul className={styles.skills}>
              {skills.filter(s => s.category === "database").map(s => (
                <li key={s.name} className={styles.skill}>{s.name}</li>
              ))}
            </ul>
          </div>
          <div className={styles.skillCategory}>
            <h3>DevOps & Tools</h3>
            <ul className={styles.skills}>
              {skills.filter(s => s.category === "tools").map(s => (
                <li key={s.name} className={styles.skill}>{s.name}</li>
              ))}
            </ul>
          </div>
          <div className={styles.skillCategory}>
            <h3>IA & Agentos</h3>
            <ul className={styles.skills}>
              {skills.filter(s => s.category === "ai").map(s => (
                <li key={s.name} className={styles.skill}>{s.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experiencia</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2024 - Presente</div>
            <div className={styles.timelineContent}>
              <h3>Desarrollador Full Stack</h3>
              <p className={styles.timelineCompany}>Proyectos Personales & Freelance</p>
              <p className={styles.timelineDescription}>
                Desarrollo de aplicaciones web modernas utilizando React, Next.js, TypeScript.
                Implementación de herramientas de IA para optimización de workflows.
              </p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2022 - 2024</div>
            <div className={styles.timelineContent}>
              <h3>Desarrollador Web</h3>
              <p className={styles.timelineCompany}>Desarrollo Web</p>
              <p className={styles.timelineDescription}>
                Creación de sitios web y aplicaciones interactivas.
                Tecnologías: JavaScript, React, Node.js.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Educación</h2>
        <div className={styles.timeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineDate}>2024 - Presente</div>
            <div className={styles.timelineContent}>
              <h3>Carrera de Tecnología</h3>
              <p className={styles.timelineCompany}>Formación en Desarrollo de Software</p>
              <p className={styles.timelineDescription}>
                Estudios en desarrollo de aplicaciones y sistemas tecnológicos.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}