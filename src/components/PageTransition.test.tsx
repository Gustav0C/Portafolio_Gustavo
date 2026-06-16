/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PageTransition from "./PageTransition";

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

beforeEach(() => {
	vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
		matches: false,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	})));
});

describe("PageTransition", () => {
	it("renders children", () => {
		render(
			<PageTransition>
				<div>Test content</div>
			</PageTransition>,
		);
		expect(screen.getByText("Test content")).toBeInTheDocument();
	});

	it("applies container class", () => {
		render(
			<PageTransition>
				<div>Test</div>
			</PageTransition>,
		);
		const wrapper = screen.getByText("Test").parentElement;
		expect(wrapper?.className).toContain("container");
	});

	it("does not apply fadeIn class on first render", () => {
		render(
			<PageTransition>
				<div>Test</div>
			</PageTransition>,
		);
		const wrapper = screen.getByText("Test").parentElement;
		expect(wrapper?.className).not.toContain("fadeIn");
	});

	it("renders without animation when prefers-reduced-motion is reduce", () => {
	vi.stubGlobal("matchMedia", vi.fn().mockImplementation(() => ({
			matches: true,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		})));

		render(
			<PageTransition>
				<div>Test</div>
			</PageTransition>,
		);
		const wrapper = screen.getByText("Test").parentElement;
		expect(wrapper?.className).not.toContain("fadeIn");
	});
});
