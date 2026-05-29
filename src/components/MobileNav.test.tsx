// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import type { AnchorHTMLAttributes } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MobileNav from "./MobileNav";

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

vi.mock("next/link", () => ({
	default: ({
		href,
		children,
		...props
	}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

describe("MobileNav", () => {
	it("abre y cierra el menú actualizando aria-expanded", () => {
		render(<MobileNav />);

		const toggleButton = screen.getByRole("button", {
			name: "Abrir menú de navegación",
		});

		expect(toggleButton).toHaveAttribute("aria-expanded", "false");

		fireEvent.click(toggleButton);

		expect(toggleButton).toHaveAttribute("aria-expanded", "true");
		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();

		fireEvent.click(toggleButton);

		expect(toggleButton).toHaveAttribute("aria-expanded", "false");
		expect(
			screen.queryByRole("link", { name: "Home" }),
		).not.toBeInTheDocument();
	});

	it("cierra el menú con tecla Escape", () => {
		render(<MobileNav />);

		const toggleButton = screen.getByRole("button", {
			name: "Abrir menú de navegación",
		});

		fireEvent.click(toggleButton);
		expect(screen.getByRole("link", { name: "Proyectos" })).toBeInTheDocument();

		fireEvent.keyDown(window, { key: "Escape" });

		expect(
			screen.queryByRole("link", { name: "Proyectos" }),
		).not.toBeInTheDocument();
		expect(toggleButton).toHaveAttribute("aria-expanded", "false");
	});
});
