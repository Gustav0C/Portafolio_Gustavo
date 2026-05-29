import { NextRequest, NextResponse } from "next/server";
import {
	getProjectDataFromGitHub,
	parseGitHubRepoUrl,
} from "@/features/projects/github";

const isAuthorized = (request: NextRequest) => {
	const adminToken = process.env.PROJECTS_ADMIN_TOKEN?.trim();
	if (!adminToken) return false;

	const authHeader = request.headers.get("authorization") || "";
	const token = authHeader.replace(/^Bearer\s+/i, "").trim();
	return token.length > 0 && token === adminToken;
};

export async function POST(request: NextRequest) {
	try {
		if (process.env.NODE_ENV === "production") {
			return NextResponse.json(
				{ error: "Project imports are disabled in production" },
				{ status: 403 },
			);
		}

		if (!isAuthorized(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = (await request.json()) as { githubUrl?: string };
		const githubUrl = body.githubUrl?.trim();

		if (!githubUrl) {
			return NextResponse.json(
				{ error: "GitHub URL is required" },
				{ status: 400 },
			);
		}

		const { owner, repoName } = parseGitHubRepoUrl(githubUrl);
		const project = await getProjectDataFromGitHub(owner, repoName, githubUrl);

		return NextResponse.json({ project });
	} catch (err) {
		const message =
			err instanceof Error ? err.message : "Error importing project";
		return NextResponse.json({ error: message }, { status: 400 });
	}
}
