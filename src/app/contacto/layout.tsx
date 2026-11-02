import type { Metadata } from "next";
import { SchemaScript } from "@/components/SchemaScript";

export const metadata: Metadata = {
  title: "Contacto | Gustavo Canales - Desarrollador Full Stack",
  description:
    "Contacta a Gustavo Canales. Disponible para proyectos freelance, consultoría y desarrollo web personalizado.",
  openGraph: {
    title: "Contacto - Gustavo Canales",
    description: "Ponte en contacto para proyectos, consultoría y colaboración",
    url: "https://gcanales.is-a.dev/contacto",
    type: "website",
  },
  alternates: {
    canonical: "https://gcanales.is-a.dev/contacto",
  },
};

export default function ContactoLayout({
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
        name: "Contacto",
        item: "https://gcanales.is-a.dev/contacto",
      },
    ],
  };

  return (
    <>
      <SchemaScript data={breadcrumbSchema} />
      {children}
    </>
  );
}
