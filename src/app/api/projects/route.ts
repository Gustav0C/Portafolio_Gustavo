import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { dirname, isAbsolute, join } from "path";

const DEFAULT_PROJECTS_FILE = join(process.cwd(), "data", "projects.json");
const LEGACY_PROJECTS_FILE = join(process.cwd(), "src", "data", "projects.json");

const resolveProjectsFile = () => {
  const configuredPath = process.env.PROJECTS_DATA_FILE?.trim();
  if (!configuredPath) return DEFAULT_PROJECTS_FILE;

  return isAbsolute(configuredPath)
    ? configuredPath
    : join(process.cwd(), configuredPath);
};

const PROJECTS_FILE = resolveProjectsFile();

const getReadableProjectsFile = () => {
  if (existsSync(PROJECTS_FILE)) return PROJECTS_FILE;
  if (PROJECTS_FILE !== LEGACY_PROJECTS_FILE && existsSync(LEGACY_PROJECTS_FILE)) {
    return LEGACY_PROJECTS_FILE;
  }
  return PROJECTS_FILE;
};

const isAuthorized = (request: NextRequest) => {
  const adminToken = process.env.PROJECTS_ADMIN_TOKEN?.trim();
  if (!adminToken) return false;

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  return token.length > 0 && token === adminToken;
};

export async function GET(request: NextRequest) {
  try {
    const readableFile = getReadableProjectsFile();

    if (!existsSync(readableFile)) {
      return NextResponse.json({ projects: [], canEdit: isAuthorized(request) });
    }

    const data = readFileSync(readableFile, "utf-8");
    const json = JSON.parse(data);
    return NextResponse.json({
      projects: Array.isArray(json.projects) ? json.projects : [],
      canEdit: isAuthorized(request),
    });
  } catch {
    return NextResponse.json(
      { projects: [], canEdit: isAuthorized(request) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Project edits are disabled in production" },
        { status: 403 }
      );
    }

    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      projects?: Array<{ id?: string; githubUrl?: string; title?: string }>;
    };

    // Validate input
    if (!body.projects || !Array.isArray(body.projects)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    // Validate each project has required fields
    for (const project of body.projects) {
      if (
        typeof project.id !== "string" ||
        typeof project.githubUrl !== "string" ||
        typeof project.title !== "string"
      ) {
        return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
      }
    }

    const projects = body.projects;

    mkdirSync(dirname(PROJECTS_FILE), { recursive: true });
    writeFileSync(PROJECTS_FILE, JSON.stringify({ projects }, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error saving" }, { status: 500 });
  }
}
