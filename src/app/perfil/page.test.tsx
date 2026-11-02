// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Perfil from "./page";

describe("Perfil Page", () => {
	it("renders main personal identity, role and status", () => {
		render(<Perfil />);

		expect(
			screen.getByRole("heading", { level: 1, name: /Gustavo Canales/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/Full Stack Engineer/i)).toBeInTheDocument();
		expect(screen.getByText(/DISPONIBLE PARA PROYECTOS/i)).toBeInTheDocument();
		expect(screen.getAllByText(/Ica, Perú/i).length).toBeGreaterThan(0);
	});

	it("renders direct actionable links (GitHub, LinkedIn, Email, Contacto)", () => {
		render(<Perfil />);

		const githubLink = screen.getByRole("link", { name: /GitHub/i });
		expect(githubLink).toHaveAttribute("href", "https://github.com/Gustav0C");

		const linkedinLink = screen.getByRole("link", { name: /LinkedIn/i });
		expect(linkedinLink).toHaveAttribute("href", "https://www.linkedin.com/in/gscp/");

		const emailLink = screen.getByRole("link", { name: /Email/i });
		expect(emailLink).toHaveAttribute("href", "mailto:gcanales58@gmail.com");

		const contactLinks = screen.getAllByRole("link", { name: /Contactar/i });
		expect(contactLinks[0]).toHaveAttribute("href", "/contacto");
	});

	it("renders engineering philosophy and core principles", () => {
		render(<Perfil />);

		expect(
			screen.getByRole("heading", { level: 2, name: /Criterio & Filosofía Técnica/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/ARQUITECTURA & TIPADO ESTRICTO/i)).toBeInTheDocument();
		expect(screen.getByText(/IA COMO MULTIPLICADOR/i)).toBeInTheDocument();
	});

	it("renders experience timeline with impact and technologies", () => {
		render(<Perfil />);

		expect(
			screen.getByRole("heading", { level: 2, name: /Experiencia & Trayectoria/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Proyectos Independientes & Freelance/i),
		).toBeInTheDocument();
	});

	it("renders technical arsenal skills categorized", () => {
		render(<Perfil />);

		expect(
			screen.getByRole("heading", { level: 2, name: /Arsenal Técnico/i }),
		).toBeInTheDocument();
		expect(screen.getByText(/FRONTEND & INTERFACES/i)).toBeInTheDocument();
		expect(screen.getByText(/BACKEND & DATOS/i)).toBeInTheDocument();
	});

	it("renders education and continuous formation", () => {
		render(<Perfil />);

		expect(
			screen.getByRole("heading", { level: 2, name: /Educación & Formación/i }),
		).toBeInTheDocument();
		expect(
			screen.getByText(/Carrera de Tecnología en Desarrollo de Software/i),
		).toBeInTheDocument();
	});
});
