// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillsSection from "./SkillsSection";

describe("SkillsSection", () => {
	it("renders section header and title", () => {
		render(<SkillsSection />);

		expect(
			screen.getByText("// 02. ARSENAL TÉCNICO & HERRAMIENTAS"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /Stack de Especialidad & Tecnologías/i,
			}),
		).toBeInTheDocument();
	});

	it("renders all four core categories", () => {
		render(<SkillsSection />);

		expect(
			screen.getByRole("heading", { name: "FRONTEND & INTERFACES" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "BACKEND & PERSISTENCIA" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "IA & SISTEMAS AUTÓNOMOS" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "DEVOPS & CALIDAD" }),
		).toBeInTheDocument();
	});

	it("renders frontend grouped technologies without badges", () => {
		render(<SkillsSection />);

		expect(screen.getByText("React")).toBeInTheDocument();
		expect(screen.getByText("Next.js")).toBeInTheDocument();
		expect(screen.getByText("TypeScript")).toBeInTheDocument();
		expect(screen.getByText("HTML, CSS & JavaScript")).toBeInTheDocument();
	});

	it("renders backend with Supabase and without Redis", () => {
		render(<SkillsSection />);

		expect(screen.getByText("Node.js")).toBeInTheDocument();
		expect(screen.getByText("Python")).toBeInTheDocument();
		expect(screen.getByText("Supabase")).toBeInTheDocument();
		expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
		expect(screen.queryByText("Redis")).not.toBeInTheDocument();
	});

	it("renders cutting-edge AI tools and autonomous systems", () => {
		render(<SkillsSection />);

		expect(screen.getByText("OpenCode")).toBeInTheDocument();
		expect(screen.getByText("Claude Code")).toBeInTheDocument();
		expect(screen.getByText("Codex")).toBeInTheDocument();
		expect(screen.getByText("Agentes Autónomos")).toBeInTheDocument();
		expect(screen.getByText("Machine Learning")).toBeInTheDocument();
		expect(screen.getByText("Automatizaciones")).toBeInTheDocument();
	});

	it("renders diagnostic telemetry bar", () => {
		render(<SkillsSection />);

		expect(screen.getByText(/CORE_STACK:/i)).toBeInTheDocument();
		expect(screen.getByText(/PARADIGMA:/i)).toBeInTheDocument();
	});
});
