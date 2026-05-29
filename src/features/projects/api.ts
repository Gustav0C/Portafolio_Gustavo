import type { Project, ProjectsApiResponse } from "./types";

export const getAdminToken = () => {
	if (typeof window === "undefined") return "";
	return localStorage.getItem("adminToken") || "";
};

export const fetchProjects = async () => {
	const token = getAdminToken();

	const response = await fetch("/api/projects", {
		headers: token ? { Authorization: `Bearer ${token}` } : undefined,
	});

	if (!response.ok) {
		throw new Error("No se pudieron cargar los proyectos");
	}

	const data: ProjectsApiResponse = await response.json();
	return {
		projects: data.projects || [],
		canEdit: Boolean(data.canEdit),
	};
};

export const persistProjects = async (projects: Project[]) => {
	const response = await fetch("/api/projects", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getAdminToken()}`,
		},
		body: JSON.stringify({ projects }),
	});

	if (!response.ok) {
		throw new Error("No se pudo guardar el proyecto");
	}
};

export const importProjectFromGitHub = async (
	githubUrl: string,
): Promise<Project> => {
	const response = await fetch("/api/projects/import", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getAdminToken()}`,
		},
		body: JSON.stringify({ githubUrl }),
	});

	if (!response.ok) {
		const data = (await response.json().catch(() => ({}))) as {
			error?: string;
		};
		throw new Error(data.error || "No se pudo importar el repositorio");
	}

	const data = (await response.json()) as { project?: Project };
	if (!data.project) {
		throw new Error("Respuesta inválida del servidor");
	}

	return data.project;
};

export const validateAdminToken = async (password: string) => {
	const response = await fetch("/api/projects", {
		headers: { Authorization: `Bearer ${password}` },
	});

	if (!response.ok) {
		throw new Error("Token inválido");
	}

	const data: ProjectsApiResponse = await response.json();

	if (!data.canEdit) {
		throw new Error("Token inválido");
	}

	return true;
};
