import type { Metadata } from "next";
import { SchemaScript } from "@/components/SchemaScript";
import { profileData } from "@/data/profile";

export const metadata: Metadata = {
  title: "Perfil Profesional | Gustavo Canales - Full Stack Engineer",
  description:
    "Perfil profesional de Gustavo Canales. Full Stack Engineer especializado en React, Next.js 16, TypeScript, Clean Architecture y agentes de IA. Conoce mi trayectoria, stack y filosofía técnica.",
  openGraph: {
    title: "Perfil Profesional | Gustavo Canales - Full Stack Engineer",
    description:
      "Full Stack Engineer enfocado en React, Next.js, TypeScript y sistemas de IA. Filosofía de ingeniería, trayectoria y arsenal técnico.",
    url: "https://gcanales.is-a.dev/perfil",
    type: "profile",
  },
  alternates: {
    canonical: "https://gcanales.is-a.dev/perfil",
  },
};

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://gcanales.is-a.dev/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Perfil",
        item: "https://gcanales.is-a.dev/perfil",
      },
    ],
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profileData.name,
    alternateName: profileData.handle,
    jobTitle: profileData.role,
    url: "https://gcanales.is-a.dev/perfil",
    image: `https://gcanales.is-a.dev${profileData.avatarUrl}`,
    description: profileData.bio,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ica",
      addressCountry: "PE",
    },
    sameAs: [
      "https://github.com/Gustav0C",
      "https://www.linkedin.com/in/gscp/",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Clean Architecture",
      "Python",
      "Node.js",
      "PostgreSQL",
      "AI Agents",
      "Software Engineering",
    ],
  };

  return (
    <>
      <SchemaScript data={breadcrumbSchema} />
      <SchemaScript data={personSchema} />
      {children}
    </>
  );
}
