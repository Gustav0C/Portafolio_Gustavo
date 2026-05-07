import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Gustavo Canales - Desarrollador Full Stack",
  description:
    "Contacta a Gustavo Canales. Disponible para proyectos freelance, consultoría y desarrollo web personalizado.",
  openGraph: {
    title: "Contacto - Gustavo Canales",
    description: "Ponte en contacto para proyectos, consultoría y colaboración",
    url: "https://gustavo-canales.vercel.app/contacto",
    type: "website",
  },
  alternates: {
    canonical: "https://gustavo-canales.vercel.app/contacto",
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Breadcrumb Schema - JSON-LD for Contact Page */}
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
                name: "Contacto",
                item: "https://gustavo-canales.vercel.app/contacto",
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
