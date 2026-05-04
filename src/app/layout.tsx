import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import styles from "./layout.module.css";
import ThemeToggle from "@/components/ThemeToggle";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL("https://gustavocanales.dev"),
  title: "Gustavo Canales | Desarrollador Full Stack | React, Next.js, TypeScript",
  description: "Portafolio profesional de Gustavo Canales - Desarrollador Full Stack con experiencia en React, Next.js, TypeScript, Python y herramientas de IA. Especializado en arquitectura web moderna.",
  keywords: [
    "desarrollador",
    "full stack",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "portfolio",
    "web developer",
    "developer Argentina",
    "freelance developer",
    "Python",
    "Node.js",
  ],
  authors: [{ name: "Gustavo Canales" }],
  creator: "Gustavo Canales",
  publisher: "Gustavo Canales",
  openGraph: {
    title: "Gustavo Canales | Desarrollador Full Stack",
    description: "Portafolio profesional - Desarrollador Full Stack especializado en React, Next.js, TypeScript y herramientas de IA",
    type: "website",
    locale: "es_AR",
    url: "https://gustavocanales.dev",
    siteName: "Gustavo Canales",
    images: [
      {
        url: "https://gustavocanales.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Gustavo Canales - Portafolio de Desarrollador Full Stack",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gustavo Canales | Desarrollador Full Stack",
    description: "Portafolio profesional - React, Next.js, TypeScript y IA",
    creator: "@Gustav0C",
    images: ["https://gustavocanales.dev/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  verification: {
    google: "add-your-google-verification-code",
  },
  alternates: {
    canonical: "https://gustavocanales.dev",
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
        <link href="https://api.fontshare.com/v2/css?f[]=berkeley-mono@200,300,400,500,600,700,800" rel="stylesheet" />
        
        {/* Organization Schema - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Gustavo Canales",
              url: "https://gustavocanales.dev",
              logo: "https://gustavocanales.dev/og-image.png",
              description: "Portafolio profesional de Gustavo Canales - Desarrollador Full Stack",
              sameAs: [
                "https://github.com/Gustav0C",
                "https://www.linkedin.com/in/gscp/",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "gustavocanales58@gmail.com",
                contactType: "Customer Support",
              },
              founder: {
                "@type": "Person",
                name: "Gustavo Canales",
              },
            }),
          }}
        />

        {/* Person Schema - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Gustavo Canales",
              url: "https://gustavocanales.dev",
              image: "https://gustavocanales.dev/og-image.png",
              jobTitle: "Full Stack Developer",
              email: "gustavocanales58@gmail.com",
              sameAs: [
                "https://github.com/Gustav0C",
                "https://www.linkedin.com/in/gscp/",
              ],
              knowsAbout: [
                "React",
                "Next.js",
                "TypeScript",
                "Python",
                "Node.js",
                "SQL",
                "Docker",
                "Git",
              ],
            }),
          }}
        />

        {/* Breadcrumb Schema - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://gustavocanales.dev/",
                },
              ],
            }),
          }}
        />
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