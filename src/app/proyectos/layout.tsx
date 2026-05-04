import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos | Gustavo Canales - Full Stack Developer",
  description: "Galería de proyectos profesionales de Gustavo Canales. Descubre aplicaciones web modernas desarrolladas con React, Next.js, TypeScript y otras tecnologías.",
  openGraph: {
    title: "Proyectos - Gustavo Canales",
    description: "Portafolio de proyectos desarrollados con React, Next.js, TypeScript, Python y herramientas modernas",
    url: "https://gustavocanales.dev/proyectos",
    type: "website",
  },
  alternates: {
    canonical: "https://gustavocanales.dev/proyectos",
  },
};

export default function ProyectosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Breadcrumb Schema - JSON-LD for Projects Page */}
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
              {
                "@type": "ListItem",
                position: 2,
                name: "Proyectos",
                item: "https://gustavocanales.dev/proyectos",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
