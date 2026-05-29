import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

const mockGetProjectDataFromGitHub = vi.fn();
const mockParseGitHubRepoUrl = vi.fn();

vi.mock("@/features/projects/github", () => ({
	getProjectDataFromGitHub: mockGetProjectDataFromGitHub,
	parseGitHubRepoUrl: mockParseGitHubRepoUrl,
}));

const createRequest = (token?: string, body?: unknown) => {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return new Request("http://localhost/api/projects/import", {
		method: "POST",
		headers,
		body: JSON.stringify(body ?? {}),
	}) as never;
};

describe("/api/projects/import route", () => {
	beforeEach(() => {
		process.env = {
			...ORIGINAL_ENV,
			NODE_ENV: "test",
			PROJECTS_ADMIN_TOKEN: "secret-token",
		};

		mockGetProjectDataFromGitHub.mockReset();
		mockParseGitHubRepoUrl.mockReset();
		vi.resetModules();
	});

	afterEach(() => {
		process.env = { ...ORIGINAL_ENV };
		vi.resetModules();
	});

	it("rechaza si no está autorizado", async () => {
		const { POST } = await import("./route");

		const response = await POST(
			createRequest(undefined, { githubUrl: "https://github.com/a/b" }),
		);
		expect(response.status).toBe(401);
	});

	it("valida githubUrl requerido", async () => {
		const { POST } = await import("./route");

		const response = await POST(createRequest("secret-token", {}));
		expect(response.status).toBe(400);

		const data = (await response.json()) as { error: string };
		expect(data.error).toBe("GitHub URL is required");
	});

	it("retorna proyecto importado", async () => {
		mockParseGitHubRepoUrl.mockReturnValue({
			owner: "octocat",
			repoName: "hello-world",
		});
		mockGetProjectDataFromGitHub.mockResolvedValue({
			id: "1",
			githubUrl: "https://github.com/octocat/hello-world",
			title: "Hello World",
			description: "Demo",
			image: "https://example.com/img.png",
			technologies: ["TypeScript"],
			stars: 10,
		});

		const { POST } = await import("./route");

		const response = await POST(
			createRequest("secret-token", {
				githubUrl: "https://github.com/octocat/hello-world",
			}),
		);

		expect(response.status).toBe(200);

		const data = (await response.json()) as { project: { title: string } };
		expect(data.project.title).toBe("Hello World");
		expect(mockParseGitHubRepoUrl).toHaveBeenCalledWith(
			"https://github.com/octocat/hello-world",
		);
		expect(mockGetProjectDataFromGitHub).toHaveBeenCalledWith(
			"octocat",
			"hello-world",
			"https://github.com/octocat/hello-world",
		);
	});

	it("bloquea import en producción", async () => {
		process.env = { ...process.env, NODE_ENV: "production" };
		vi.resetModules();

		const { POST } = await import("./route");
		const response = await POST(
			createRequest("secret-token", {
				githubUrl: "https://github.com/octocat/hello-world",
			}),
		);

		expect(response.status).toBe(403);
	});

	it("propaga error funcional en payload inválido", async () => {
		mockParseGitHubRepoUrl.mockImplementation(() => {
			throw new Error("URL de GitHub inválida");
		});

		const { POST } = await import("./route");
		const response = await POST(
			createRequest("secret-token", {
				githubUrl: "https://github.com/invalido",
			}),
		);

		expect(response.status).toBe(400);
		const data = (await response.json()) as { error: string };
		expect(data.error).toBe("URL de GitHub inválida");
	});
});
