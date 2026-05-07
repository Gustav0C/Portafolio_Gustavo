import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil | Gustavo Canales - Full Stack Developer",
  description:
    "Conoce mi perfil profesional. Desarrollador Full Stack con experiencia en React, Next.js, TypeScript, Python, SQL y herramientas de IA. Habilidades, experiencia y educación.",
  openGraph: {
    title: "Perfil de Gustavo Canales - Desarrollador Full Stack",
    description:
      "Desarrollador profesional con experiencia en frontend, backend y herramientas modernas de desarrollo",
    url: "https://gustavo-canales.vercel.app/perfil",
    type: "profile",
  },
  alternates: {
    canonical: "https://gustavo-canales.vercel.app/perfil",
  },
};

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Breadcrumb Schema - JSON-LD for Profile Page */}
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
                name: "Perfil",
                item: "https://gustavo-canales.vercel.app/perfil",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
