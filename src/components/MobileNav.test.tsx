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
		expect(screen.getByRole("link", { name: /Inicio/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Proyectos/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Perfil/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /Contacto/i })).toBeInTheDocument();

		// Close via close buttons (first is toggle, second is panel close)
		const closeButtons = screen.getAllByRole("button", {
			name: "Cerrar menú de navegación",
		});
		fireEvent.click(closeButtons[0]);

		expect(toggleButton).toHaveAttribute("aria-expanded", "false");
		expect(
			screen.queryByRole("link", { name: /Inicio/i }),
		).not.toBeInTheDocument();
	});

	it("cierra el menú con tecla Escape", () => {
		render(<MobileNav />);

		const toggleButton = screen.getByRole("button", {
			name: "Abrir menú de navegación",
		});

		fireEvent.click(toggleButton);
		expect(screen.getByRole("link", { name: /Proyectos/i })).toBeInTheDocument();

		fireEvent.keyDown(window, { key: "Escape" });

		expect(
			screen.queryByRole("link", { name: /Proyectos/i }),
		).not.toBeInTheDocument();
		expect(toggleButton).toHaveAttribute("aria-expanded", "false");
	});

	it("renders social links in footer when open", () => {
		render(<MobileNav />);

		fireEvent.click(screen.getByRole("button", { name: "Abrir menú de navegación" }));

		expect(screen.getByRole("link", { name: /GitHub/i })).toHaveAttribute(
			"href", "https://github.com/Gustav0C"
		);
		expect(screen.getByRole("link", { name: /LinkedIn/i })).toHaveAttribute(
			"href", "https://www.linkedin.com/in/gscp/"
		);
		expect(screen.getByRole("link", { name: /Email/i })).toHaveAttribute(
			"href", "mailto:gcanales58@gmail.com"
		);
	});

	it("closes menu when clicking backdrop", () => {
		render(<MobileNav />);

		fireEvent.click(screen.getByRole("button", { name: "Abrir menú de navegación" }));
		expect(screen.getByRole("dialog")).toBeInTheDocument();

		// Click the backdrop (the sibling element right before the dialog)
		const dialog = screen.getByRole("dialog");
		const backdrop = dialog.previousElementSibling as HTMLElement;
		fireEvent.click(backdrop);

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
	});
});
