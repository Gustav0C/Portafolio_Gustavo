import type { MetadataRoute } from "next";

const BASE_URL =
	process.env.NEXT_PUBLIC_BASE_URL || "https://gustavo-canales.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	return [
		{
			url: `${BASE_URL}/`,
			lastModified,
			changeFrequency: "daily",
			priority: 1,
		},
		{
			url: `${BASE_URL}/perfil`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/proyectos`,
			lastModified,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${BASE_URL}/contacto`,
			lastModified,
			changeFrequency: "monthly",
			priority: 0.7,
		},
	];
}
