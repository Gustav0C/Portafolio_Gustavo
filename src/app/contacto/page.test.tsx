// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Contacto from "./page";

vi.mock("next/navigation", () => ({
	usePathname: () => "/",
}));

function mockFetchSuccess() {
	return vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
		new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		}),
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe("Contacto A11y", () => {
	it("asocia errores con inputs mediante aria-describedby y aria-invalid", async () => {
		render(<Contacto />);

		const submitBtn = screen.getByRole("button", { name: /Enviar Mensaje/i });
		fireEvent.click(submitBtn);

		const nameInput = screen.getByLabelText(/Nombre/i);
		const emailInput = screen.getByLabelText(/Email/i);
		const messageInput = screen.getByLabelText(/Mensaje/i);

		expect(nameInput).toHaveAttribute("aria-invalid", "true");
		expect(nameInput).toHaveAttribute("aria-describedby", "contact-name-error");
		expect(screen.getByText(/El nombre es requerido/i)).toHaveAttribute(
			"role",
			"alert",
		);

		expect(emailInput).toHaveAttribute("aria-invalid", "true");
		expect(emailInput).toHaveAttribute(
			"aria-describedby",
			"contact-email-error",
		);

		expect(messageInput).toHaveAttribute("aria-invalid", "true");
		expect(messageInput).toHaveAttribute(
			"aria-describedby",
			"contact-message-error",
		);
	});

	it("anuncia éxito con role status y aria-live", async () => {
		mockFetchSuccess();
		render(<Contacto />);

		// Fill form
		fireEvent.change(screen.getByLabelText(/Nombre/i), {
			target: { value: "Test" },
		});
		fireEvent.change(screen.getByLabelText(/Email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(screen.getByLabelText(/Mensaje/i), {
			target: { value: "Este es un mensaje largo" },
		});

		fireEvent.click(screen.getByRole("button", { name: /Enviar Mensaje/i }));

		// Wait for fetch to resolve
		await new Promise((r) => setTimeout(r, 100));

		const successMsg = screen.getByText(/¡Mensaje enviado!/i).parentElement;
		expect(successMsg).toHaveAttribute("role", "status");
		expect(successMsg).toHaveAttribute("aria-live", "polite");
	});

	it("actualiza el resumen de errores en vivo", async () => {
		render(<Contacto />);

		const submitBtn = screen.getByRole("button", { name: /Enviar Mensaje/i });
		fireEvent.click(submitBtn);

		// Initially 3 errors
		expect(
			screen.getByText(/El formulario tiene 3 errores/i),
		).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText(/Nombre/i), {
			target: { value: "User" },
		});

		// Should update to 2 errors (since handleChange removes the error)
		expect(
			screen.getByText(/El formulario tiene 2 errores/i),
		).toBeInTheDocument();
	});
});
