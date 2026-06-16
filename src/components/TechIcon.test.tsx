/**
 * @vitest-environment jsdom
 */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TechIcon from "./TechIcon";

describe("TechIcon", () => {
	it("renders an SVG for a valid icon name", () => {
		const { container } = render(<TechIcon name="react" />);
		const svg = container.querySelector("svg");
		expect(svg).toBeInTheDocument();
	});

	it("renders null for an invalid icon name", () => {
		const { container } = render(
			<TechIcon name={"invalid" as never} />,
		);
		expect(container.firstChild).toBeNull();
	});

	it("applies grayscale filter when variant is grayscale", () => {
		const { container } = render(<TechIcon name="react" variant="grayscale" />);
		const span = container.querySelector("span");
		expect(span?.getAttribute("style")).toContain("grayscale(1)");
	});

	it("does not apply grayscale filter when variant is color", () => {
		const { container } = render(<TechIcon name="react" variant="color" />);
		const span = container.querySelector("span");
		expect(span?.getAttribute("style")).not.toContain("grayscale");
	});

	it("applies custom className", () => {
		const { container } = render(<TechIcon name="react" className="custom-class" />);
		const span = container.querySelector("span");
		expect(span?.className).toContain("custom-class");
	});

	it("sets aria-hidden to true by default", () => {
		const { container } = render(<TechIcon name="react" />);
		const span = container.querySelector("span");
		expect(span?.getAttribute("aria-hidden")).toBe("true");
	});

	it("renders all 20 icon names without errors", () => {
		const iconNames = [
			"react", "nextjs", "typescript", "js", "html5", "css3",
			"tailwindcss", "nodejs", "expressjs", "python", "postgresql",
			"mongodb", "redis", "docker", "git", "vercel", "aws", "vitejs",
			"eslint", "prettier",
		] as const;

		for (const name of iconNames) {
			const { container, unmount } = render(<TechIcon name={name} />);
			const svg = container.querySelector("svg");
			expect(svg).toBeInTheDocument();
			unmount();
		}
	});
});
