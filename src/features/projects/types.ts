export interface Project {
	id: string;
	githubUrl: string;
	title: string;
	description: string;
	image: string;
	technologies: string[];
	stars: number;
	demoUrl?: string;
}

export interface ProjectsApiResponse {
	projects?: Project[];
	canEdit?: boolean;
}
