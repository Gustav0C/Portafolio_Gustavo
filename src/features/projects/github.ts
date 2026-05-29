import type { Project } from "./types";

const commonTechs = [
	"React",
	"Nextjs",
	"TypeScript",
	"JavaScript",
	"Python",
	"Nodejs",
	"Express",
	"PostgreSQL",
	"MongoDB",
	"Docker",
	"AWS",
	"Vercel",
	"Tailwind",
	"HTML",
	"CSS",
	"Git",
	"GraphQL",
	"REST",
	"API",
	"Vite",
	"ESLint",
];

const allTechs = [
	"React",
	"Next.js",
	"TypeScript",
	"JavaScript",
	"Python",
	"Node.js",
	"Express",
	"PostgreSQL",
	"MongoDB",
	"Docker",
	"AWS",
	"Vercel",
	"Tailwind",
	"HTML",
	"CSS",
	"Git",
	"GraphQL",
	"REST",
	"API",
	"Vite",
	"ESLint",
	"Prisma",
	"SQLite",
	"Redis",
	"GCP",
	"Azure",
	"Kubernetes",
	"Firebase",
	"Supabase",
];

const techPatterns = [
	/##\s*(?:Tech|Technologies|Tech Stack|Tecnologias)[^#]*/i,
	/###\s*(?:Tech|Technologies|Tech Stack|Tecnologias)[^#]*/i,
	/\[!NOTE\][^\n]*\n.*(?:tech|technologies).*/i,
];

export const parseGitHubRepoUrl = (githubUrl: string) => {
	let parsedUrl: URL;

	try {
		parsedUrl = new URL(githubUrl.trim());
	} catch {
		throw new Error("URL de GitHub inválida");
	}

	if (!["http:", "https:"].includes(parsedUrl.protocol)) {
		throw new Error("URL de GitHub inválida");
	}

	if (parsedUrl.hostname !== "github.com") {
		throw new Error("Debe ser una URL de GitHub válida");
	}

	const segments = parsedUrl.pathname.split("/").filter(Boolean);
	if (segments.length < 2) {
		throw new Error("URL de GitHub inválida");
	}

	const owner = segments[0];
	const repoName = segments[1].replace(/\.git$/, "");

	return { owner, repoName };
};

const normalizeReadmeImageUrl = (
	owner: string,
	repo: string,
	defaultBranch: string,
	imageUrl: string,
) => {
	if (!imageUrl) return "";
	if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
	if (imageUrl.startsWith("//")) return `https:${imageUrl}`;

	const base = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/`;
	if (imageUrl.startsWith("/")) return `${base}${imageUrl.slice(1)}`;

	try {
		return new URL(imageUrl, base).toString();
	} catch {
		return imageUrl;
	}
};

const extractTechnologiesFromReadme = (readmeContent: string) => {
	let technologies: string[] = [];

	for (const pattern of techPatterns) {
		const match = readmeContent.match(pattern);
		if (match) {
			const techSection = match[0];
			const words = techSection.match(/([A-Z][a-zA-Z]*\.?)/g) || [];
			technologies = words
				.map((w) => w.replace(/\.$/, ""))
				.filter((w) => commonTechs.includes(w) || w.length > 2)
				.slice(0, 6);
			break;
		}
	}

	if (technologies.length > 0) {
		return technologies;
	}

	for (const tech of allTechs) {
		const regex = new RegExp(tech, "i");
		if (regex.test(readmeContent) && !technologies.includes(tech)) {
			technologies.push(tech);
		}
	}

	return technologies.slice(0, 6);
};

const fetchReadmeData = async (
	owner: string,
	repo: string,
	defaultBranch = "main",
) => {
	const readmeUrls = [
		`https://api.github.com/repos/${owner}/${repo}/readme`,
		`https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
		`https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=main`,
		`https://api.github.com/repos/${owner}/${repo}/contents/README.md?ref=master`,
	];

	let readmeContent = "";
	let imageUrl = "";

	for (const url of readmeUrls) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				continue;
			}

			const data = await response.json();
			if (data.content) {
				readmeContent = atob(data.content);
			} else if (data.download_url) {
				const rawResponse = await fetch(data.download_url);
				readmeContent = await rawResponse.text();
			}
			break;
		} catch {
			continue;
		}
	}

	const imgMatch = readmeContent.match(
		/<img[^>]*alt=["']Portafolioimage["'][^>]*src=["']([^"']+)["']/i,
	);

	if (imgMatch) {
		imageUrl = imgMatch[1];
	} else {
		const anyImgMatch = readmeContent.match(
			/<img[^>]*src=["']([^"']+(?:png|jpg|jpeg|gif|webp)[^"']*)["']/i,
		);
		if (anyImgMatch) {
			imageUrl = anyImgMatch[1];
		}
	}

	if (imageUrl) {
		imageUrl = normalizeReadmeImageUrl(owner, repo, defaultBranch, imageUrl);
	}

	const technologies = extractTechnologiesFromReadme(readmeContent);
	return { imageUrl, technologies };
};

export const getProjectDataFromGitHub = async (
	owner: string,
	repoName: string,
	githubUrl: string,
): Promise<Project> => {
	const response = await fetch(
		`https://api.github.com/repos/${owner}/${repoName}`,
	);

	if (!response.ok) {
		if (response.status === 404) throw new Error("Repositorio no encontrado");
		if (response.status === 403) throw new Error("Límite alcanzado");
		throw new Error("Error al obtener datos");
	}

	const data = await response.json();
	const { imageUrl, technologies } = await fetchReadmeData(
		owner,
		repoName,
		data.default_branch || "main",
	);

	const image =
		imageUrl ||
		`https://opengraph.github.com/api/og-image?title=${encodeURIComponent(repoName)}&theme=dark`;

	return {
		id: Date.now().toString(),
		githubUrl,
		title: data.name
			.replace(/-/g, " ")
			.replace(/\b\w/g, (char: string) => char.toUpperCase()),
		description: data.description || "Sin descripción",
		image,
		technologies,
		stars: data.stargazers_count,
		demoUrl: data.homepage || undefined,
	};
};
