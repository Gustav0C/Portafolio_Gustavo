// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import FeaturedProjects from "./FeaturedProjects";

function mockMatchMedia() {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
}

function mockIntersectionObserver() {
	class MockIntersectionObserver implements IntersectionObserver {
		readonly root: Element | Document | null = null;
		readonly rootMargin: string = "0px";
		readonly thresholds: ReadonlyArray<number> = [0.15];
		private callback: IntersectionObserverCallback;

		constructor(callback: IntersectionObserverCallback) {
			this.callback = callback;
		}

		observe(target: Element) {
			// Simulate immediate intersection
			this.callback(
				[
					{
						isIntersecting: true,
						target,
						intersectionRatio: 1,
						intersectionRect: new DOMRect(),
						boundingClientRect: new DOMRect(),
						rootBounds: null,
						time: Date.now(),
					} as IntersectionObserverEntry,
				],
				this,
			);
		}

		unobserve() {}
		disconnect() {}
		takeRecords(): IntersectionObserverEntry[] {
			return [];
		}
	}

	Object.defineProperty(window, "IntersectionObserver", {
		writable: true,
		value: MockIntersectionObserver,
	});
}

const mockProjects = [
	{
		id: "1",
		githubUrl: "https://github.com/user/project1",
		title: "Test Project One",
		description: "First test project description",
		image: "https://example.com/image1.png",
		technologies: ["React", "TypeScript"],
		stars: 5,
		demoUrl: "https://demo1.example.com",
	},
	{
		id: "2",
		githubUrl: "https://github.com/user/project2",
		title: "Test Project Two",
		description: "Second test project description",
		image: "https://example.com/image2.png",
		technologies: ["Node.js"],
		stars: 3,
	},
];

beforeEach(() => {
	vi.restoreAllMocks();
	mockMatchMedia();
	mockIntersectionObserver();
});

describe("FeaturedProjects", () => {
	it("renders section header and title", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mockProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		expect(
			screen.getByText("// 03. PROYECTOS DESTACADOS"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /Software en Producción & Casos de Estudio/i,
			}),
		).toBeInTheDocument();
	});

	it("renders project images with proper alt text", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mockProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(
				screen.getByAltText("Captura del proyecto Test Project One"),
			).toBeInTheDocument();
		});

		expect(
			screen.getByAltText("Captura del proyecto Test Project Two"),
		).toBeInTheDocument();
	});

	it("renders project titles from the data", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mockProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(screen.getByText("Test Project One")).toBeInTheDocument();
		});

		expect(screen.getByText("Test Project Two")).toBeInTheDocument();
	});

	it("displays stars count for each project", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mockProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(screen.getByText("★ 5")).toBeInTheDocument();
		});

		expect(screen.getByText("★ 3")).toBeInTheDocument();
	});

	it("renders technology tags with > prompt prefix", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mockProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(screen.getByText("React")).toBeInTheDocument();
		});

		expect(screen.getByText("TypeScript")).toBeInTheDocument();
		expect(screen.getByText("Node.js")).toBeInTheDocument();
	});

	it("shows demo link when demoUrl exists", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mockProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(screen.getByText("Demo →")).toBeInTheDocument();
		});
	});

	it("handles the empty state when no projects exist", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: [], canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(
				screen.getByText("No hay proyectos destacados aún."),
			).toBeInTheDocument();
		});
	});

	it("does not show section CTA when there are no projects", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: [], canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(
				screen.queryByText("Ver más proyectos →"),
			).not.toBeInTheDocument();
		});
	});

	it("shows section CTA when projects exist", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mockProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(screen.getByText("Ver más proyectos →")).toBeInTheDocument();
		});
	});

	it("filters and shows only main/commercial projects when mixed with open source", async () => {
		const mixedProjects = [
			{
				id: "app-1",
				title: "Main Mobile App",
				description: "Private mobile application",
				image: "https://example.com/mobile.png",
				technologies: ["React Native"],
				stars: 0,
				isPrivate: true,
				category: "commercial" as const,
			},
			{
				id: "oss-1",
				githubUrl: "https://github.com/user/oss-lib",
				title: "Open Source Tool",
				description: "A public library",
				image: "https://example.com/oss.png",
				technologies: ["TypeScript"],
				stars: 120,
				isPrivate: false,
				category: "opensource" as const,
			},
		];

		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mixedProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			expect(screen.getByText("Main Mobile App")).toBeInTheDocument();
		});

		expect(screen.queryByText("Open Source Tool")).not.toBeInTheDocument();
	});

	it("renders repo links pointing to GitHub", async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ projects: mockProjects, canEdit: false }),
		});

		render(<FeaturedProjects />);

		await waitFor(() => {
			const repoLinks = screen.getAllByText("Repo");
			expect(repoLinks).toHaveLength(2);
			expect(repoLinks[0]).toHaveAttribute(
				"href",
				"https://github.com/user/project1",
			);
			expect(repoLinks[1]).toHaveAttribute(
				"href",
				"https://github.com/user/project2",
			);
		});
	});
});
