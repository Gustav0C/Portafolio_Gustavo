import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const ORIGINAL_ENV = { ...process.env };
const ORIGINAL_CWD = process.cwd();

describe("/api/projects/upload route", () => {
	let tempCwd = "";

	beforeEach(() => {
		tempCwd = mkdtempSync(join(tmpdir(), "upload-test-"));
		process.chdir(tempCwd);

		process.env = {
			...ORIGINAL_ENV,
			NODE_ENV: "test",
			PROJECTS_ADMIN_TOKEN: "test-token",
		};
		vi.resetModules();
	});

	afterEach(() => {
		process.chdir(ORIGINAL_CWD);
		process.env = { ...ORIGINAL_ENV };
		rmSync(tempCwd, { recursive: true, force: true });
		vi.resetModules();
	});

	it("returns 401 when unauthorized", async () => {
		const { POST } = await import("./route");

		const formData = new FormData();
		formData.append(
			"file",
			new File(["test content"], "photo.png", { type: "image/png" }),
		);

		const request = new Request("http://localhost/api/projects/upload", {
			method: "POST",
			body: formData,
		});

		const response = await POST(request as never);
		expect(response.status).toBe(401);
	});

	it("saves file to public/projects and returns url when authorized", async () => {
		const { POST } = await import("./route");

		const formData = new FormData();
		formData.append(
			"file",
			new File(["sample bytes"], "app-screen.png", { type: "image/png" }),
		);

		const request = new Request("http://localhost/api/projects/upload", {
			method: "POST",
			headers: {
				Authorization: "Bearer test-token",
			},
			body: formData,
		});

		const response = await POST(request as never);
		expect(response.status).toBe(200);

		const data = (await response.json()) as { url: string };
		expect(data.url).toMatch(/^\/projects\/\d+-app-screen\.png$/);

		const filePath = join(tempCwd, "public", data.url);
		expect(existsSync(filePath)).toBe(true);
	});
});
