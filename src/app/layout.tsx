import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import ThemeToggle from "@/components/ThemeToggle";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL("https://gustavocanales.dev"),
  title: "Gustavo Canales | Desarrollador Full Stack",
  description: "Portafolio profesional de Gustavo Canales - Desarrollador Full Stack especializado en React, Next.js y herramientas de IA",
  keywords: ["desarrollador", "full stack", "React", "Next.js", "TypeScript", "portfolio"],
  authors: [{ name: "Gustavo Canales" }],
  openGraph: {
    title: "Gustavo Canales | Desarrollador Full Stack",
    description: "Portafolio profesional - Desarrollador Full Stack especializado en React, Next.js y herramientas de IA",
    type: "website",
    locale: "es_AR",
    url: "https://gustavocanales.dev",
    siteName: "Gustavo Canales",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gustavo Canales - Portafolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gustavo Canales | Desarrollador Full Stack",
    description: "Portafolio profesional - Desarrollador Full Stack",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <div className={styles.wrapper}>
          {/* Navigation */}
          <nav className={styles.navbar}>
            <div className={styles.navbarInner}>
              <Link href="/" className={styles.brand}>
                Gscp
              </Link>
              <div className={styles.navRight}>
                <ul className={styles.navLinks}>
                  <li>
                    <Link href="/" className={styles.navLink}>
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/perfil" className={styles.navLink}>
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <Link href="/proyectos" className={styles.navLink}>
                      Proyectos
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacto" className={styles.navLink}>
                      Contacto
                    </Link>
                  </li>
                </ul>
                <ThemeToggle />
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className={styles.main}>
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          {/* Footer */}
          <footer className={styles.footer}>
            <div className={styles.footerInner}>
              <p className={styles.copyright}>
                © {new Date().getFullYear()} Gustavo Canales
              </p>
              <ul className={styles.footerLinks}>
                <li>
                  <a
                    href="https://github.com/Gustav0C"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerLink}
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/in/gscp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.footerLink}
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="mailto:gustavocanales58@gmail.com" className={styles.footerLink}>
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}