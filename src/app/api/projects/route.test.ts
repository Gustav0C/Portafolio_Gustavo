import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_CWD = process.cwd();

const createRequest = (
	method: "GET" | "POST",
	options?: {
		token?: string;
		body?: unknown;
	},
) => {
	const headers: Record<string, string> = {};

	if (options?.token) {
		headers.Authorization = `Bearer ${options.token}`;
	}

	if (options?.body) {
		headers["Content-Type"] = "application/json";
	}

	return new Request("http://localhost/api/projects", {
		method,
		headers,
		body: options?.body ? JSON.stringify(options.body) : undefined,
	}) as never;
};

describe("/api/projects route", () => {
	let tempCwd = "";

	beforeEach(() => {
		tempCwd = mkdtempSync(join(tmpdir(), "projects-route-test-"));
		process.chdir(tempCwd);

		process.env = {
			...ORIGINAL_ENV,
			NODE_ENV: "test",
			PROJECTS_ADMIN_TOKEN: "secret-token",
		};

		delete process.env.PROJECTS_DATA_FILE;
		vi.resetModules();
	});

	afterEach(() => {
		process.chdir(ORIGINAL_CWD);
		process.env = { ...ORIGINAL_ENV };
		vi.resetModules();
	});

	it("GET devuelve lista vacía y canEdit false sin archivo", async () => {
		const { GET } = await import("./route");

		const response = await GET(createRequest("GET"));
		const data = (await response.json()) as {
			projects: unknown[];
			canEdit: boolean;
		};

		expect(response.status).toBe(200);
		expect(data.projects).toEqual([]);
		expect(data.canEdit).toBe(false);
	});

	it("GET devuelve proyectos y canEdit true con token válido", async () => {
		mkdirSync(join(tempCwd, "data"), { recursive: true });
		writeFileSync(
			join(tempCwd, "data", "projects.json"),
			JSON.stringify({
				projects: [
					{ id: "1", githubUrl: "https://github.com/a/b", title: "Demo" },
				],
			}),
		);

		const { GET } = await import("./route");

		const response = await GET(createRequest("GET", { token: "secret-token" }));
		const data = (await response.json()) as {
			projects: Array<{ id: string; title: string }>;
			canEdit: boolean;
		};

		expect(response.status).toBe(200);
		expect(data.canEdit).toBe(true);
		expect(data.projects).toHaveLength(1);
		expect(data.projects[0]?.id).toBe("1");
	});

	it("POST rechaza usuario no autorizado", async () => {
		const { POST } = await import("./route");

		const response = await POST(
			createRequest("POST", {
				body: { projects: [] },
			}),
		);

		expect(response.status).toBe(401);
	});

	it("POST valida formato de payload", async () => {
		const { POST } = await import("./route");

		const response = await POST(
			createRequest("POST", {
				token: "secret-token",
				body: { projects: [{ id: 1, githubUrl: "x", title: "x" }] },
			}),
		);

		expect(response.status).toBe(400);
	});

	it("POST guarda proyectos válidos en archivo", async () => {
		const { POST } = await import("./route");

		const payload = {
			projects: [
				{
					id: "p1",
					githubUrl: "https://github.com/octocat/hello-world",
					title: "Hello World",
				},
			],
		};

		const response = await POST(
			createRequest("POST", {
				token: "secret-token",
				body: payload,
			}),
		);

		expect(response.status).toBe(200);

		const savedPath = join(tempCwd, "data", "projects.json");
		expect(existsSync(savedPath)).toBe(true);

		const savedData = JSON.parse(readFileSync(savedPath, "utf-8")) as {
			projects: Array<{ id: string }>;
		};

		expect(savedData.projects).toHaveLength(1);
		expect(savedData.projects[0]?.id).toBe("p1");
	});

	it("POST bloquea edición en producción", async () => {
		process.env.NODE_ENV = "production";
		vi.resetModules();

		const { POST } = await import("./route");

		const response = await POST(
			createRequest("POST", {
				token: "secret-token",
				body: { projects: [] },
			}),
		);

		expect(response.status).toBe(403);
	});
});
