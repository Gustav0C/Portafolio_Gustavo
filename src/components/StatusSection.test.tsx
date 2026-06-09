// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusSection from "./StatusSection";

function mockMatchMedia() {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
}

function mockIntersectionObserver() {
	class MockIntersectionObserver implements IntersectionObserver {
		readonly root: Element | Document | null = null;
		readonly rootMargin: string = "0px";
		readonly thresholds: ReadonlyArray<number> = [0.15];
		private callback: IntersectionObserverCallback;

		constructor(callback: IntersectionObserverCallback) {
			this.callback = callback;
		}

		observe(_target: Element) {
			// Simulate immediate intersection
			this.callback(
				[
					{
						isIntersecting: true,
						target: _target,
						intersectionRatio: 1,
						intersectionRect: new DOMRect(),
						boundingClientRect: new DOMRect(),
						rootBounds: null,
						time: Date.now(),
					} as IntersectionObserverEntry,
				],
				this,
			);
		}

		unobserve() {
			// noop
		}
		disconnect() {
			// noop
		}
		takeRecords(): IntersectionObserverEntry[] {
			return [];
		}
	}

	Object.defineProperty(window, "IntersectionObserver", {
		writable: true,
		value: MockIntersectionObserver,
	});
}

beforeEach(() => {
	vi.restoreAllMocks();
	mockMatchMedia();
	mockIntersectionObserver();
});

describe("StatusSection", () => {
	it("renders status labels (Estado, Respuesta, Email)", () => {
		render(<StatusSection />);

		expect(screen.getByText("Estado:")).toBeInTheDocument();
		expect(screen.getByText("Respuesta:")).toBeInTheDocument();
		expect(screen.getByText("Email:")).toBeInTheDocument();
	});

	it("renders status values", () => {
		render(<StatusSection />);

		expect(
			screen.getByText("Disponible para nuevos proyectos"),
		).toBeInTheDocument();
		expect(screen.getByText("< 24h")).toBeInTheDocument();
	});

	it("renders email as a clickable mailto link", () => {
		render(<StatusSection />);

		const emailLink = screen.getByText("gcanales58@gmail.com");
		expect(emailLink).toBeInTheDocument();
		expect(emailLink).toHaveAttribute(
			"href",
			"mailto:gcanales58@gmail.com",
		);
	});

	it("renders CTA link to /contacto", () => {
		render(<StatusSection />);

		const cta = screen.getByText("Contactar →");
		expect(cta).toBeInTheDocument();
		expect(cta).toHaveAttribute("href", "/contacto");
	});

	it("handles reduced motion gracefully — all content still renders", () => {
		// Override matchMedia to return reduced motion preference
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query: string) => ({
				matches: true,
				media: query,
				onchange: null,
				addListener: vi.fn(),
				removeListener: vi.fn(),
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});

		render(<StatusSection />);

		// All content should still render
		expect(screen.getByText("Estado:")).toBeInTheDocument();
		expect(
			screen.getByText("Disponible para nuevos proyectos"),
		).toBeInTheDocument();
		expect(screen.getByText("Contactar →")).toBeInTheDocument();
	});
});
