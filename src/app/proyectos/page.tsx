"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { 
  ExternalLink, 
  Trash2, 
  Plus, 
  Code, 
  Database, 
  Server, 
  Globe, 
  Smartphone, 
  Cloud, 
  Terminal, 
  Box, 
  Cog,
  FileCode, 
  Layers, 
  Gauge,
  Package,
  Link
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Project {
  id: string;
  githubUrl: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  stars: number;
  demoUrl?: string;
}

// Tech to Icon mapping
const techIcons: Record<string, LucideIcon> = {
  React: Code,
  Vue: Box,
  Angular: Code,
  Svelte: Code,
  JavaScript: FileCode,
  HTML: FileCode,
  CSS: FileCode,
  Tailwind: Layers,
  Nodejs: Server,
  Express: Server,
  Python: Terminal,
  Django: Terminal,
  Flask: Terminal,
  Ruby: Terminal,
  Rails: Terminal,
  Go: Terminal,
  Rust: Terminal,
  SQL: Database,
  PostgreSQL: Database,
  MySQL: Database,
  MongoDB: Database,
  Redis: Database,
  Docker: Package,
  Kubernetes: Box,
  AWS: Cloud,
  GCP: Cloud,
  Azure: Cloud,
  Vercel: Cloud,
  ReactNative: Smartphone,
  Flutter: Smartphone,
  Swift: Smartphone,
  Kotlin: Smartphone,
  Git: Terminal,
  GraphQL: Database,
  REST: Server,
  Webpack: Cog,
  Vite: Terminal,
  ESLint: Code,
  Prettier: Code,
  TypeScript: FileCode,
};

const getTechIcon = (tech: string): LucideIcon => {
  const key = tech.replace(/[^a-zA-Z]/g, "");
  return techIcons[key] || Code;
};

const isAdmin = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("admin") === "true";
};

// Fetch README and extract image + technologies
const fetchReadmeData = async (owner: string, repo: string) => {
  const readmeUrls = [
    `https://api.github.com/repos/${owner}/${repo}/readme`,
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=main`,
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=master`,
  ];
  
  let readmeContent = "";
  let imageUrl = "";
  let technologies: string[] = [];
  
  for (const url of readmeUrls) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // GitHub API returns content in base64
        if (data.content) {
          readmeContent = atob(data.content);
        } else if (data.download_url) {
          const rawResponse = await fetch(data.download_url);
          readmeContent = await rawResponse.text();
        }
        break;
      }
    } catch (e) {
      continue;
    }
  }
  
  // Find image with alt="Portafolioimage"
  const imgMatch = readmeContent.match(/<img[^>]*alt=["']Portafolioimage["'][^>]*src=["']([^"']+)["']/i);
  if (imgMatch) {
    imageUrl = imgMatch[1];
  } else {
    // Try to find any project image
    const anyImgMatch = readmeContent.match(/<img[^>]*src=["']([^"']+(?:png|jpg|jpeg|gif|webp)[^"']*)["']/i);
    if (anyImgMatch) {
      imageUrl = anyImgMatch[1];
    }
  }
  
  // Extract technologies from README
  // Look for common patterns: tech stack, technologies, etc.
  const techPatterns = [
    /##\s*(?:Tech|Technologies|Tech Stack|Tecnologias)[^#]*/i,
    /###\s*(?:Tech|Technologies|Tech Stack|Tecnologias)[^#]*/i,
    /\[!NOTE\][^\n]*\n.*(?:tech|technologies).*/i,
  ];
  
  for (const pattern of techPatterns) {
    const match = readmeContent.match(pattern);
    if (match) {
      const techSection = match[0];
      // Extract words that look like technologies
      const words = techSection.match(/([A-Z][a-zA-Z]*\.?)/g) || [];
      const commonTechs = ["React", "Nextjs", "TypeScript", "JavaScript", "Python", "Nodejs", "Express", "PostgreSQL", "MongoDB", "Docker", "AWS", "Vercel", "Tailwind", "HTML", "CSS", "Git", "GraphQL", "REST", "API", "Vite", "ESLint"];
      technologies = words
        .map(w => w.replace(/\.$/, ""))
        .filter(w => commonTechs.includes(w) || w.length > 2)
        .slice(0, 6);
      break;
    }
  }
  
  // If no technologies found, try to extract from topics or infer from common patterns
  if (technologies.length === 0) {
    // Common tech detection in content
    const allTechs = ["React", "Next.js", "TypeScript", "JavaScript", "Python", "Node.js", "Express", "PostgreSQL", "MongoDB", "Docker", "AWS", "Vercel", "Tailwind", "HTML", "CSS", "Git", "GraphQL", "REST", "API", "Vite", "ESLint", "Prisma", "SQLite", "Redis", "GCP", "Azure", "Kubernetes", "Firebase", "Supabase"];
    for (const tech of allTechs) {
      const regex = new RegExp(tech, "i");
      if (regex.test(readmeContent)) {
        if (!technologies.includes(tech)) {
          technologies.push(tech);
        }
      }
    }
    technologies = technologies.slice(0, 6);
  }
  
  return { imageUrl, technologies };
};

const getProjectData = async (owner: string, repoName: string, githubUrl: string) => {
  // Get repo info
  const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);
  if (!response.ok) {
    if (response.status === 404) throw new Error("Repositorio no encontrado");
    if (response.status === 403) throw new Error("Límite alcanzado");
    throw new Error("Error al obtener datos");
  }
  
  const data = await response.json();
  
  // Get README data
  const { imageUrl, technologies } = await fetchReadmeData(owner, repoName);
  
  // Fallback image
  const finalImage = imageUrl || `https://opengraph.github.com/api/og-image?title=${encodeURIComponent(repoName)}&theme=dark`;
  
  return {
    id: Date.now().toString(),
    githubUrl,
    title: data.name.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()),
    description: data.description || "Sin descripción",
    image: finalImage,
    technologies,
    stars: data.stargazers_count,
    demoUrl: data.homepage || undefined,
  };
};

export default function Proyectos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [adminHint, setAdminHint] = useState(false);

  // Keyboard shortcut: Ctrl + Alt + 9 para mostrar input de admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === "9") {
        e.preventDefault();
        setAdminHint(true);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsAdminUser(isAdmin());
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects || []))
      .catch(() => setProjects([]));
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.trim()) {
      setError("Ingresa una URL de GitHub");
      return;
    }

    if (!githubUrl.includes("github.com/")) {
      setError("Debe ser una URL de GitHub válida");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) throw new Error("URL de GitHub inválida");
      
      const [owner, repoName] = match.slice(1);
      const newProject = await getProjectData(owner, repoName, githubUrl);
      
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      setGithubUrl("");
      setShowForm(false);
      
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: updatedProjects }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projects: updatedProjects }),
    });
  };

  const handleLogin = () => {
    // Easter egg: necesitas saber dónde está el botón + la contraseña
    const password = prompt("Acceso administrativo:");
    if (password === "gscp2024") {
      localStorage.setItem("admin", "true");
      setIsAdminUser(true);
    } else {
      // Feedback genérico - no revela si la contraseña es correcta o no
      console.log("Intento de acceso denegado");
    }
  };

  return (
    <div className={styles.proyectos}>
      <div className={styles.header}>
        <h1 className={styles.title}>Proyectos</h1>
        
        {/* Admin hint: Ctrl + Alt + 9 */}
        {adminHint && !isAdminUser && (
          <div className={styles.adminLogin}>
            <input
              type="password"
              placeholder="Password"
              className={styles.adminInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              onBlur={(e) => {
                if (!e.target.value) setAdminHint(false);
              }}
            />
          </div>
        )}
        
        {isAdminUser && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className={styles.addBtn}
          >
            <Plus size={16} />
            {showForm ? "Cancelar" : "Agregar"}
          </button>
        )}
      </div>

      {showForm && isAdminUser && (
        <form className={styles.form} onSubmit={handleAddProject}>
          <h2 className={styles.formTitle}>Nuevo Proyecto</h2>
          <div className={styles.formGroup}>
            <label htmlFor="githubUrl" className={styles.label}>
              URL del Repositorio
            </label>
            <input
              id="githubUrl"
              type="text"
              className={styles.input}
              placeholder="https://github.com/usuario/repositorio"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Cargando..." : "Agregar Proyecto"}
          </button>
        </form>
      )}

      <div className={styles.grid}>
        {projects.map((project) => (
          <article key={project.id} className={styles.card}>
            <div className={styles.cardImageWrapper}>
              <img
                src={project.image}
                alt={project.title}
                className={styles.cardImage}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 
                    `https://opengraph.github.com/api/og-image?title=${encodeURIComponent(project.title)}&theme=dark`;
                }}
              />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <p className={styles.cardDescription}>{project.description}</p>
              
              {project.technologies.length > 0 && (
                <div className={styles.techs}>
                  {project.technologies.map((tech) => {
                    const Icon = getTechIcon(tech);
                    return (
                      <span key={tech} className={styles.techBadge} title={tech}>
                        <Icon size={12} />
                        {tech}
                      </span>
                    );
                  })}
                </div>
              )}
              
              <div className={styles.cardFooter}>
                <div className={styles.stars}>
                  <Gauge size={14} />
                  {project.stars}
                </div>
                <div className={styles.links}>
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                    title="Ver en GitHub"
                  >
                    <Link size={16} />
                  </a>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                      title="Ver Demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {isAdminUser && (
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className={styles.deleteBtn}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {projects.length === 0 && (
        <div className={styles.empty}>
          <Code size={48} />
          <p>No hay proyectos</p>
          <span>Agrega tu primer proyecto desde GitHub</span>
        </div>
      )}
    </div>
  );
}