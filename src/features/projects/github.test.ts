import { describe, expect, it } from "vitest";
import { parseGitHubRepoUrl } from "./github";

describe("parseGitHubRepoUrl", () => {
	it("extrae owner y repo de una URL estándar", () => {
		expect(parseGitHubRepoUrl("https://github.com/vercel/next.js")).toEqual({
			owner: "vercel",
			repoName: "next.js",
		});
	});

	it("elimina el sufijo .git", () => {
		expect(
			parseGitHubRepoUrl("https://github.com/octocat/hello-world.git"),
		).toEqual({
			owner: "octocat",
			repoName: "hello-world",
		});
	});

	it("ignora query params y hash", () => {
		expect(
			parseGitHubRepoUrl(
				"https://github.com/octocat/hello-world?tab=readme#top",
			),
		).toEqual({
			owner: "octocat",
			repoName: "hello-world",
		});
	});

	it("rechaza host no github", () => {
		expect(() => parseGitHubRepoUrl("https://gitlab.com/org/repo")).toThrow(
			"Debe ser una URL de GitHub válida",
		);
	});

	it("rechaza protocolo no http/https", () => {
		expect(() => parseGitHubRepoUrl("ftp://github.com/org/repo")).toThrow(
			"URL de GitHub inválida",
		);
	});

	it("rechaza URL inválida", () => {
		expect(() => parseGitHubRepoUrl("no-es-url")).toThrow(
			"URL de GitHub inválida",
		);
	});
});
