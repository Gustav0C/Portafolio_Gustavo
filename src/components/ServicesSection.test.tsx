// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesSection from "./ServicesSection";

describe("ServicesSection", () => {
	it("renders section header and title", () => {
		render(<ServicesSection />);

		expect(
			screen.getByText("// 01. CAPACIDADES & SERVICIOS"),
		).toBeInTheDocument();
		expect(
			screen.getByRole("heading", {
				level: 2,
				name: /Soluciones de Software & Sistemas de IA/i,
			}),
		).toBeInTheDocument();
	});

	it("renders all three bento grid blocks with their tags", () => {
		render(<ServicesSection />);

		expect(
			screen.getByText("[01] FULL-STACK & PRODUCTOS DIGITALES"),
		).toBeInTheDocument();
		expect(
			screen.getByText("[02] AGENTES IA & AUTOMATIZACIÓN"),
		).toBeInTheDocument();
		expect(
			screen.getByText("[03] AUDITORÍA & RESCATE DE CÓDIGO IA"),
		).toBeInTheDocument();
	});

	it("renders value propositions and key bullet points", () => {
		render(<ServicesSection />);

		expect(
			screen.getByText(
				"Aplicaciones web y móviles escalables, desde la arquitectura inicial hasta producción.",
			),
		).toBeInTheDocument();
		expect(
			screen.getByText("MVPs funcionales en tiempo récord"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Apps móviles nativas/cross-platform"),
		).toBeInTheDocument();
		expect(
			screen.getByText("Agentes con tool-use y memoria"),
		).toBeInTheDocument();
		expect(
			screen.getByText("De prototipo inestable a producción limpia"),
		).toBeInTheDocument();
	});

	it("renders distinct conversion CTAs for each service", () => {
		render(<ServicesSection />);

		expect(screen.getByText("Cotizar proyecto")).toBeInTheDocument();
		expect(screen.getByText("Explorar soluciones")).toBeInTheDocument();
		expect(screen.getByText("Solicitar auditoría")).toBeInTheDocument();

		const contactLinks = screen.getAllByRole("link");
		expect(contactLinks).toHaveLength(3);
		for (const link of contactLinks) {
			expect(link).toHaveAttribute("href", "/contacto");
		}
	});
});
