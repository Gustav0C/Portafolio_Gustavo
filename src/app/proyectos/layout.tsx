import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proyectos | Gustavo Canales - Full Stack Developer",
  description:
    "Galería de proyectos profesionales de Gustavo Canales. Descubre aplicaciones web modernas desarrolladas con React, Next.js, TypeScript y otras tecnologías.",
  openGraph: {
    title: "Proyectos - Gustavo Canales",
    description:
      "Portafolio de proyectos desarrollados con React, Next.js, TypeScript, Python y herramientas modernas",
    url: "https://gustavo-canales.vercel.app/proyectos",
    type: "website",
  },
  alternates: {
    canonical: "https://gustavo-canales.vercel.app/proyectos",
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
                item: "https://gustavo-canales.vercel.app/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Proyectos",
                item: "https://gustavo-canales.vercel.app/proyectos",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
