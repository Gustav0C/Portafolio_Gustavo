import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://gustavo-canales.vercel.app";

  // Define all static pages
  const pages = [
    {
      url: "/",
      changefreq: "daily",
      priority: "1.0",
      lastmod: new Date().toISOString().split("T")[0],
    },
    {
      url: "/perfil",
      changefreq: "monthly",
      priority: "0.8",
      lastmod: new Date().toISOString().split("T")[0],
    },
    {
      url: "/proyectos",
      changefreq: "weekly",
      priority: "0.8",
      lastmod: new Date().toISOString().split("T")[0],
    },
    {
      url: "/contacto",
      changefreq: "monthly",
      priority: "0.7",
      lastmod: new Date().toISOString().split("T")[0],
    },
  ];

  // Generate XML sitemap
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) =>
      `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
