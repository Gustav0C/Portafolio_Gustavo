import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

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
				{ error: "Uploads are disabled in production" },
				{ status: 403 },
			);
		}

		if (!isAuthorized(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json(
				{ error: "No file provided" },
				{ status: 400 },
			);
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
		const filename = `${Date.now()}-${cleanName}`;
		const uploadDir = join(process.cwd(), "public", "projects");

		mkdirSync(uploadDir, { recursive: true });
		writeFileSync(join(uploadDir, filename), buffer);

		return NextResponse.json({ url: `/projects/${filename}` });
	} catch (err) {
		const message =
			err instanceof Error ? err.message : "Error uploading file";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
