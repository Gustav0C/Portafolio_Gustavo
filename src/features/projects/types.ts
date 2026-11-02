export interface Project {
	id: string;
	githubUrl: string;
	title: string;
	description: string;
	image: string;
	technologies: string[];
	stars: number;
	demoUrl?: string;
	isPrivate?: boolean;
	category?: "commercial" | "opensource";
	projectType?: "mobile" | "web" | "system";
}

export interface ProjectsApiResponse {
	projects?: Project[];
	canEdit?: boolean;
}
