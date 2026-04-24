import { NextRequest, NextResponse } from "next/server";
import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

const PROJECTS_FILE = join(process.cwd(), "src", "data", "projects.json");

export async function GET() {
  try {
    if (!existsSync(PROJECTS_FILE)) {
      return NextResponse.json({ projects: [] });
    }
    
    const data = readFileSync(PROJECTS_FILE, "utf-8");
    const json = JSON.parse(data);
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ projects: [] }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    if (!body.projects || !Array.isArray(body.projects)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }
    
    // Validate each project has required fields
    for (const project of body.projects) {
      if (!project.id || !project.githubUrl || !project.title) {
        return NextResponse.json({ error: "Invalid project data" }, { status: 400 });
      }
    }
    
    const projects = body.projects;
    
    writeFileSync(PROJECTS_FILE, JSON.stringify({ projects }, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error saving" }, { status: 500 });
  }
}